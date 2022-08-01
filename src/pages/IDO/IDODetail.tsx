/* eslint-disable import/order */
import React, { useEffect, useState } from 'react';
import { ProgressBar, Row, Col } from 'react-bootstrap';
import Countdown from 'react-countdown';
import { ImEarth } from "react-icons/im";
import { SiTelegram, SiDiscord, SiTwitter, SiYoutube, SiLinkedin, SiMedium } from "react-icons/si";
import BTX_logo from 'assets/img/token logos/BTX.png';
import { paddingTwoDigits } from 'utils/convert';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from 'store/selectors';
import { fetchIDODetail } from "store/actions/thunks/IDO";
import { useLocation } from "react-router-dom";
import moment from 'moment';
import { swtichSocialIcon } from 'utils/social';
import { numberWithCommas } from 'utils/convert';

const IDODetail = () => {
    interface Props {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        completed: boolean;
    }

    const dispatch = useDispatch();
    const IDOState = useSelector(selectors.IDOState);
    const currentPoolDetail = IDOState.currentPoolDetail.data;

    const location = useLocation();
    useEffect(() => {
        const pathname = location.pathname;
        const pool_detail_name = pathname.substring(pathname.lastIndexOf('/') + 1);
        dispatch(fetchIDODetail({ data: pool_detail_name }));
    }, []);

    const renderer: React.FC<Props> = ({ days, hours, minutes, seconds }) => {
        return (
            <div className='ido-custom-timer color-white'>
                <div className='ido-customer-timer-time'>{paddingTwoDigits(days)}</div>
                <div className='ido-customer-timer-time ml-2'>{paddingTwoDigits(hours)}</div>
                <div className='ido-customer-timer-time ml-2'>{paddingTwoDigits(minutes)}</div>
                <div className='ido-customer-timer-time ml-2'>{paddingTwoDigits(seconds)}</div>
            </div>
        );
    };

    return (
        <>
            <div className='home-container mb-5'>
                <Row>
                    <Col lg={4}>
                        <div className='IDO-Card-box'>
                            <div className="d-flex align-items-center">
                                <div className='d-flex'>
                                    <div>
                                        <img src={BTX_logo} alt="BitX logo" width={'80px'} />
                                    </div>
                                </div>
                                <div className='d-flex flex-column ml-5'>
                                    <span className='IDO-Card-title'>{currentPoolDetail.name}</span>
                                    <span className='IDO-Card-token-identifier mt-2'>{`${currentPoolDetail.token}/${currentPoolDetail.currency}`}</span>
                                </div>
                            </div>

                            <div className='mt-4'>
                                <div className='connect-but-box d-flex justify-content-center'>
                                    <button className='ido-card-but'> Connect Wallet </button>
                                </div>

                                <div className='d-flex flex-column mt-3'>
                                    <span className='IDO-prize'>{`1${currentPoolDetail.currency} = 400${currentPoolDetail.token}`}</span>
                                    <span className='IDO-prize' style={{ fontSize: '13px' }}>{`1${currentPoolDetail.token} = $0.125`}</span>
                                </div>

                                <div className='mt-3'>
                                    <span>{"Progress (0.00%)"}</span>
                                    <ProgressBar className='mt-1' now={0} />
                                    <div className='d-flex justify-content-between mt-1'>
                                        <span>{`0 ${currentPoolDetail.currency}`}</span>
                                        <span>{`- ${currentPoolDetail.token}`}</span>
                                    </div>
                                </div>
                            </div>

                            <div className='d-flex justify-content-center mt-4'>
                                <Countdown className='IDO-Card-Countdown' date={moment(currentPoolDetail.ico_start).utc().toDate()} renderer={renderer} autoStart />
                            </div>

                            <div className='mt-4 d-flex'>
                                <input className='ido-input' />
                                <button className='ido-card-but ml-2' style={{ padding: '5px 10px' }}> MAX </button>
                            </div>

                            <div className='d-flex justify-content-center mt-4'>
                                <button className='ido-card-buy-but'> Buy </button>
                            </div>

                        </div>

                        <div className='IDO-Card-box mt-4' style={{ border: "none", fontSize: '14px', padding: "30px" }}>
                            <div className='d-flex justify-content-between'>
                                <span>Registration Start: </span>
                                <span style={{ color: 'white' }}>{`${currentPoolDetail.registration_start}`}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-2'>
                                <span>Registration Start: </span>
                                <span style={{ color: 'white' }}>{`${currentPoolDetail.registration_end}`}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-2'>
                                <span>Minimum Buy: </span>
                                <span style={{ color: 'white' }}>{`${currentPoolDetail.minimum_buy} ${currentPoolDetail.currency}`}</span>
                            </div>
                            <div className='d-flex justify-content-between mt-2'>
                                <span>Maximum Buy: </span>
                                <span style={{ color: 'white' }}>{`- ${currentPoolDetail.currency}`}</span>
                            </div>
                        </div>
                    </Col>

                    <Col lg={8}>
                        <div className='IDO-Card-box'>
                            <div className="d-flex align-items-center">
                                <div className='d-flex'>
                                    <div>
                                        <img src={BTX_logo} alt="BitX logo" width={'60px'} />
                                    </div>
                                </div>
                                <div className='d-flex flex-column ml-4'>
                                    <span className='IDO-Card-title' style={{ fontSize: '20px' }}>{currentPoolDetail.token}</span>
                                </div>
                            </div>

                            <div className='mt-3'>
                                <div style={{ fontSize: '16px' }}>{currentPoolDetail.description}</div>
                                <div className='mt-2' style={{ fontSize: '16px', color: '#E3E3E3' }}>{"Your investment is protected, this sale is under the Safeguarded Launch Protocol rules."}</div>
                            </div>

                            <div className='social-box mt-4'>
                                {
                                    currentPoolDetail.social_links?.map((row, index) => {
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

                            <div className='mt-5'>
                                <div className='d-flex flex-column' style={{ rowGap: '6px' }}>
                                    <p style={{ fontSize: '22px', color: "#6a9b84", fontWeight: '700' }}>TOKEN</p>
                                    <div>
                                        <span>Token: </span>
                                        <span style={{ color: '#6a9b84' }}>{currentPoolDetail.token}</span>
                                    </div>
                                    <div>
                                        <span>Token Identifier: </span>
                                        <span style={{ color: '#6a9b84' }}>{currentPoolDetail.token_identifier}</span>
                                    </div>
                                    <div>
                                        <span>Token Decimal: </span>
                                        <span style={{ color: '#6a9b84' }}>{currentPoolDetail.token_decimal}</span>
                                    </div>
                                    <div>
                                        <span>Total Supply: </span>
                                        <span style={{ color: '#6a9b84' }}>{`${numberWithCommas(currentPoolDetail.total_supply)} ${currentPoolDetail.token}`}</span>
                                    </div>
                                    <div>
                                        <span>Tokens For Presale: </span>
                                        <span style={{ color: '#6a9b84' }}>{`${numberWithCommas(currentPoolDetail.tokens_for_presale)} ${currentPoolDetail.token}`}</span>
                                    </div>
                                    <div>
                                        <span>Tokens For Liquidity: </span>
                                        <span style={{ color: '#6a9b84' }}>{`${numberWithCommas(currentPoolDetail.tokens_for_liquidity)} ${currentPoolDetail.token}`}</span>
                                    </div>
                                </div>

                                <div className='d-flex flex-column mt-5' style={{ rowGap: '6px' }}>
                                    <p style={{ fontSize: '20px', color: "#6a9b84", fontWeight: '700' }}>PRICE</p>
                                    <div>
                                        <span>IDO: </span>
                                        <span style={{ color: '#6a9b84' }}>$0.125</span>
                                    </div>
                                </div>

                                <div className='d-flex flex-column mt-5' style={{ rowGap: '6px' }}>
                                    <p style={{ fontSize: '20px', color: "#6a9b84", fontWeight: '700' }}>POOL DETAILS</p>
                                    <div>
                                        <span>Soft Cap: </span>
                                        <span style={{ color: '#6a9b84' }}>{`${currentPoolDetail.soft_cap} ${currentPoolDetail.currency}`}</span>
                                    </div>
                                    <div>
                                        <span>Hard Cap: </span>
                                        <span style={{ color: '#6a9b84' }}>{`${currentPoolDetail.hard_cap} ${currentPoolDetail.currency}`}</span>
                                    </div>
                                    <div>
                                        <span>Liquidity Percent: </span>
                                        <span style={{ color: '#6a9b84' }}>{currentPoolDetail.liquidity_percent}%</span>
                                    </div>
                                    <div>
                                        <span>Lockup Time: </span>
                                        <span style={{ color: '#6a9b84' }}>{`${currentPoolDetail.lockup_time} days`}</span>
                                    </div>
                                    <div>
                                        <span>Starts / end: </span>
                                        <span style={{ color: '#6a9b84' }}>{`${currentPoolDetail.ico_start} - ${currentPoolDetail.ico_end}`}</span>
                                    </div>
                                    <div>
                                        <span>Listing On: </span>
                                        <span style={{ color: '#6a9b84' }}>{currentPoolDetail.listing_on}</span>
                                    </div>
                                    <div>
                                        <span>Registration: </span>
                                        <span style={{ color: '#6a9b84' }}>{`${currentPoolDetail.registration_start} - ${currentPoolDetail.registration_end}`}</span>
                                    </div>
                                </div>

                                <div className='d-flex flex-column mt-5' style={{ rowGap: '6px' }}>
                                    <p style={{ fontSize: '20px', color: "#6a9b84", fontWeight: '700' }}>DISTRIBUTION</p>
                                    <div>
                                        <span>Distribution: </span>
                                        <span style={{ color: '#6a9b84' }}>Claimed on BitX IDO Launchpad</span>
                                    </div>
                                    <div>
                                        <span>Vesting: </span>
                                        <span style={{ color: '#6a9b84' }}>Loerem Ipsum dollar</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default IDODetail;