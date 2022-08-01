/* eslint-disable import/order */
import React, { useEffect, useState } from "react";
import { Row, Col } from 'react-bootstrap';
import Marquee from "react-fast-marquee";
import { IoGrid, IoList } from "react-icons/io5";
import { useNavigate, Link } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import DropdownList from "react-widgets/DropdownList";
import IDOImg from 'assets/img/IDO.png';
import './index.scss';
import IDOCard from 'components/Card/IDOCard';
import { advertising_data } from './data';
import "react-widgets/styles.css";

import BTX_logo from 'assets/img/token logos/BTX.png';
import { ProgressBar } from 'react-bootstrap';

import { ImEarth } from "react-icons/im";
import { SiTelegram, SiDiscord, SiTwitter, SiYoutube, SiLinkedin, SiMedium } from "react-icons/si";
import { IoRocketOutline } from "react-icons/io5";

import Countdown from 'react-countdown';
import { routeNames } from 'routes';

import { useDispatch, useSelector } from 'react-redux';
import * as selectors from 'store/selectors';
import { fetchIDOPools } from "store/actions/thunks/IDO";

const table_headers = [
    "Name",
    "Identifier",
    "Amount",
    "Price",
    "Status",
    "Social Links",
    "Countdown",
    "Action"
];

const IDOLaunchpad = () => {
    const [displayMode, setDisplayMode] = useState<boolean>(false);

    const dispatch = useDispatch();
    const IDOState = useSelector(selectors.IDOState);
    const pools_list = IDOState.poolLists.data;

    useEffect(() => {
        dispatch(fetchIDOPools());
    }, []);

    const navigate = useNavigate();
    const handleIDONavigate = () => {
        navigate(`/ido-detail`);
    };

    return (
        <>
            <div className='first-section'>
                <div className='home-container'>
                    <div className='d-flex justify-content-center' style={{ marginTop: '6vh' }}>
                        <div className='d-flex justify-content-center'>
                            <img src={IDOImg} alt="BitX IDO Launchpad" width={'65%'} />
                        </div>
                    </div>

                    <div className="d-flex flex-column justify-content-center align-items-center mt-5">
                        <span className='ido-title'>{"Safest Launchpad. Elrond network"}</span>

                        <div className='ido-description mt-4'>
                            <span>{"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu nibh bibendum, dictum nibh eu, ultricies lectus. Nullam metus eros, lacinia quis condimentum at, sagittis eu sapien. Suspendisse suscipit orci nec eros elementum"}</span>
                        </div>

                        <Link className="mt-5" to={routeNames.createido}>
                            <button className='ido-create-but'>
                                <span className='d-flex align-items-center' style={{ fontSize: '20px' }}>
                                    <IoRocketOutline />
                                </span>
                                <span>
                                    Apply as a project
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
                <div style={{ marginTop: '70px' }}>
                    <Marquee gradient={false} speed={50} pauseOnClick={true}>
                        {
                            advertising_data.map((row, index) => {
                                return (
                                    <div key={index}>
                                        <div className='ido-anounce-card mr-5'>
                                            <div className='mr-4'>
                                                <img src={row.logo} alt={row.name} width={"50px"} />
                                            </div>
                                            <span>{row.name}</span>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </Marquee>
                </div>
            </div>

            <div className='ido-container' style={{ marginBottom: '80px', minHeight: "100vh" }}>
                <div className='d-flex flex-wrap' style={{ rowGap: '10px', columnGap: '10px' }}>
                    <div style={{ width: '300px' }}>
                        <input className='ido-input' placeholder="Enter token name or symbol" />
                    </div>
                    <div style={{ width: '150px' }}>
                        <DropdownList
                            defaultValue="All Status"
                            data={["All Status", "Upcoming", "KYC", "In progress", "Filled", "Ended", "Canceled"]}
                        />;
                    </div>
                    <div style={{ width: '150px' }}>
                        <DropdownList
                            defaultValue="No Filter"
                            data={["No Filter", "Hard Cap", "Soft Cap", "LP Percent", "Start time", "End Time"]}
                        />
                    </div>
                    <div className='d-flex' style={{ columnGap: '10px' }}>
                        <div>
                            <button className='ido-but' onClick={() => setDisplayMode(false)}>
                                <IoGrid />
                            </button>
                        </div>
                        <div>
                            <button className='ido-but' onClick={() => setDisplayMode(true)}>
                                <IoList />
                            </button>
                        </div>
                    </div>
                </div>

                <div className='mt-4'>
                    {
                        !displayMode ? (
                            <Row style={{ rowGap: '20px' }}>
                                {
                                    pools_list.map((row, index) => {
                                        return (
                                            <Col key={index} md={6} lg={6} xl={4} xxl={3}>
                                                {/* <div className='IDOCard-link' onClick={() => { handleIDONavigate(); }}> */}
                                                <div className='IDOCard-link'>
                                                    <IDOCard data={row} />
                                                </div>
                                            </Col> 
                                        );
                                    })
                                }
                            </Row>
                        ) : (
                            <Table className="text-center mt-3" style={{ color: "#ACACAC" }}>
                                <Thead>
                                    <Tr>
                                        {
                                            table_headers.map((row, index) => {
                                                return (
                                                    <Th key={index}>{row}</Th>
                                                );
                                            })
                                        }
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => {
                                            return (
                                                <Tr key={index}>
                                                    <Td>
                                                        <div className='d-flex align-items-center justify-content-center'>
                                                            <img src={BTX_logo} alt="BitX logo" width={'40px'} />
                                                            <span className='ml-2'>{"BTX Token"}</span>
                                                        </div>
                                                    </Td>
                                                    <Td>
                                                        <span className='ml-2'>{"BTX-06x4234"}</span>
                                                    </Td>
                                                    <Td>
                                                        <span className='ml-2'>{"350,000"}</span>
                                                    </Td>
                                                    <Td>
                                                        <span className='ml-2'>{"1EGLD = 400BTX"}</span>
                                                    </Td>
                                                    <Td>
                                                        <ProgressBar now={0} />
                                                    </Td>
                                                    <Td>
                                                        <div className='table-social-box'>
                                                            <div>
                                                                <ImEarth />
                                                            </div>
                                                            <div>
                                                                <SiTelegram />
                                                            </div>
                                                            <div>
                                                                <SiDiscord />
                                                            </div>
                                                            <div>
                                                                <SiTwitter />
                                                            </div>
                                                            <div>
                                                                <SiYoutube />
                                                            </div>
                                                            <div>
                                                                <SiLinkedin />
                                                            </div>
                                                            <div>
                                                                <SiMedium />
                                                            </div>
                                                        </div>
                                                    </Td>
                                                    <Td>
                                                        <Countdown date={Date.now() + 60000} autoStart />
                                                    </Td>
                                                    <Td>
                                                        <button className='view-but'>
                                                            view
                                                        </button>
                                                    </Td>
                                                </Tr>
                                            );
                                        })
                                    }

                                </Tbody>
                            </Table>
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default IDOLaunchpad;
