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
import {
    refreshAccount,
    sendTransactions,
    useGetAccountInfo,
    useGetNetworkConfig,
    useGetPendingTransactions,
} from '@elrondnetwork/dapp-core';
import {
    Address,
    AbiRegistry,
    SmartContractAbi,
    SmartContract,
    DefaultSmartContractController,
    Balance,
    Interaction,
    ProxyProvider,
    GasLimit,
    ContractFunction,
    U32Value,
    ArgSerializer,
    OptionalValue,
    TypedValue,
    BytesValue,
    BigUIntValue,
    TransactionPayload,
    AddressValue,
    BooleanValue,
} from '@elrondnetwork/erdjs';
import {
    IDO_CONTRACT_ABI_URL,
    IDO_CONTRACT_NAME,
    IDO_CONTRACT_ADDRESS,
} from 'config';
import {
    TIMEOUT,
    SECOND_IN_MILLI,
    convertWeiToEsdt,
} from 'utils';
import BTX_logo from 'assets/img/token logos/BTX.png';
import { ProgressBar } from 'react-bootstrap';
import { ImEarth } from "react-icons/im";
import { SiTelegram, SiDiscord, SiTwitter, SiYoutube, SiLinkedin, SiMedium } from "react-icons/si";
import { IoRocketOutline } from "react-icons/io5";
import Countdown from 'react-countdown';
import { routeNames } from 'routes';

// import { useDispatch, useSelector } from 'react-redux';
// import * as selectors from 'store/selectors';
// import { fetchIDOPools } from "store/actions/thunks/IDO";

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
    const { address } = useGetAccountInfo();
    const { hasPendingTransactions } = useGetPendingTransactions();
    const { network } = useGetNetworkConfig();
    const isLoggedIn = Boolean(address);
    const provider = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });
    const [displayMode, setDisplayMode] = useState<boolean>(false);

    // const dispatch = useDispatch();
    // const IDOState = useSelector(selectors.IDOState);
    // const pools_list = IDOState.poolLists.data;
    // useEffect(() => {
    //     dispatch(fetchIDOPools());
    // }, []);

    // load smart contract abi and parse it to SmartContract object for tx
    const [idoContractInteractor, setIdoContractInteractor] = useState<any>(undefined);
    useEffect(() => {
        (async () => {
            const registry = await AbiRegistry.load({ urls: [IDO_CONTRACT_ABI_URL] });
            const abi = new SmartContractAbi(registry, [IDO_CONTRACT_NAME]);
            const contract = new SmartContract({ address: new Address(IDO_CONTRACT_ADDRESS), abi: abi });
            const controller = new DefaultSmartContractController(abi, provider);

            setIdoContractInteractor({
                contract,
                controller,
            });
        })();
    }, []); // [] makes useEffect run once

    const [projects, setProjects] = useState<any>([]);
    useEffect(() => {
        (async () => {
            if (!idoContractInteractor || !isLoggedIn) return;

            const args = [
                new BooleanValue(true),
            ];
            const interaction = idoContractInteractor.contract.methods.getProjects(args);
            const res = await idoContractInteractor.controller.query(interaction);

            if (!res || !res.returnCode.isSuccess()) return;
            const value = res.firstValue.valueOf();

            const TOKEN_DECIMAL = 18;
            const datas: any = [];
            value.map((item: any) => {
                const data = {
                    project_id: item.project_id.toNumber(),
                    project_owner: item.project_owner.toString(),
                    project_presale_token_identifier: item.project_presale_token_identifier.toString(),
                    project_fund_token_identifier: item.project_fund_token_identifier.toString(),
                    project_fee_option_id: item.project_fee_option_id.toNumber(),
                    project_presale_rate: convertWeiToEsdt(item.project_presale_rate, TOKEN_DECIMAL),
                    project_create_time: item.project_create_time.toNumber() * SECOND_IN_MILLI,
                    project_soft_cap: convertWeiToEsdt(item.project_soft_cap, TOKEN_DECIMAL),
                    project_hard_cap: convertWeiToEsdt(item.project_hard_cap, TOKEN_DECIMAL),
                    project_min_buy_limit: convertWeiToEsdt(item.project_min_buy_limit, TOKEN_DECIMAL),
                    project_max_buy_limit: convertWeiToEsdt(item.project_max_buy_limit, TOKEN_DECIMAL),
                    project_maiar_liquidity_percent: item.project_maiar_liquidity_percent.toNumber() / 100,
                    project_maiar_listing_rate: convertWeiToEsdt(item.project_maiar_listing_rate, TOKEN_DECIMAL),
                    project_presale_start_time: item.project_presale_start_time.toNumber() * SECOND_IN_MILLI,
                    project_presale_end_time: item.project_presale_end_time.toNumber() * SECOND_IN_MILLI,
                    project_liquidity_lock_timestamp: item.project_liquidity_lock_timestamp.toNumber() * SECOND_IN_MILLI,
                    project_description: item.project_description.toString(),
                    project_social_telegram: item.project_social_telegram.toString(),
                    project_social_website: item.project_social_website.toString(),
                    project_social_twitter: item.project_social_twitter.toString(),
                    project_social_youtube: item.project_social_youtube.toString(),
                    project_social_discord: item.project_social_discord.toString(),
                    project_social_linkedin: item.project_social_linkedin.toString(),
                    project_social_medium: item.project_social_medium.toString(),
                    project_total_bought_amount_in_egld: convertWeiToEsdt(item.project_total_bought_amount_in_egld, 18),
                    project_total_bought_amount_in_esdt: convertWeiToEsdt(item.project_total_bought_amount_in_esdt, TOKEN_DECIMAL),
                    project_is_lived: item.project_is_lived,
                };
                datas.push(data);
            });
            setProjects(datas);

        })();
    }, [idoContractInteractor, hasPendingTransactions]);

    const navigate = useNavigate();
    const handleIDONavigate = (project_id) => {
        navigate(`/ido-detail/${project_id}`);
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
                                    projects.map((row, index) => {
                                        return (
                                            <Col key={index} md={6} lg={6} xl={4} xxl={3}>
                                                <div className='IDOCard-link' onClick={() => { handleIDONavigate(row.project_id); }}>
                                                    {/* <div className='IDOCard-link'> */}
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