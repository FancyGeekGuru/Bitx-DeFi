import React from 'react';
import './index.scss';

import LinkErrorPng from 'assets/img/link error.png';
import { logo } from './data';

type IStakingProps = {
    stake: string;
    earn: string;
    url: string;
};


const StakingSmallCard = (props: IStakingProps) => {
    return (
        <>
            {/* <Link to={props.url}> */}
                <div className="staking-small-card">
                    <div className="header-png-group">
                        <img src={logo[props.stake]} style={{ width: "20%" }} />
                        <img src={LinkErrorPng} style={{ height: "100%", marginLeft: "30px" }} />
                        <img src={logo[props.earn]} style={{ width: "20%", marginLeft: "30px" }} />
                    </div>

                    <div className='info' style={{ color: "#888888", paddingTop: "10px" }}>
                        <div>
                            <p className='heading'>APR</p>
                            <p className='data'>0 %</p>
                        </div>
                        <div>
                            <p className='heading'>APY</p>
                            {
                                props.stake == props.earn ? (
                                    <p className='data'>0%</p>
                                ) : (
                                    <p className='data'>NULL</p>
                                )
                            }

                        </div>
                        <div>
                            <p className='heading'>Staked</p>
                            <p className='data'>{"0" + props.stake}</p>
                        </div>
                        <div>
                            <p className='heading'>Stakers</p>
                            <p className='data'>{"0"}</p>
                        </div>
                    </div>

                    <div className="text-center" style={{ color: "gray" }}>
                        coming soon
                    </div>
                </div>
            {/* </Link> */}
        </>
    );
};

export default StakingSmallCard;