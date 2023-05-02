import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Progress, Alert } from 'reactstrap';
import { getSeats, loadSeatsRequest, getRequests, loadSeats} from '../../../redux/seatsRedux';
import './SeatChooser.scss';
import io from 'socket.io-client';

const SeatChooser = ({ chosenDay, chosenSeat, updateSeat }) => {
  const dispatch = useDispatch();
  const seats = useSelector(getSeats);
  const requests = useSelector(getRequests);
  const SEATS_NUMBER = 50;

  useEffect(() => {
    dispatch(loadSeatsRequest());

    const socket = io(
      process.env.NODE_ENV === 'production' ? '' : 'localhost:8000',
      { transports: ['websocket'] }
    );

    socket.on('seatsUpdated', (seatsServer) => {
      console.log('Seats received from the server');
      dispatch(loadSeats(seatsServer));
    });
  }, [dispatch]);

  const isTaken = (seatId) => {
    return (seats.some(item => (item.seat === seatId && item.day === chosenDay)));
  }

  const prepareSeat = (seatId) => {
    if(seatId === chosenSeat) return <Button key={seatId} className="seats__seat" color="primary">{seatId}</Button>;
    else if(isTaken(seatId)) return <Button key={seatId} className="seats__seat" disabled color="secondary">{seatId}</Button>;
    else return <Button key={seatId} color="primary" className="seats__seat" outline onClick={(e) => updateSeat(e, seatId)}>{seatId}</Button>;
  }

  return (
    <div>
      <h3>Pick a seat</h3>
      <small id='pickHelp' className='form-text text-muted ml-2'>
        <Button color='secondary' /> – seat is already taken
      </small>
      <small id='pickHelpTwo' className='form-text text-muted ml-2 mb-4'>
        <Button outline color='primary' /> – it's empty
      </small>
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].success && (
        <div className='seats'>
          {[...Array(SEATS_NUMBER)].map((x, i) => prepareSeat(i + 1))}
          <p>
            Free seats:
            {SEATS_NUMBER -
              seats.filter(
                (element) => Number(element.day) === Number(chosenDay)
              ).length}
            /{SEATS_NUMBER}
          </p>
        </div>
      )}
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].pending && (
        <Progress animated color='primary' value={50} />
      )}
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].error && (
        <Alert color='warning'>Couldn't load seats...</Alert>
      )}
    </div>
  )
}

export default SeatChooser;
