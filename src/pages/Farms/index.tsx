import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { AiFillLock } from "react-icons/ai";
import BTXLogo from 'assets/img/token logos/BTX.png';
import EGLDLogo from 'assets/img/token logos/EGLD.png';
import './index.scss';

const Farms = () => {
    return (
        <div className="home-container mb-5" style={{ fontFamily: 'Segoe UI', color: 'white' }}>
            <div className='text-center d-flex flex-column'>
                <span style={{ fontFamily: 'Segoe UI', fontWeight: '600', fontSize: '30px' }}>FARMS 🚜</span>
                <span style={{ color: '#707070' }}>{"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}</span>
            </div>

            <div className='d-flex align-items-center justify-content-center' style={{ marginTop: '30px' }}>
                <div className='farms-info-card'>
                    <Row className='d-flex align-items-center'>
                        <Col sm='6'>
                            <div className='d-flex flex-column'>
                                <span style={{ fontSize: '15px' }}> Total Value Locked on Farms </span>
                                <span style={{ fontSize: '20px', color: '#FEE277' }}> $ 693,805,768 </span>
                            </div>
                        </Col>
                        <Col sm='6'>
                            <div className='d-flex flex-column' style={{ fontSize: '14px', gap: '6px' }}>
                                <span> 1 BTX = <span style={{ color: '#FEE277' }}>$ 0.1234567</span></span>
                                <span> Market Cap: <span style={{ color: '#FEE277' }}> $ 557,824,072</span></span>
                                <span> Est. Weekly Rewards: <span style={{ color: '#FEE277' }}>$ 10,912,129 </span></span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            <p style={{ fontSize: '18px', color: '#B5B5B5', marginTop: '30px' }}>Staking Farms</p>

            <div className='farm-card'>
                <Row className='d-flex align-items-center'>
                    <Col lg='3'>
                        <div className='d-flex align-items-center'>
                            <div>
                                <img src={BTXLogo} alt='BTX logo' width={'40px'} />
                            </div>

                            <div className='d-flex flex-column' style={{ marginLeft: '30px', gap: '5px' }}>
                                <span style={{ fontWeight: '600', fontSize: '16px' }}> Stake BTX / LKMEX</span>
                                <span> $ 381,826,657 </span>
                            </div>
                        </div>
                    </Col>

                    <Col md='4' lg='2'>
                        <div className='d-flex flex-column' style={{ gap: '5px' }}>
                            <span style={{ fontSize: '14px', color: '#B5B5B5' }}> APR </span>
                            <div className='d-flex align-items-center'>
                                <span> 21% /</span>
                                <AiFillLock className='ml-2 mr-1' />
                                <span> 78%</span>
                            </div>
                        </div>
                    </Col>

                    <Col md='4' lg='2'>
                        <div className='d-flex flex-column' style={{ gap: '5px' }}>
                            <span style={{ fontSize: '14px', color: '#B5B5B5' }}> My Staked BTX </span>
                            <span> 0 </span>
                        </div>
                    </Col>

                    <Col md='4' lg='2'>
                        <div className='d-flex flex-column' style={{ gap: '5px' }}>
                            <span style={{ fontSize: '14px', color: '#B5B5B5' }}> My Earned MEX </span>
                            <span> 0 </span>
                        </div>
                    </Col>

                    <Col lg='3'>
                        <div className='d-flex justify-content-center'>
                            <button className='farm-but'> Reinvest all </button>
                            <button className='farm-but ml-3'> Harvest all </button>
                            <button className='farm-but stake-but ml-3'> Stake </button>
                        </div>
                    </Col>
                </Row>
            </div>

            <p style={{ fontSize: '18px', color: '#B5B5B5', marginTop: '30px' }}>LP Farms</p>

            <div className='farm-card'>
                <Row className='d-flex align-items-center'>
                    <Col lg='3'>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex'>
                                <div>
                                    <img src={EGLDLogo} alt='EGLD logo' width={'38px'} />
                                </div>

                                <div style={{ marginLeft: '-15px', marginTop: '20px' }}>
                                    <img src={BTXLogo} alt='BTX logo' width={'38px'} />
                                </div>
                            </div>

                            <div className='d-flex flex-column' style={{ marginLeft: '30px', gap: '5px' }}>
                                <div className='d-flex align-items-center'>
                                    <span style={{ fontWeight: '600', fontSize: '16px' }}> EGLD - BTX </span>
                                    <div className='d-flex align-items-center lock-badge ml-2'>
                                        <AiFillLock/>
                                        <span> 1.1x</span>
                                    </div>
                                </div>
                                <span> $ 381,826,657 </span>
                            </div>
                        </div>
                    </Col>

                    <Col md='4' lg='2'>
                        <div className='d-flex flex-column' style={{ gap: '5px' }}>
                            <span style={{ fontSize: '14px', color: '#B5B5B5' }}> APR </span>
                            <div className='d-flex align-items-center'>
                                <span> 21% /</span>
                                <AiFillLock className='ml-2 mr-1' />
                                <span> 78%</span>
                            </div>
                        </div>
                    </Col>

                    <Col md='4' lg='2'>
                        <div className='d-flex flex-column' style={{ gap: '5px' }}>
                            <span style={{ fontSize: '14px', color: '#B5B5B5' }}> My Staked LP </span>
                            <span> 0 </span>
                        </div>
                    </Col>

                    <Col md='4' lg='2'>
                        <div className='d-flex flex-column' style={{ gap: '5px' }}>
                            <span style={{ fontSize: '14px', color: '#B5B5B5' }}> My Earned MEX </span>
                            <span> 0 </span>
                        </div>
                    </Col>

                    <Col lg='3'>
                        <div className='d-flex justify-content-center'>
                            <button className='farm-but'> Harvest all </button>
                            <button className='farm-but stake-but ml-4'> Stake LP </button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Farms;