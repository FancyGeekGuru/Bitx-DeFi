import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import BitlockImg from 'assets/img/vesting/Bitlock Img.svg';
import Symbol1 from 'assets/img/vesting/Symbol for Locked Token Value.png';
import Symbol2 from 'assets/img/vesting/Symbol for Locked Tokens.png';
import Symbol3 from 'assets/img/vesting/Symbol for Lockers.png';

const BitLock = () => {
    return (
        <div className="home-container">
            <Row>
                <Col sm="6" className="d-flex justify-content-center align-items-center">
                    <img className="w-75" src={BitlockImg} alt="Bit Lock" />
                </Col>

                <Col sm="6" className="d-flex text-center align-items-center">
                    <div>
                        <div>
                            <p className="description-title">{"BitLock"}</p>
                            <p className="description-body">{"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu nibh bibendum, dictum nibh eu, ultricies lectus. Nullam metus eros, lacinia quis condimentum at, sagittis eu sapien. Suspendisse suscipit orci nec eros elementum"}</p>
                        </div>

                        <Row className="mt-5">
                            <Col xs="4">
                                <div className="">
                                    <img className="w-75" src={Symbol1} alt="Locked Token Value" />
                                    <p className="mt-3 mb-1" style={{ color: "#D1D1D1" }}>$730,418</p>
                                    <span style={{ color: "#D1D1D1" }}>Locked Token Value</span>
                                </div>
                            </Col>
                            <Col xs="4">
                                <div className="">
                                    <img className="w-75" src={Symbol2} alt="Locked Token Value" />
                                    <p className="mt-3 mb-1" style={{ color: "#D1D1D1" }}>25</p>
                                    <span style={{ color: "#D1D1D1" }}>Locked Tokens</span>
                                </div>
                            </Col>
                            <Col xs="4">
                                <div className="">
                                    <img className="w-75" src={Symbol3} alt="Locked Token Value" />
                                    <p className="mt-3 mb-1" style={{ color: "#D1D1D1" }}>225</p>
                                    <span style={{ color: "#D1D1D1" }}>Lockers</span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default BitLock;