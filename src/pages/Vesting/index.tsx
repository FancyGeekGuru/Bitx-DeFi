import React, { useState, useEffect } from 'react';
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

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

import BitlockImg from 'assets/img/vesting/Bitlock Img.svg';
import Symbol1 from 'assets/img/vesting/Symbol for Locked Token Value.png';
import Symbol2 from 'assets/img/vesting/Symbol for Locked Tokens.png';
import Symbol3 from 'assets/img/vesting/Symbol for Lockers.png';
import { routeNames } from 'routes';
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

const BitLock = () => {
    const { address } = useGetAccountInfo();
    const { network } = useGetNetworkConfig();
    const { hasPendingTransactions } = useGetPendingTransactions();
    const provider = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });

    const [contractInteractor, setContractInteractor] = React.useState<IContractInteractor | undefined>();
    // load smart contract abi and parse it to SmartContract object for tx
    React.useEffect(() => {
        (async () => {
            const registry = await AbiRegistry.load({ urls: [VESTING_CONTRACT_ABI_URL] });
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

    const [lockSetting, setLockSetting] = React.useState<any>([]);
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
            for (let i = 0; i < total_locked_token_ids.length; i++) {
                const token_id = total_locked_token_ids[i];
                const amount = convertWeiToEsdt(total_locked_token_amounts[i], TOKENS[token_id].decimals);

                total_locked_tokens.push({
                    ...TOKENS[token_id],
                    amount,
                });
            }
            
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
            };

            console.log('lockSetting', lockSetting);
            setLockSetting(lockSetting);
        })();
    }, [contractInteractor]);

    const my_address = "erd1qqqqqqqqqqqqqpgq7r9n9u389xr23vqyye8maaetcg2r886vj9qsj7sl4G";

    /** switch view type (must filter by locker address) */
    const [switchViewType, setSwitchViewType] = useState(false);
    const handleSwitchViewType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSwitchViewType(event.target.checked);
    };
    useEffect(() => {
        filterVestingList();
    }, [switchViewType]);

    /** click view button (must navigate to bitlock/vault vesting/0x...) */
    const navigate = useNavigate();
    const handleClickView = (locker_addr) => {
        navigate(`/bitlock/vault-vesting/${locker_addr}`);
    };

    /** filter vesting list (should filter by search text)*/
    const [vestingList, setVestingList] = useState(data.vestingList);
    const [searchText, setSearchText] = useState("");
    useEffect(() => {
        filterVestingList();
    }, [searchText]);

    const filterVestingList = () => {
        let filterResult = data.vestingList;
        if (switchViewType) { // Track My locks
            filterResult = filterResult.filter(d => d.Locker_Address === my_address);
        }
        filterResult = filterResult.filter(d => d.Name.includes(searchText) || d.Locker_Address.includes(searchText));
        setVestingList(filterResult);
    };

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

            <div className="bitlock-vesting-list-box mt-5 mb-5">
                <p className="text-center" style={{ fontSize: "20px", fontWeight: "500", color: "#D3D3D3" }}>Search A Smart Lock Address</p>

                <Row className="text-center justify-content-center">
                    <input className='bitx-input w-75' style={{ background: "#191A1E", borderRadius: "5px" }} placeholder="Search a smart lock by name/contract address" onChange={(e) => setSearchText(e.target.value)} />

                    <Link to={routeNames.createvesting}>
                        <div className="create-vesting-but ml-3">Create Vesting</div>
                    </Link>
                </Row>

                <div className="text-center mt-3">
                    <span className={!switchViewType ? "text-primary-color" : "text-dark-color"}> Track All Locks </span>
                    <GreenSwitch
                        checked={switchViewType}
                        onChange={handleSwitchViewType}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <span className={switchViewType ? "text-primary-color" : "text-dark-color"}> Track My Locks </span>
                </div>

                <Table className="text-center mt-3" style={{ color: "#ACACAC" }}>
                    <Thead>
                        <Tr>
                            {
                                data.vestingListHeader.map((row, index) => {
                                    return (
                                        <Th key={index}>{row}</Th>
                                    );
                                })
                            }
                        </Tr>
                    </Thead>
                    <Tbody>

                        {
                            vestingList.map((row, index) => {
                                return (
                                    <Tr key={index}>
                                        <Td>{row.Name}</Td>
                                        <Td>{row.Token_Identifier}</Td>
                                        <Td>{row.Token_Amount}</Td>
                                        <Td>{row.Token_Value}</Td>
                                        <Td>{row.Total_Value}</Td>
                                        <Td>{row.Next_Relase}</Td>
                                        <Td><div className="view-but" onClick={() => handleClickView(row.Locker_Address)}>view</div></Td>
                                    </Tr>
                                );
                            })
                        }
                    </Tbody>
                </Table>
            </div>
        </div>
    );
};

export default BitLock;