import React, {useState} from 'react';

import './index.scss';

import bgVector from '../../assets/img/bgVector.png';
import Dice2Dice from './Dice2Dice';
import Bitx2Dice from './Bitx2Dice';

const DiceStaking = () => {
    return (
        <div className='bitxwrapper'>
            <img src={bgVector} className='bgVector'/>
            <div className='container'>
                <Dice2Dice />
                <Bitx2Dice />
            </div>
        </div>
    );
};

export default DiceStaking;
