import React, {useState} from 'react';

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
  BytesValue,
  Egld,
  BigUIntValue,
  ArgSerializer,
  TransactionPayload,
  GasLimit,
  DefaultSmartContractController,
} from '@elrondnetwork/erdjs';

import axios from 'axios';
import Modal from 'react-modal';
import { Modal as BsModal, Button } from 'react-bootstrap';

import bgVector from '../../assets/img/bgVector.png';
import down from '../../assets/img/down.png';
import up from '../../assets/img/up.png';
import btxLogo from '../../assets/img/bitx-logo.jpg';
import dollarPot from '../../assets/img/dollarPot.png';
import stake_reward_bg from '../../assets/img/stake_reward_bg.png';
import arrow from '../../assets/img/arrow.png';
import './index.scss';
import AlertModal from '../../components/AlertModal';

import {
  BTX2BTX_CONTRACT_ADDRESS,
  BTX2BTX_CONTRACT_ABI,
  BTX2BTX_CONTRACT_NAME,
  BTX_TOKEN_NAME,
  BTX_TOKEN_ID,
} from '../../config';

import {
  SECOND_IN_MILLI,
  TIMEOUT,
  convertWeiToEgld,
  convertTimestampToDateTime,
  convertSecondsToDays,
  IContractInteractor,
  IStakeSetting,
  IStakeAccount,
} from '../../utils';

import Btx2BtxStakingCard from './Bitx2Bitx';
import Bitx2Mex from './Bitx2Mex';

const Staking = () => {
    return (
        <div className='bitxwrapper'>
            <img src={bgVector} className='bgVector'/>
            <div className='container'>
                <Btx2BtxStakingCard />
                <Bitx2Mex />
            </div>
        </div>
    );
};

export default Staking;
