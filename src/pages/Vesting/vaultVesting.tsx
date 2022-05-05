import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { Row, Col, ProgressBar } from 'react-bootstrap';
import { useLocation } from "react-router-dom";
import BTX from 'assets/img/token logos/BTX.png';

import {
    refreshAccount,
    sendTransactions,
    useGetAccountInfo,
    useGetNetworkConfig,
    useGetPendingTransactions,
} from '@elrondnetwork/dapp-core';
import {
    Address,
    AddressValue,
    AbiRegistry,
    SmartContractAbi,
    SmartContract,
    ProxyProvider,
    TypedValue,
    ArgSerializer,
    GasLimit,
    DefaultSmartContractController,
    U32Value,
} from '@elrondnetwork/erdjs';

import * as data from './data';
import {TOKENS} from 'data';


import {
    VESTING_CONTRACT_ADDRESS,
    VESTING_CONTRACT_ABI_URL,
    VESTING_CONTRACT_NAME,
} from 'config';
import {
    IContractInteractor,
    TIMEOUT,
    convertWeiToEsdt,
    convertEsdtToWei,
    SECOND_IN_MILLI,
    precisionFloor,
    convertTimestampToDateTime,
} from 'utils';

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
    const { address } = useGetAccountInfo();
    const { network } = useGetNetworkConfig();
    const { hasPendingTransactions } = useGetPendingTransactions();
    const provider = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });

    const [contractInteractor, setContractInteractor] = React.useState<IContractInteractor | undefined>();
    // load smart contract abi and parse it to SmartContract object for tx
    React.useEffect(() => {
        (async () => {
            const registry = await AbiRegistry.load({ urls: [`/${VESTING_CONTRACT_ABI_URL}`] });
            const abi = new SmartContractAbi(registry, [VESTING_CONTRACT_NAME]);
            const contract = new SmartContract({ address: new Address(VESTING_CONTRACT_ADDRESS), abi: abi });
            const controller = new DefaultSmartContractController(abi, provider);

            // console.log('contractInteractor', {
            //     contract,
            //     controller,
            // });

            setContractInteractor({
                contract,
                controller,
            });
        })();
    }, []); // [] makes useEffect run once

    const [lockSetting, setLockSetting] = React.useState<any>();
    React.useEffect(() => {
        (async () => {
            if (!contractInteractor) return;
            const interaction = contractInteractor.contract.methods.viewLockSetting();
            const res = await contractInteractor.controller.query(interaction);

            if (!res || !res.returnCode.isSuccess()) return;
            const value = res.firstValue.valueOf();
            
            const total_locked_token_ids = value.total_locked_token_ids.map((v: any) => v.toString());
            const total_locked_token_amounts = value.total_locked_token_amounts;
            const total_locked_tokens = [];
            let total_locked_value = 0;
            for (let i = 0; i < total_locked_token_ids.length; i++) {
                const token_id = total_locked_token_ids[i];
                const amount = convertWeiToEsdt(total_locked_token_amounts[i], TOKENS[token_id].decimals);

                total_locked_tokens.push({
                    ...TOKENS[token_id],
                    amount,
                });

                total_locked_value += amount * TOKENS[token_id].unit_price_in_usd;
            }
            total_locked_value = precisionFloor(total_locked_value);
            
            const total_lock_count = value.total_lock_count.toNumber();
            const wegld_token_id = value.wegld_token_id.toString();
            const wegld_min_fee = convertWeiToEsdt(value.wegld_min_fee);
            const wegld_base_fee = convertWeiToEsdt(value.wegld_base_fee);
            const lock_token_fee = value.lock_token_fee.toNumber() / 100;

            const lockSetting = {
                total_locked_tokens,
                total_lock_count,
                wegld_token_id,
                wegld_min_fee,
                wegld_base_fee,
                lock_token_fee,
                total_locked_value,
            };

            console.log('lockSetting', lockSetting);
            setLockSetting(lockSetting);
        })();
    }, [contractInteractor]);

    const [lockId, setLockId] = useState(0);
    const [lock, setLock] = React.useState<any>();
    React.useEffect(() => {
        (async () => {
            if (!contractInteractor || !lockId) return;
            const args = [new U32Value(lockId)];
            const interaction = contractInteractor.contract.methods.viewLock(args);
            const res = await contractInteractor.controller.query(interaction);

            if (!res || !res.returnCode.isSuccess()) {
                alert('Invalid Lock.');
                return;
            }
            const value = res.firstValue.valueOf();

            const lock_id = value.lock_id.toNumber();
            const locker_address = value.locker_address.toString();
            const receiver_address = value.receiver_address.toString();
            const lock_name = value.lock_name.toString();
            const lock_purpose = value.lock_purpose.toString();
            const lock_token_id = value.lock_token_id.toString();
            const lock_token_ticker = lock_token_id.split('-')[0];
            const lock_token_amount = convertWeiToEsdt(value.lock_token_amount, TOKENS[lock_token_id].decimals);

            const lock_release_count = value.lock_release_count.toNumber();
            const lock_release_timestamps = value.lock_release_timestamps.map((v: any) => v.toNumber() * SECOND_IN_MILLI);
            const lock_release_percentages = value.lock_release_percentages.map((v: any) => v.toNumber() / 100);
            const lock_release_amounts = value.lock_release_amounts.map((v: any) => convertWeiToEsdt(v, TOKENS[lock_token_id].decimals));
            const lock_release_values = lock_release_amounts.map(v => precisionFloor(v * TOKENS[lock_token_id].unit_price_in_usd));

            const lock_left_release_count = value.lock_left_release_count.toNumber();
            const lock_left_claimable_release_count = value.lock_left_claimable_release_count.toNumber();

            //
            const unit_price_in_usd = TOKENS[lock_token_id].unit_price_in_usd;
            const total_value = precisionFloor(lock_release_amounts.reduce((a, b) => a + b, 0) * unit_price_in_usd);

            const next_release_timestamp = lock_left_release_count > 0 ? lock_release_timestamps[lock_release_count - lock_left_release_count - 1] : 0;

            const lock = {
                lock_id,
                locker_address,
                receiver_address,
                lock_name,
                lock_purpose,
                lock_token_id,
                lock_token_ticker,
                lock_token_amount,
                lock_release_count,
                lock_release_timestamps,
                lock_release_percentages,
                lock_release_amounts,
                lock_release_values,
                lock_left_release_count,
                lock_left_claimable_release_count,

                unit_price_in_usd,
                total_value,
                next_release_timestamp,
            };
            

            console.log('lock', lock);
            setLock(lock);
        })();
    }, [contractInteractor, lockId]);

    const location = useLocation();
    useEffect(() => {
        const pathname = location.pathname;
        const lock_id = parseInt(pathname.substring(pathname.lastIndexOf('/') + 1));
        setLockId(lock_id);
    }, []);

    /** filter Locked Events (should filter by search text)*/
    const [lockedEvents, setLockedEvents] = useState([]);
    useEffect(() => {
        if (!lock) return;

        const events = [];
        for (let i = 0; i < lock.lock_release_count; i++) {
            events.push({
                lock_release_percentage: lock.lock_release_percentages[i],
                lock_release_amount: lock.lock_release_amounts[i],
                lock_release_timestamp: lock.lock_release_timestamps[i],
                lock_release_value: lock.lock_release_values[i],
            });
        }
        setLockedEvents(events);
    }, [lock]);

    return (
        <div className="home-container">
            <p className='lock-process text-center'>Vault Explorer</p>

            <Row>
                <Col lg="4">
                    <div className="vesting-info-box text-center">
                        <img src={BTX} alt="BTX" />
                        <p className="mt-3 mb-2" style={{ fontSize: "22px", fontWeight: "700", color: "#D6D6D6" }}>{lock && lock.lock_token_id}</p>
                        {/* <p className="text-address" style={{ color: '#05AB76' }}> {lock}</p> */}

                        {/* <ProgressBar style={{ marginTop: "35px" }} now={25} /> */}

                        <div className="d-flex justify-content-between mt-4">
                            <span style={{ color: "#B5B5B5" }}>Lock Name</span>
                            <span style={{ color: "#05AB76" }}>{lock ? lock.lock_name : '-'}</span>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <span style={{ color: "#B5B5B5" }}>Lock Amount</span>
                            <span style={{ color: "#05AB76" }}>{lock ? lock.lock_token_amount : '-'}</span>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <span style={{ color: "#B5B5B5" }}>Token Value</span>
                            <span style={{ color: "#05AB76" }}>${lock ? lock.total_value : '-'}</span>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <span style={{ color: "#B5B5B5" }}>Lock Count</span>
                            <span style={{ color: "#05AB76" }}>{lock ? lock.lock_release_count : '-'}</span>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <span style={{ color: "#B5B5B5" }}>Lock Purpose</span>
                            <span style={{ color: "#05AB76" }}>{lock ? lock.lock_purpose : '-'}</span>
                        </div>

                        {/* <div className="mt-4">
                            <span className={!switchViewType ? "text-primary-color" : "text-dark-color"}> View All Locks </span>
                            <GreenSwitch
                                checked={switchViewType}
                                onChange={handleSwitchViewType}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                            <span className={switchViewType ? "text-primary-color" : "text-dark-color"}> Track My Locks </span>
                        </div> */}
                    </div>
                </Col>

                <Col lg="8">
                    <div className="receiver-address-box" style={{marginBottom: '1rem'}}>
                        <span>Locker Address : </span>
                        <span className="text-address" style={{ color: "#05AB76" }}>{lock ? lock.locker_address : '-'}</span>
                    </div>
                    <div className="receiver-address-box">
                        <span>Reciever Address : </span>
                        <span className="text-address" style={{ color: "#05AB76" }}>{lock ? lock.receiver_address : '-'}</span>
                    </div>
                    {/* <input className="bitx-input w-100" placeholder='Search a smart lock by purpose/wallet-address' onChange={(e) => setSearchText(e.target.value)} /> */}

                    <Row className="mt-4 mb-4">
                        {
                            lockedEvents.length > 0 && lockedEvents.map((event, index) => {
                                return (
                                    <Col sm="6" key={index}>
                                        <div className="lock-box justify-content-between">
                                            <div className="d-flex flex-column">
                                                <div>
                                                    <span style={{ color: "#B5B5B5" }}>Percent </span>
                                                    <span className="ml-2">{event.lock_release_percentage}%</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span style={{ color: "#B5B5B5" }}>Amount: </span>
                                                    <span className="ml-2">{event.lock_release_amount} {lock.lock_token_ticker}</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span style={{ color: "#B5B5B5" }}>Value: </span>
                                                    <span className="ml-2">${event.lock_release_value}</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span style={{ color: "#B5B5B5" }}>Release: </span>
                                                    <span>{convertTimestampToDateTime(event.lock_release_timestamp)}</span>
                                                </div>
                                            </div>
                                            {/* <div className="d-flex flex-column justify-content-center align-items-center text-center">
                                                <CircularProgressWithLabel value={event.progress} color={event.progress == 100 ? "success" : "secondary"} />
                                                <span className="mt-1" style={{ color: "#B5B5B5"}}>
                                                    {
                                                        event.progress == 100 ? "Token Unlocked" : "Remain : " + event.Remain
                                                    }
                                                </span>
                                            </div> */}
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