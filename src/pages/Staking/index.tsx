import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import staking_bg from 'assets/img/staking.svg';
import StakingSmallCard from '../../components/Card/StakingSmallCard';
import { PoolList } from './data';
import './index.scss';

import Particles from 'react-tsparticles';

const StakingHome = () => {

    return (
        <div className="home-container">
            <Particles
                style={{ zIndex: -1, height: "80%", position: "absolute", top: "100px" }}
                params={{
                    "particles": {
                        "number": {
                            "value": 100,
                        },
                        "color": {
                            "value": "#828282"
                        },
                        "line_linked": {
                            "enable": true,
                            "opacity": 0.05
                        },
                        "size": {
                            "value": 2
                        },
                        "opacity": {
                            "anim": {
                                "enable": true,
                                "speed": 2,
                                "opacity_min": 0.02,
                            }
                        }
                    },
                    "interactivity": {
                        "events": {
                            "onclick": {
                                "enable": true,
                                "mode": "push"
                            }
                        },
                        "modes": {
                            "push": {
                                "particles_nb": 1
                            }
                        }
                    },
                    "retina_detect": true
                }} />

            <Row>
                <Col md="12" lg="6">
                    <div className='text-center' style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={staking_bg} style={{ width: "50%" }} />
                    </div>
                </Col>
                <Col md="12" lg="6" style={{ display: "flex", alignItems: "center" }}>
                    <div>
                        <p className="description-title">{"Stake BitX to Earn Rewards"}</p>
                        <p className="description-body">{"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc urna felis, euismod in nibh vitae, eleifend tincidunt diam. Aliquam dignissim vel diam et pharetra. Donec eget odio a nunc euismod posuere ac non lacus. Praesent iaculis nisi at sapien scelerisque semper."}</p>
                    </div>
                </Col>
            </Row>
            <Row style={{ marginTop: "60px", marginBottom: "50px" }}>
                {
                    PoolList.map((row, index) => {
                        return (
                            <Col sm="12" md="6" lg="4" xl="3" key={index}>
                                <StakingSmallCard stake={row.stake} earn={row.earn} url={row.url} />
                            </Col>
                        );
                    })
                }
            </Row>
        </div>
    );
};

export default StakingHome;