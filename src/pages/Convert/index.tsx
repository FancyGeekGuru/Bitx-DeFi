import * as React from 'react';
import {
  refreshAccount,
  sendTransactions,
  useGetAccountInfo,
  useGetNetworkConfig,
  useGetPendingTransactions,
} from '@elrondnetwork/dapp-core';
import {
  Address,
  AddressValue,
  AbiRegistry,
  SmartContractAbi,
  SmartContract,
  ProxyProvider,
  DefaultSmartContractController,
  BytesValue,
  ArgSerializer,
  BigUIntValue,
  TypedValue,
} from '@elrondnetwork/erdjs';

import {
  Col,
  ProgressBar
} from 'react-bootstrap';
import './index.scss';
import BitXLogo from 'assets/img/BTX logo back.png';
import ElrondLogo from 'assets/img/Elrond logo.png';
import whiteListLogo from 'assets/img/whitelist.svg';
import {
  EXCHANGE_RATE,
  MIN_BUY_LIMIT,
  MAX_BUY_LIMIT,
  CONVERT_CONTRACT_ADDRESS,
  CONVERT_CONTRACT_ABI_URL,
  CONVERT_CONTRACT_NAME,
} from 'config';
import {
  TIMEOUT,
  Status,
  ISaleStatusProvider,
  IAccountStateProvider,
  SECOND_IN_MILLI,
  precisionRound,
  IContractInteractor,
  convertToStatus,
  convertWeiToEsdt,
  getBalanceOfToken,
} from 'utils';
import { convertEsdtToWei } from '../../utils/convert';


const Presale = () => {
  const { account } = useGetAccountInfo();
  const { network } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const proxyProvider = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });

  const [contractInteractor, setContractInteractor] = React.useState<IContractInteractor | undefined>();
  React.useEffect(() => {
    (async () => {
      const registry = await AbiRegistry.load({ urls: [CONVERT_CONTRACT_ABI_URL] });
      const abi = new SmartContractAbi(registry, [CONVERT_CONTRACT_NAME]);
      const contract = new SmartContract({ address: new Address(CONVERT_CONTRACT_ADDRESS), abi: abi });
      const controller = new DefaultSmartContractController(abi, proxyProvider);

      setContractInteractor({
        contract,
        controller,
      });
    })();
  }, []); // [] makes useEffect run once

  const [convertSetting, setConvertSetting] = React.useState<any>();
  React.useEffect(() => {
    (async () => {
      if (!contractInteractor) return;
      const interaction = contractInteractor.contract.methods.viewConvertSetting();
      const res = await contractInteractor.controller.query(interaction);

      if (!res || !res.returnCode.isSuccess()) return;
      const value = res.firstValue?.valueOf();

      const old_token_id = value.old_token_id.toString();
      const new_token_id = value.new_token_id.toString();
      const old_token_amount = convertWeiToEsdt(value.old_token_amount);
      const new_token_amount = convertWeiToEsdt(value.new_token_amount);
      
      const result = { old_token_id, new_token_id, old_token_amount, new_token_amount };
      console.log('viewConvertSetting', result);
      setConvertSetting(result);
    })();
  }, [contractInteractor, hasPendingTransactions]);

  const [buyAmountInEgld, setBuyAmountInEgld] = React.useState<number>(0);
  const [buyAmountInEsdt, setBuyAmountInEsdt] = React.useState<number>(0);

  React.useEffect(() => {
    if (!account) return;
    (async () => {
      setBuyAmountInEgld(await getBalanceOfToken(network.apiAddress, account, 'BTX-48d004'));
    })();
  }, [account, hasPendingTransactions]);
  
  React.useEffect(() => {
    setBuyAmountInEsdt(buyAmountInEgld / 10);
  }, [buyAmountInEgld]);

  async function convert() {    
    const args: TypedValue[] = [
      BytesValue.fromUTF8('BTX-48d004'),
      new BigUIntValue(convertEsdtToWei(buyAmountInEgld)),
      BytesValue.fromUTF8('convert'),
    ]; 
    const { argumentsString } = new ArgSerializer().valuesToString(args);
    const data = `ESDTTransfer@${argumentsString}`;
  
    const tx = {
      data,
      receiver: CONVERT_CONTRACT_ADDRESS,
      gasLimit: 10000000,
    };
    await refreshAccount();
    await sendTransactions({
      transactions: tx
    });
  }

  return (
    <>
      <div className='bitxwrapper background-1'>
        <div className='container'>
          <Col md={12} lg={6} className='custom-presale-col'>
            <div className='custom-presale-left'>
              <h1 className='custom-presale-header color-white'>Convert Old BTX token to new one!</h1>
              <div className='custom-presale-price'>10 BTX-48d004 {'('}Old{')'} = 1 BTX-0f676d {'('}New{')'}</div>
              <div className='custom-presale-price'>Collected Old Token: {convertSetting && convertSetting.old_token_amount} BTX</div>
              <div className='custom-presale-price'>Converted New Token: {convertSetting && convertSetting.new_token_amount} BTX</div>
            </div>
          </Col>
          <Col md={12} lg={6} className='custom-presale-col'>
            <div className='custom-buy-card'>
              <div className='custom-buy-card-body'>
                <h3 className='custom-buy-card-header color-white'>Convert</h3>
                <div className='custom-buy-card-amount'>
                  <div className='custom-buy-card-amount-header'>Amount Of Old Token</div>
                  <div className='custom-buy-card-amount-container'>
                    <input className='custom-buy-card-amount-input' type='number' disabled={true} value={buyAmountInEgld} />
                    <span className='custom-buy-card-amount-unit color-white'>BTX-48d004</span>
                  </div>
                </div>
                <div className='custom-buy-card-amount'>
                  <div className='custom-buy-card-amount-header'>Amount Of New Token</div>
                  <div className='custom-buy-card-amount-container'>
                    <input className='custom-buy-card-amount-input' type='number' disabled={true} value={buyAmountInEsdt} />
                    <span className='custom-buy-card-amount-unit color-white'>BTX-0f676d</span>
                  </div>
                </div>

                <img className="logo-back-elrond" src={BitXLogo} />
                <img className="logo-back-bitx" src={BitXLogo} />

                <div style={{ paddingTop: '50px' }}>
                  <button className="custom-buy-card-buy-button" onClick={convert}>Convert</button>
                </div>
              </div>
            </div>
          </Col>
        </div>
      </div >
    </>
  );
};

export default Presale;
