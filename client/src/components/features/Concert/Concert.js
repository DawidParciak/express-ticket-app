import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import './Concert.scss';
import { io } from 'socket.io-client';

const MAX_TICKETS = 50;

const Concert = ({ performer, price, genre, day, image, tickets }) => {
  const [availableTickets, setAvailableTickets] = useState(tickets);
  const socket = io(
    process.env.NODE_ENV === 'production' ? '' : 'localhost:8000',
    { transports: ['websocket'] }
  );

  useEffect(() => {
    socket.on('seatsUpdated', handleSeatsUpdated)

    return () => {
      socket.off('seatsUpdated', handleSeatsUpdated);
    };
  }, []);

  const handleSeatsUpdated = (seats) => {
    const reservedSeats = seats.filter(seat => seat.day === day).length;
    const newAvailableTickets = MAX_TICKETS - reservedSeats;
    setAvailableTickets(newAvailableTickets);
  }

  return (
    <article className="concert">
      <Row noGutters>
        <Col xs="6">
          <div className="concert__image-container">
            <img className="concert__image-container__img" src={image} alt={performer} />
          </div>
        </Col>
        <Col xs="6">
          <div className="concert__info">
            <img className="concert__info__back" src={image} alt={performer} />
            <h2 className="concert__info__performer">{performer}</h2>
            <h3 className="concert__info__genre">{genre}</h3>
            <p className="concert__info__tickets">Only {availableTickets} tickets left!</p>
            <p className="concert__info__day-n-price">Day: {day}, Price: {price}$</p>
          </div>
        </Col>
      </Row>
    </article>
  );
};

export default Concert;
