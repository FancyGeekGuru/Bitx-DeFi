import React, { useEffect, useState } from 'react';
import './index.scss';

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
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import vestinglogo from 'assets/img/vesting/vesting logo.svg';
import * as data from './data';
import { Divider } from '@mui/material';


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
    const steps = ['Confirm Your Token', 'Locking Token For', 'Finalize Your Lock', 'Track Your Lock'];
    const lockingTokensFor = ['Marketing', 'Ecosystem', 'Team', 'Advisor', 'Foundation', 'Development', 'Partnership', 'investor'];

    const paymentTokens = data.tokens;
    const [activeStep, setActiveStep] = useState<number | undefined>(0);
    const handleChangeStep = (stepNum) => {
        if (stepNum >= 0 && stepNum <= 3) {
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
    const [selectedLockingTokensForID, setLockingTokensForID] = React.useState<number | undefined>();
    const handleSelectTokensFor = (index) => {
        setLockingTokensForID(index);
    };

    // set lock
    const [lockList, setLockList] = useState([]);
    const [lockAmount, setLockAmount] = useState<number>();
    const [lockCount, setLockCount] = useState<number>();

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
                                    <p className="step-title">Confirm Your Token</p>
                                    <div className="d-flex justify-content-center">
                                        <Dropdown className="w-50" onSelect={handleSelectTokenId} drop='down' style={{ width: "150px" }}>
                                            <Dropdown.Toggle className='token-id-toggle' id="token-id">
                                                {
                                                    <>
                                                        <span>{paymentTokens && paymentTokens[selectedTokenIndex].ticker}</span>
                                                        <img src={paymentTokens && paymentTokens[selectedTokenIndex].url} />
                                                    </>
                                                }
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className='token-id-menu'>
                                                {
                                                    paymentTokens && paymentTokens.map((token, index) => (
                                                        <Dropdown.Item eventKey={index} key={`token-id-menu-item-${token.identifier}`}>
                                                            <span>{token.ticker}</span>
                                                            <img src={token.url} />
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
                                                <span> {"Token Name : "}</span>
                                                <span> {"BitX"} </span>
                                            </div>
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <div className="token-info">
                                                <span> {"Token Ticker : "}</span>
                                                <span> {"BitX"} </span>
                                            </div>
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <div className="token-info">
                                                <span> {"Total Supply : "}</span>
                                                <span> {"1038400000"} </span>
                                            </div>
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <div className="token-info">
                                                <span> {"Your Balance : "}</span>
                                                <span> {"0"} </span>
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
                                    <input className='bitlock-input w-100' />
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
                                                    <div className="token-ticker">BTX</div>
                                                </div>
                                                <span className='ml-auto'>Balance: 0</span>
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

                        {
                            activeStep == 3 && (
                                <>
                                    <div className='d-flex justify-content-between'>
                                        <p className="step-title">Finalize your Lock</p>
                                        <div>
                                            <span>Total Lock Amount: </span>
                                            <span  style={{ color: "#05ab76" }}>{lockAmount} BTX</span>
                                        </div>
                                    </div>
                                    <Table className="text-center mt-3" style={{ color: "#ACACAC" }}>
                                        <Thead>
                                            <Tr>
                                                <Th>Release Date</Th>
                                                <Th>Release Percent</Th>
                                                <Th>Release Amount</Th>
                                                <Th>Release Value</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>

                                            {
                                                lockList.map((row, index) => {
                                                    console.log(row);
                                                    return (
                                                        <Tr key={index}>
                                                            <Td>
                                                                {
                                                                    new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(row.date)
                                                                }
                                                            </Td>
                                                            <Td>{row.percent}</Td>
                                                            <Td>{lockAmount * row.percent / 100}</Td>
                                                            <Td>${lockAmount * row.percent / 100 * 1}</Td>
                                                        </Tr>
                                                    );
                                                })
                                            }
                                        </Tbody>
                                    </Table>
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