import React from 'react';
import './index.scss';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { styled } from '@mui/material/styles';
import { Row, Col } from 'react-bootstrap';

import vestinglogo from 'assets/img/vesting/vesting logo.svg';

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

const Vesting = () => {
    const steps = ['Confirm Your Token', 'Locking Token For', 'Finalize Your Lock', 'Track Your Lock'];

    return (
        <>
            <div className="home-container mb-5" >
                <p className='lock-process text-center'>Lock Process</p>

                <Box sx={{ width: '100%', marginTop: "40px" }}>
                    <Stepper alternativeLabel activeStep={1} connector={<ColorlibConnector />}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={ColorlibStepIcon}><span style={{ color: "#D3D3D3", fontSize: "13px" }}>{label}</span></StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/** step 1 */}
                    <div className="Step-Box">
                        <p className="step-title">Confirm Your Token</p>
                        <input className='bitx-input' />
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

                        <div className='mt-2 d-flex text-center justify-content-center'>
                            <div className="d-flex align-items-center justify-content-center" >
                                <div className="step-but">Back</div>
                                <img src={vestinglogo} alt="elrond vesting" />
                                <div className="step-but">Next</div>
                            </div>
                        </div>
                    </div>
                </Box>
            </div>
        </>
    );
};

export default Vesting;