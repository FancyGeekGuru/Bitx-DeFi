import * as React from 'react';
import Countdown from 'react-countdown';
import './Time.scss';
import {
  Container,
  Row,
  Col,
  ProgressBar
} from 'react-bootstrap';

import { ISaleStatusProvider } from '../../utils/state';
import { paddingTwoDigits } from '../../utils/convert';

const Time = (props) => {
  const [targetTimestamp, setTargetTimestamp] = React.useState<number>((new Date()).getTime());
  React.useEffect(() => {
    setTargetTimestamp(props.saleStatus? props.saleStatus.leftTimestamp : new Date());
  }, [props.saleStatus]);

  interface Props {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }

  const renderer: React.FC<Props> = ({
    days,
    hours,
    minutes,
    seconds,
    completed
  }) => {
    // console.log('>>> in timer: ',days, hours, minutes, seconds, completed);

    return (
      <Row className='custom-timer color-white'>
        <Col xs={6} sm={3} className='customer-timer-block'>
          <div className='customer-timer-time'>{paddingTwoDigits(days)}</div>
          <div className='customer-timer-uint'>Days</div>
        </Col>
        <Col xs={6} sm={3} className='customer-timer-block'>
          <div className='customer-timer-time'>{paddingTwoDigits(hours)}</div>
          <div className='customer-timer-uint'>Hours</div>
        </Col>
        <Col xs={6} sm={3} className='customer-timer-block'>
          <div className='customer-timer-time'>{paddingTwoDigits(minutes)}</div>
          <div className='customer-timer-uint'>Mins</div>
        </Col>
        <Col xs={6} sm={3} className='customer-timer-block'>
          <div className='customer-timer-time'>{paddingTwoDigits(seconds)}</div>
          <div className='customer-timer-uint'>Secs</div>
        </Col>
      </Row>
    );
  };
  
  return (
    <Countdown date={targetTimestamp} renderer={renderer} />
  );
};

export default Time;