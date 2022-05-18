import React from 'react';
import { Row, Col } from 'react-bootstrap';

import NFTPng from 'assets/img/NFT.png';
import './index.scss';
import { NFT_collections } from './data';

const NFTStaking = () => {

    const handleClaimButClicked = (index) => {
        console.log(NFT_collections[index]);
    };

    const handleStakeButClicked = (index) => {
        console.log(NFT_collections[index]);
    };

    const handleUnStakeButClicked = (index) => {
        console.log(NFT_collections[index]);
    };

    const handleClaimAll = () => {
        console.log('Claim All clicked.');
    };

    return (
        <div className="home-container mb-5" style={{ fontFamily: 'Segoe UI', color: '#D9D9D9' }}>
            <Row className="d-flex justify-content-center align-items-center text-center">
                <div className='d-flex justify-content-center align-items-center text-center'>
                    <div className="state-box">
                        <span>My Balance</span>
                        <span>125 EGLD</span>
                    </div>
                    <div className="state-box ml-5">
                        <span>UnClaimed</span>
                        <span>100 EGLD</span>
                    </div>
                </div>
                <div>
                    <img src={NFTPng} alt="NFT Staking" width='60%' />
                </div>
                <div className='d-flex justify-content-center align-items-center text-center'>
                    <div className="state-box">
                        <span>EGLD Per Day</span>
                        <span>25 EGLD</span>
                    </div>
                    <div className="state-box  ml-5">
                        <span>Staked NFTs</span>
                        <span>125</span>
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
                <span className='claim-all' onClick={handleClaimAll}>Claim All</span>
                <span>8 items staked</span>
            </div>

            <Row className="mt-4">
                {
                    NFT_collections.map((NFT, index) => {
                        if (NFT.staked) {
                            return (
                                <Col sm="6" md="4" lg="3" key={index}>
                                    <div className='staking-card'>
                                        <img src={NFT.img_url} width='100%' />
                                        <div style={{ padding: '8px 15px' }}>
                                            <div className='d-flex justify-content-between' >
                                                <span>{NFT.name + ' #' + NFT.number}</span>
                                                <span>{NFT.cost + ' EGLD'}</span>
                                            </div>
                                            <div className='mt-2'>
                                                <span>{'RATE: ' + NFT.rate + '%'}</span>
                                            </div>

                                            <div className='mt-2 d-flex justify-content-center'>
                                                <button className='unstake-but' onClick={() => handleUnStakeButClicked(index)}> unstake </button>
                                                <button className='claim-but ml-2' onClick={() => handleClaimButClicked(index)}> CLAIM </button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            );
                        }
                    })
                }
            </Row>

            <p className="mt-5 text-center" style={{ fontSize: "15px", fontWeight: '600', background: 'rgba(0,0,0,0.15)', padding: '8px', borderRadius: '10px' }}>UnStaked</p>
            <Row className="mt-4">
                {
                    NFT_collections.map((NFT, index) => {
                        if (!NFT.staked) {
                            return (
                                <Col sm="6" md="4" lg="3" key={index}>
                                    <div className='staking-card'>
                                        <img src={NFT.img_url} width='100%' />
                                        <div style={{ padding: '8px 15px' }}>
                                            <div className='d-flex justify-content-between' >
                                                <span>{NFT.name + ' #' + NFT.number}</span>
                                                <span>{NFT.cost + ' EGLD'}</span>
                                            </div>

                                            <div className='mt-3 d-flex justify-content-center'>
                                                <button className='claim-but' onClick={() => handleStakeButClicked(index)}> STAKE </button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            );
                        }
                    })
                }
            </Row>
        </div>
    );
};

export default NFTStaking;