import React from 'react';
import { Row, Col } from 'react-bootstrap';

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
    TypedValue,
    ArgSerializer,
    GasLimit,
    DefaultSmartContractController,
    U32Value,
    U64Value,
    BytesValue,
} from '@elrondnetwork/erdjs';

import NFTPng from 'assets/img/NFT staking.png';
import './index.scss';
import { NFT_collections } from './data';

import {
    NFT_STAKING_CONTRACT_ABI_URL,
    NFT_STAKING_CONTRACT_NAME,
    NFT_STAKING_CONTRACT_ADDRESS,
    LKMEX_TOKEN_DECIMALS,
} from 'config';
import {
    IContractInteractor,
    convertWeiToEsdt,
    TIMEOUT,
    SECOND_IN_MILLI,
    getBtxNfts,
    getCurrentTimestamp,
} from 'utils';

import SilverPng from 'assets/img/nft mint/new/SILVER PIC.png';
import BronzePng from 'assets/img/nft mint/new/BRONZE PIC.png';
import GoldPng from 'assets/img/nft mint/new/GOLD PIC.png';

function getUrlOfNft(collection: string) {
    if (collection.search('GOLD') >= 0) return GoldPng;
    else if (collection.search('SILVER') >= 0) return SilverPng;
    else return BronzePng;
}

