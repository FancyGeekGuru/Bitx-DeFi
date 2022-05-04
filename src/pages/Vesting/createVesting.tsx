import React, { useEffect, useState } from 'react';
import './index.scss';

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

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { alpha, styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { Row, Col, Dropdown } from 'react-bootstrap';
import vestinglogo from 'assets/img/vesting/vesting logo.svg';
import * as data from './data';

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
    getEsdtsOfAddress,
    isValidAddress,
} from 'utils';
import { isValid } from 'date-fns';

const outerTheme = createTheme({
    palette: {
        primary: {
            main: "#05AB76",
        },
    }
});

const ColorlibStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    // border: '1px solid gray',
    zIndex: 1,
    color: '#000',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: "20px",
    ...(ownerState.active && {

        backgroundImage:
            'linear-gradient( 136deg, rgb(53 220 158) 0%, rgb(23 149 85) 50%, rgb(2 86 68) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        color: '#fff',
    }),
    ...(ownerState.completed && {
        backgroundImage:
            'linear-gradient( 136deg, rgb(53 220 158) 0%, rgb(23 149 85) 50%, rgb(2 86 68) 100%)',
        color: '#fff',
    }),
}));

function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement } = {
        1: <div>1</div>,
        2: <div>2</div>,
        3: <div>3</div>,
        4: <div>4</div>,
    };

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient( 95deg, rgb(53 220 158) 0%, rgb(23 149 85) 50%, rgb(2 86 68) 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient( 95deg, rgb(53 220 158) 0%, rgb(23 149 85) 50%, rgb(2 86 68) 100%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 2,
        border: 0,
        backgroundColor:
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#D3D3D3',
        borderRadius: 1,
    },
}));

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

