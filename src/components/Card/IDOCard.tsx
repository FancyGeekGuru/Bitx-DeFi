/* eslint-disable import/order */
import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import Countdown from 'react-countdown';
import { swtichSocialIcon } from 'utils/social';
import BTX_logo from 'assets/img/token logos/BTX.png';
import EGLD_logo from 'assets/img/token logos/EGLD.png';
import moment from 'moment';
import { Link } from 'react-router-dom';

const IDOCard = (props: any) => {
    const { data } = props;

    const ico_start_time = moment(data.ico_start).utc().toDate();

    console.log(ico_start_time);

    return (
        <>
            <div className='IDO-Card-box'>
                <Link className="position-absolute" to={`/ido-detail/${data.pool_name}`} style={{ width: "100%", height: "100%" }} />
                <div className="d-flex justify-content-between align-items-center">
                    <div className='d-flex flex-column'>
                        <span className='IDO-Card-title'>{data.name}</span>
                        <span className='IDO-Card-token-identifier mt-2'>${data.token}</span>
                    </div>
                    <div className='d-flex justify-content-end'>
                        <div>
                            <img src={BTX_logo} alt="BitX logo" width={'80px'} />
                        </div>
                        <div style={{ marginLeft: '-25px', marginTop: '56px' }}>
                            <img src={EGLD_logo} alt="BitX logo" width={'30px'} />
                        </div>
                    </div>
                </div>

                <div className='social-box mt-4'>
                    {
                        data.social_links.map((row, index) => {
                            return (
                                <a className='social-link' href={row.link} key={index} rel="noreferrer" target="_blank">
                                    {
                                        swtichSocialIcon(row.name)
                                    }
                                </a>
                            );
                        })
                    }
                </div>

                <div className='mt-4'>
                    <p className='IDO-prize'>{`1${data.currency} = ${data.ico_price}${data.token}`}</p>

                    <span>{"Progress (0.00%)"}</span>
                    <ProgressBar className='mt-1' now={0} />
                    <div className='d-flex justify-content-between mt-1'>
                        <span>{"0EGLD"}</span>
                        <span>{`-${data.currency}`}</span>
                    </div>

                    <div className='mt-4' style={{ fontSize: '15px' }}>
                        <div className='d-flex justify-content-between mt-1'>
                            <span>{"Liquidity %:"}</span>
                            <span>{`${data.liquidity_percent}%`}</span>
                        </div>

                        <div className='d-flex justify-content-between mt-1'>
                            <span>{"Lockup Time:"}</span>
                            <span>{`${data.lockup_time} days`}</span>
                        </div>

                        <div className='d-flex justify-content-between mt-1'>
                            <span>{"Starts:"}</span>
                            <span>{data.ico_start}</span>
                        </div>
                    </div>
                </div>

                <div className='d-flex justify-content-center mt-4'>
                    <Countdown className='IDO-Card-Countdown' date={ico_start_time} autoStart />
                </div>
            </div>
        </>
    );
};

export default IDOCard;