const NFTStaking = () => {
    const { account, address } = useGetAccountInfo();
    const { network } = useGetNetworkConfig();
    const { hasPendingTransactions } = useGetPendingTransactions();
    const provider = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });

    const [contractInteractor, setContractInteractor] = React.useState<IContractInteractor | undefined>();
    // load smart contract abi and parse it to SmartContract object for tx
    React.useEffect(() => {
        (async () => {
            const registry = await AbiRegistry.load({ urls: [NFT_STAKING_CONTRACT_ABI_URL] });
            const abi = new SmartContractAbi(registry, [NFT_STAKING_CONTRACT_NAME]);
            const contract = new SmartContract({ address: new Address(NFT_STAKING_CONTRACT_ADDRESS), abi: abi });
            const controller = new DefaultSmartContractController(abi, provider);

            // console.log('contractInteractor', {
            //     contract,
            //     controller,
            // });

            setContractInteractor({
                contract,
                controller,
            });
        })();
    }, []); // [] makes useEffect run once

    const [stakeSetting, setStakeSetting] = React.useState<any>();
    React.useEffect(() => {
        (async () => {
            if (!contractInteractor) return;
            const interaction = contractInteractor.contract.methods.viewStakeSetting();
            const res = await contractInteractor.controller.query(interaction);

            if (!res || !res.returnCode.isSuccess()) return;
            const value = res.firstValue.valueOf();

            const lkmex_collection_id = value.lkmex_collection_id.toString();
            const lkmex_total_amount = convertWeiToEsdt(value.lkmex_total_amount, LKMEX_TOKEN_DECIMALS);
            const lkmex_tokens = value.lkmex_tokens.map(v => {
                return {
                    token_identifier: v.token_identifier.toString(),
                    token_nonce: v.token_nonce.toNumber(),
                    amount: convertWeiToEsdt(v.amount, LKMEX_TOKEN_DECIMALS),
                };
            });
            const nft_collections = value.nft_collections.map(v => {
                return {
                    collection_id: v.collection_id.toString(),
                    reward_rate: convertWeiToEsdt(v.reward_rate, LKMEX_TOKEN_DECIMALS),
                    staked_amount: v.staked_amount.toNumber(),
                };
            });
            const total_staked_amount = value.total_staked_amount.toNumber();
            const number_of_stakers = value.number_of_stakers.toNumber();

            const stakeSetting = {
                lkmex_collection_id,
                lkmex_total_amount,
                lkmex_tokens,
                nft_collections,
                total_staked_amount,
                number_of_stakers,
            };

            console.log('stakeSetting', stakeSetting);
            setStakeSetting(stakeSetting);
        })();
    }, [contractInteractor]);

    const [stakeAccount, setStakeAccount] = React.useState<any>();
    React.useEffect(() => {
        (async () => {
          if (!contractInteractor || !address) return;
          const args = [new AddressValue(new Address(address))];
          const interaction = contractInteractor.contract.methods.viewStakeAccount(args);
          const res = await contractInteractor.controller.query(interaction);
    
          if (!res || !res.returnCode.isSuccess()) return;
          const value = res.firstValue.valueOf();
    
          let total_reward_amount = 0;
          const nfts = value.nfts.map(v => {
              const collection = v.collection_id.toString();
              const reward_amount = convertWeiToEsdt(v.reward_amount, LKMEX_TOKEN_DECIMALS);
              total_reward_amount += reward_amount;
              return {
                nft_id: v.nft_id.toNumber(),
                identifier: v.nft_id.toNumber(),
                collection,
                nonce: v.nft_nonce.toNumber(),
                url: getUrlOfNft(collection),
                reward_amount,
                last_claimed_timestamp: v.last_claimed_timestamp.toNumber() * SECOND_IN_MILLI,
              };
          });

          const result = {
            nfts,
            total_reward_amount,
          };
    
          console.log('BTX viewStakeAccount', result);
          setStakeAccount(result);
        })();
      }, [address, contractInteractor, hasPendingTransactions]);

    const [nftsInWallet, setNftsInWallet] = React.useState<any>();
    React.useEffect(() => {
        if (!address || !stakeSetting) return;

        (async() => {
            const nfts = await getBtxNfts(network.apiAddress, account, stakeSetting.nft_collections);
            // console.log('nftsInWallet', nfts);
            setNftsInWallet(nfts);
        })();
    }, [address, stakeSetting, hasPendingTransactions]);

    //////////////////////////////////////////////////////////////////////
    const handleClaimButClicked = async (nft) => {
        const args: TypedValue[] = [
            new U64Value(nft.nft_id),
        ];
        const { argumentsString } = new ArgSerializer().valuesToString(args);
        const data = `claim@${argumentsString}`;
    
        const tx = {
            receiver: NFT_STAKING_CONTRACT_ADDRESS,
            gasLimit: new GasLimit(10000000),
            data: data,
        };
    
        await refreshAccount();
        sendTransactions({
            transactions: tx,
        });
    };

    async function handleStakeButClicked(nft) {
        console.log('nft', nft);

        const args: TypedValue[] = [
            BytesValue.fromUTF8(nft.collection),
            new U64Value(nft.nonce),
            new U64Value(1),
            new AddressValue(new Address(NFT_STAKING_CONTRACT_ADDRESS)),
            BytesValue.fromUTF8('stake'),
        ];
        const { argumentsString } = new ArgSerializer().valuesToString(args);
        const data = `ESDTNFTTransfer@${argumentsString}`;
    
        const tx = {
            receiver: address,
            gasLimit: new GasLimit(10000000),
            data: data,
        };
    
        await refreshAccount();
        sendTransactions({
            transactions: tx,
        });
    }

    const handleUnStakeButClicked = async (nft) => {
        const args: TypedValue[] = [
            new U64Value(nft.nft_id),
        ];
        const { argumentsString } = new ArgSerializer().valuesToString(args);
        const data = `unstake@${argumentsString}`;
    
        const tx = {
            receiver: NFT_STAKING_CONTRACT_ADDRESS,
            gasLimit: new GasLimit(10000000),
            data: data,
        };
    
        await refreshAccount();
        sendTransactions({
            transactions: tx,
        });
    };

    return (
        <div className="home-container mb-5" style={{ fontFamily: 'Segoe UI', color: '#D9D9D9' }}>
            <Row className="d-flex justify-content-center align-items-center text-center">
                <div className='d-flex justify-content-center align-items-center text-center'>
                    <div className="state-box">
                        <span>My Staked NFTs</span>
                        <span>{stakeAccount ? stakeAccount.nfts.length : '-'}</span>
                    </div>
                    <div className="state-box ml-5">
                        <span>Total Reward</span>
                        <span>{stakeAccount ? stakeAccount.total_reward_amount : '-'} LKMEX</span>
                    </div>
                </div>
                <div>
                    <img src={NFTPng} alt="NFT Staking" width='60%' />
                </div>
                <div className='d-flex justify-content-center align-items-center text-center'>
                    <div className="state-box">
                        <span>Total Staked NFTs</span>
                        <span>{stakeSetting ? stakeSetting.total_staked_amount : '-'}</span>
                    </div>
                    <div className="state-box  ml-5">
                        <span>Number of Stakers</span>
                        <span>{stakeSetting ? stakeSetting.number_of_stakers : '-'}</span>
                    </div>
                </div>
            </Row>

            <div className='mt-4 d-flex justify-content-center flex-column align-items-center text-center'>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>$BTX Staking</p>
                <div className='staking-description'>
                    <span>{"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu nibh bibendum, dictum nibh eu, ultricies lectus. Nullam metus eros, lacinia quis condimentum at, sagittis eu sapien. Suspendisse suscipit orci nec eros elementum"}</span>
                </div>
            </div>

            <p className="mt-5 text-center" style={{ fontSize: "15px", fontWeight: '600', background: 'rgba(0,0,0,0.15)', padding: '8px', borderRadius: '10px' }}>Staked</p>
            <div className='d-flex justify-content-between'>
                {/* <span className='claim-all' onClick={handleClaimAll}>Claim All</span> */}
                <span>{stakeAccount ? stakeAccount.nfts.length : '-'} items staked</span>
            </div>

            <Row className="mt-4">
                {
                    stakeAccount && stakeAccount.nfts.map((NFT, index) => {
                        return (
                            <Col sm="6" md="4" lg="3" key={index}>
                                <div className='staking-card'>
                                    <img src={NFT.url} width='100%' />
                                    <div style={{ padding: '8px 15px' }}>
                                        <div className='d-flex justify-content-between' >
                                            <span>{NFT.name}</span>
                                        </div>
                                        <div className='mt-2'>
                                            <span>{'Reward: ' + NFT.reward_amount + ' LKMEX'}</span>
                                        </div>

                                        <div className='mt-2 d-flex justify-content-center'>
                                            <button className='unstake-but' onClick={() => handleUnStakeButClicked(NFT)}> Unstake </button>
                                            <button className='claim-but ml-2' onClick={() => handleClaimButClicked(NFT)}> Claim </button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        );
                    })
                }
            </Row>

            <p className="mt-5 text-center" style={{ fontSize: "15px", fontWeight: '600', background: 'rgba(0,0,0,0.15)', padding: '8px', borderRadius: '10px' }}>In My Wallet</p>
            <Row className="mt-4">
                {
                    nftsInWallet && nftsInWallet.length > 0 && nftsInWallet.map((NFT, index) => {
                        return (
                            <Col sm="6" md="4" lg="3" key={index}>
                                <div className='staking-card'>
                                    <img src={NFT.url} width='100%' />
                                    <div style={{ padding: '8px 15px' }}>
                                        <div className='d-flex justify-content-between' >
                                            <span>{NFT.name}</span>
                                            <span>{NFT.reward_rate + ' LKMEX'}</span>
                                        </div>

                                        <div className='mt-3 d-flex justify-content-center'>
                                            <button className='claim-but' onClick={() => handleStakeButClicked(nftsInWallet[index])}> STAKE </button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        );
                    })
                }
            </Row>
        </div>
    );
};

export default NFTStaking;