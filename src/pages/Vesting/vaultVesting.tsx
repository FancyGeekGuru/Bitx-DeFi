import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { Row, Col, ProgressBar } from 'react-bootstrap';
import { useLocation } from "react-router-dom";
import BTX from 'assets/img/token logos/BTX.png';


import * as data from './data';

const GreenSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase': {
        color: '#05AB76',
        '&:hover': {
            backgroundColor: alpha('#05AB76', theme.palette.action.hoverOpacity),
        },

        '& .Mui-checked': {
            backgroundColor: '#05AB76',

        }
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#5D5D5D',
    },

    '& .MuiSwitch-track': {
        backgroundColor: '#5D5D5D',
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: '#05AB76',
    }
}));

function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="white"
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

const VaultVesting = () => {
    const my_wallet_address = "erd1t5eq3mcuyv44dxzfhshkwfe8pg63szfr43t0hmsuycc4klph7hjqc0ss7v";

    const location = useLocation();
    useEffect(() => {
        const pathname = location.pathname;
        const locker_address = pathname.substring(pathname.lastIndexOf('/') + 1);
        console.log(locker_address); // get locker address from url and must check it and if invalid, go to 404 page.
        setLockerAddr(locker_address);
    }, []);

    const [locker_address, setLockerAddr] = useState('');

    useEffect(() => {
        // check invalid locker address, go to 404
        // let reg=/^0x([0-9a-fA-F]{16}){1}$/i;
    }, [locker_address]);

    /** swtich view type (View All locks is false, Track My Locks is true) */
    const [switchViewType, setSwitchViewType] = React.useState(false);
    const handleSwitchViewType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSwitchViewType(event.target.checked);
    };
    useEffect(() => {
        filterLockedEvents();
    }, [switchViewType]);

    /** filter Locked Events (should filter by search text)*/
    const [lockedEvents, setLockedEvents] = useState(data.LockedEvents);
    const [searchText, setSearchText] = useState("");
    useEffect(() => {
        filterLockedEvents();
    }, [searchText]);

    const filterLockedEvents = () => {
        let filterResult = data.LockedEvents;
        if (switchViewType) { // Track My locks
            filterResult = filterResult.filter(d => d.WalletAddr === my_wallet_address);
        }
        filterResult = filterResult.filter(d => d.Purpose.includes(searchText) || d.WalletAddr.includes(searchText));
        setLockedEvents(filterResult);
    };

    return (
        <div className="home-container">
            <p className='lock-process text-center'>Vault Explorer</p>

            <Row>
                <Col lg="4">
                    <div className="vesting-info-box text-center">
                        <img src={BTX} alt="BTX" />
                        <p className="mt-3 mb-2" style={{ fontSize: "22px", fontWeight: "700", color: "#D6D6D6" }}>BTX</p>
                        <p className="text-address" style={{ color: '#05AB76' }}> 0xd5e950837Ad48D08baD2f87bFcF8eD7167bB44BC</p>

                        <ProgressBar style={{ marginTop: "35px" }} now={25} />

                        <div className="d-flex justify-content-between mt-4">
                            <span style={{ color: "#B5B5B5" }}>BTX Locked</span>
                            <span style={{ color: "#05AB76" }}>128,000,000</span>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <span style={{ color: "#B5B5B5" }}>Total Supply</span>
                            <span style={{ color: "#05AB76" }}>1,000,000,000</span>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <span style={{ color: "#B5B5B5" }}>Total Value Locked</span>
                            <span style={{ color: "#05AB76" }}>$ 234,567</span>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <span style={{ color: "#B5B5B5" }}>Next Release</span>
                            <span style={{ color: "#05AB76" }}>5 Days</span>
                        </div>

                        <div className="mt-4">
                            <span className={!switchViewType ? "text-primary-color" : "text-dark-color"}> View All Locks </span>
                            <GreenSwitch
                                checked={switchViewType}
                                onChange={handleSwitchViewType}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                            <span className={switchViewType ? "text-primary-color" : "text-dark-color"}> Track My Locks </span>
                        </div>
                    </div>
                </Col>

                <Col lg="8">
                    <input className="bitx-input w-100" placeholder='Search a smart lock by purpose/wallet-address' onChange={(e) => setSearchText(e.target.value)} />

                    <Row className="mt-4 mb-4">
                        {
                            lockedEvents.map((event, index) => {
                                return (
                                    <Col sm="6" key={index}>
                                        <div className="lock-box justify-content-between">
                                            <div className="d-flex flex-column">
                                                <div>
                                                    <span style={{ color: "#B5B5B5" }}>Locked BTX: </span>
                                                    <span className="ml-2">{event.Locked}</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span style={{ color: "#B5B5B5" }}>Purpose: </span>
                                                    <span className="ml-2">{event.Purpose}</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span style={{ color: "#B5B5B5" }}>Period: </span>
                                                    <span>{event.from + " ~ " + event.to}</span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column justify-content-center align-items-center text-center">
                                                <CircularProgressWithLabel value={event.progress} color={event.progress == 100 ? "success" : "secondary"} />
                                                <span className="mt-1" style={{ color: "#B5B5B5", fontSize: "12px" }}>
                                                    {
                                                        event.progress == 100 ? "Token Unlocked" : "Remain : " + event.Remain
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </Col>
                                );
                            })
                        }
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default VaultVesting;