const CreateVesting = () => {
    const { account, address } = useGetAccountInfo();
    const { network } = useGetNetworkConfig();
    const { hasPendingTransactions } = useGetPendingTransactions();
    const provider = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });

    const steps = ['Select Your Token', 'Locking Token For', 'Finalize Your Lock', 'Track Your Lock'];
    const lockingTokensFor = ['Team', 'Marketing', 'Ecosystem', 'Advisor', 'Foundation', 'Development', 'Partnership', 'Investor', 'Other'];

    const paymentTokens = data.tokens;
    const [activeStep, setActiveStep] = useState<number>(0);
    const handleChangeStep = (stepNum) => {
        if (stepNum >= 0 && stepNum <= 3) {
            if (activeStep == 1 && stepNum == 2) {
                if (!isValidAddress(selectedReceiverAddress)) {
                    alert('Invalid receiver address.');
                    return;
                }
            }

            setActiveStep(stepNum);
        }
    };

    /** for select tokens */
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);
    const handleSelectTokenId = (token_id) => {
        setSelectedTokenIndex(token_id);
    };

    /** step 2 Locking Tokens for */

    // switch state
    const [switchLockingTokensForchecked, setLockingTokensForChecked] = React.useState(false);
    const handleSwtichLockingTokensForChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLockingTokensForChecked(event.target.checked);
    };

    // select why u lock tokens
    const [selectedLockingTokensForID, setLockingTokensForID] = React.useState<number>(0);
    const handleSelectTokensFor = (index) => {
        setLockingTokensForID(index);
    };

    // set lock
    const [lockList, setLockList] = useState([]);
    const [lockAmount, setLockAmount] = useState<number>();
    const [lockCount, setLockCount] = useState<number>();

    ///////////////////////////////
    const [ownedEsdts, setOwnedEsdts] = useState<any>([]);
    useEffect(() => {
        (async () => {
            if (!address || hasPendingTransactions) return;
            const ownedEsdts = await getEsdtsOfAddress(network.apiAddress, account);
            console.log('ownedEsdts', ownedEsdts);
            setOwnedEsdts(ownedEsdts);
        })();
    }, [address, hasPendingTransactions]);

    useEffect(() => {
        const release = {
            date: new Date(),
            percent: ''
        };

        const tmpLockList = [];
        for (let i = 0; i < lockCount; i++) {
            tmpLockList.push(release);
        }

        setLockList(tmpLockList);
    }, [lockCount]);

    const handleChangeDate = (index, date) => {
        const updatedList = lockList.map((item, id) => {
            if (index == id) {
                return { ...item, date: date };
            }
            return item;
        });

        setLockList(updatedList);
    };

    const handleChangePercent = (index, percent) => {
        if (percent > 100) {
            console.log("should below 100");
            return;
        }

        const updatedList = lockList.map((item, id) => {
            if (index == id) {
                return { ...item, percent: percent };
            }
            return item;
        });

        setLockList(updatedList);
    };

    const [selectedReceiverAddress, setSelectedReceiverAddress] = useState<string>(address);
    useEffect(() => {
        setSelectedReceiverAddress(switchLockingTokensForchecked ? '' : address);
    }, [switchLockingTokensForchecked]);

    return (
        <>
            <div className="home-container mb-5" >
                <p className='lock-process text-center'>Lock Process</p>

                <Box sx={{ width: '100%', marginTop: "40px" }}>
                    <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={ColorlibStepIcon}><span style={{ color: "#D3D3D3", fontSize: "13px" }}>{label}</span></StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/** step 1 */}
                    <div className="Step-Box">
                        {
                            activeStep == 0 && (
                                <>
                                    <p className="step-title">Select Your Token</p>
                                    <div className="d-flex justify-content-center">
                                        <Dropdown className="w-50" onSelect={handleSelectTokenId} drop='down' style={{ width: "150px" }}>
                                            <Dropdown.Toggle className='token-id-toggle' id="token-id">
                                                {
                                                    <>
                                                        <span>{ownedEsdts.length && ownedEsdts[selectedTokenIndex].ticker}</span>
                                                        <img src={ownedEsdts.length && ownedEsdts[selectedTokenIndex].logo} />
                                                    </>
                                                }
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className='token-id-menu'>
                                                {
                                                    ownedEsdts.length && ownedEsdts.map((token, index) => (
                                                        <Dropdown.Item eventKey={index} key={`token-id-menu-item-${token.identifier}`}>
                                                            <span>{token.ticker}</span>
                                                            <img src={token.logo} />
                                                        </Dropdown.Item>
                                                    ))
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    <p className="step-title mt-3">Token Found</p>
                                    <Row>
                                        <Col xs="12" sm="6">
                                            <div className="token-info">
                                                <span> {"Token Identifier : "}</span>
                                                <span> {ownedEsdts.length && ownedEsdts[selectedTokenIndex].identifier} </span>
                                            </div>
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <div className="token-info">
                                                <span> {"Token Ticker : "}</span>
                                                <span> {ownedEsdts.length && ownedEsdts[selectedTokenIndex].ticker} </span>
                                            </div>
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <div className="token-info">
                                                <span> {"Token Decimals: "}</span>
                                                <span> {ownedEsdts.length && ownedEsdts[selectedTokenIndex].decimals} </span>
                                            </div>
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <div className="token-info">
                                                <span> {"Your Balance : "}</span>
                                                <span> {ownedEsdts.length && ownedEsdts[selectedTokenIndex].balance} </span>
                                            </div>
                                        </Col>
                                    </Row>
                                </>
                            )
                        }

                        {
                            activeStep == 1 && (
                                <>
                                    <div className="d-flex" style={{ alignItems: "center" }}>
                                        <p className="step-title" style={{ alignItems: "center" }}>I am Locking Tokens for</p>
                                        <div className="ml-5">
                                            <span className={!switchLockingTokensForchecked ? "text-primary-color" : "text-dark-color"}> Myself </span>
                                            <GreenSwitch
                                                checked={switchLockingTokensForchecked}
                                                onChange={handleSwtichLockingTokensForChange}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            <span className={switchLockingTokensForchecked ? "text-primary-color" : "text-dark-color"}> Someone Else </span>
                                        </div>
                                    </div>
                                    <input className='bitlock-input w-100' value={selectedReceiverAddress} onChange={(e) => setSelectedReceiverAddress(e.target.value)} />
                                    <div>{!isValidAddress(selectedReceiverAddress) && 'Invalid address.'}</div>
                                    <p className="step-title mt-3">Please select</p>
                                    <Row>
                                        {
                                            lockingTokensFor.map((row, index) => {
                                                return (
                                                    <div className={selectedLockingTokensForID == index ? "token-lock-chip-active" : "token-lock-chip"} key={index} onClick={() => handleSelectTokensFor(index)}>
                                                        <span> {row} </span>
                                                    </div>
                                                );
                                            })
                                        }
                                    </Row>
                                </>
                            )
                        }

                        {
                            activeStep == 2 && (
                                <>
                                    <p className="step-title">Finalize your Lock</p>

                                    <Row className="mt-3">
                                        <Col lg="6">
                                            <Row className="lock-mini-box d-flex align-items-center ml-1 mr-1">
                                                <span>Lock Amount</span>
                                                <div className="d-flex ml-auto">
                                                    <input className='bitx-input' type="number" value={lockAmount} onChange={(e) => setLockAmount(Number(e.target.value))} />
                                                    <div className="token-ticker">{ownedEsdts.length && ownedEsdts[selectedTokenIndex].ticker}</div>
                                                </div>
                                                <span className='ml-auto'>Balance: {ownedEsdts.length && ownedEsdts[selectedTokenIndex].balance}</span>
                                                <div className="max-but ml-auto" onClick={() => setLockAmount(100)}>max</div>
                                            </Row>
                                        </Col>

                                        <Col lg="6">
                                            <div className="lock-mini-box d-flex align-items-center ml-1 mr-1">
                                                <span>Lock Count</span>
                                                <input className='bitlock-input ml-3' type="number" style={{ borderRadius: "5px", width: "80%" }} onChange={(e) => setLockCount(Number(e.target.value))} value={lockCount} />
                                            </div>
                                        </Col>

                                        {
                                            lockList.map((row, index) => {
                                                console.log(row);
                                                return (
                                                    <Col md="4" key={index}>
                                                        <div className="lock-state-box">
                                                            <div className="d-flex align-items-center">
                                                                <div className="w-50">
                                                                    <span>Release Date</span>
                                                                </div>
                                                                <div className="w-50">
                                                                    <ThemeProvider theme={outerTheme}>
                                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                            <MobileDateTimePicker
                                                                                value={row.date}
                                                                                onChange={(newValue) => {
                                                                                    handleChangeDate(index, newValue);
                                                                                }}
                                                                                renderInput={(params) => <TextField {...params} />}
                                                                            />
                                                                        </LocalizationProvider>
                                                                    </ThemeProvider>
                                                                </div>
                                                            </div>

                                                            <div className="mt-2 d-flex align-items-center">
                                                                <div className="w-50">
                                                                    <span>Relase Percent</span>
                                                                </div>
                                                                <div className="w-50">
                                                                    <input className='bitlock-input w-100' type="number" onChange={(e) => handleChangePercent(index, Number(e.target.value))} value={row.percent} />
                                                                </div>
                                                            </div>

                                                            <div className="mt-3 d-flex">
                                                                <div className="w-50">
                                                                    <span>Release Amount</span>
                                                                </div>
                                                                <div className="w-50">
                                                                    <span>{lockAmount * row.percent / 100} BTX</span>
                                                                </div>
                                                            </div>

                                                            <div className="mt-3 d-flex">
                                                                <div className="w-50">
                                                                    <span>Release Value</span>
                                                                </div>
                                                                <div className="w-50">
                                                                    <span>$1,234</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                );
                                            })
                                        }

                                    </Row>
                                </>
                            )
                        }

                        <div className='mt-2 d-flex text-center justify-content-center'>
                            <div className="d-flex align-items-center justify-content-center" >
                                <div className="step-but" onClick={() => handleChangeStep(activeStep - 1)}>Back</div>
                                <img src={vestinglogo} alt="elrond vesting" />
                                <div className="step-but" onClick={() => handleChangeStep(activeStep + 1)}>Next</div>
                            </div>
                        </div>
                    </div>
                </Box>
            </div >
        </>
    );
};

export default CreateVesting;