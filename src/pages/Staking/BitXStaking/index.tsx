import React, { useState } from 'react';
import './index.scss';

// import bgVector from '../../assets/img/bgVector.png';
import Btx2BtxStakingCard from './Bitx2Bitx';
import Bitx2Mex from './Bitx2Mex';

const Staking = () => {
    return (
        <div className='bitxwrapper'>
            {/* <img src={bgVector} className='bgVector'/> */}
            <div className='container'>
                <Btx2BtxStakingCard />
                <Bitx2Mex />
            </div>
        </div>
    );
};

export default Staking;
