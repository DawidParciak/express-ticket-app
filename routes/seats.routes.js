const express = require('express');
const router = express.Router();
const uuid = require('uuid').v4;
db = require('../db.js');

router.route('/seats').get((req, res) => {
  res.json(db.seats);
});

router.route('/seats/random').get((req, res) => {
  res.json(db.seats[Math.floor(Math.random() * (db.seats.length))]);
});

router.route('/seats/:id').get((req, res) => {
  res.json(db.seats.find((seat) => seat.id === +req.params.id));
});

router.route('/seats').post((req, res) => {
  const { day, seat, client, email } = req.body;
  const id = uuid();
  const newSeats = {
    id: id,
    day: day,
    seat: seat,
    client: client,
    email: email,
  };

  if (db.seats.some((seatCheck) => seatCheck.day == newSeats.day && seatCheck.seat == newSeats.seat)) {
    res.json({ message: 'The slot is already taken!' });
    res.status(409).json({ message: 'The slot is already taken!' })
  } else {
    db.seats.push(newSeats);
    res.json({ message: 'OK' });
  }
});

router.route('/seats/:id').put((req, res) => {
  const { day, seat, client, email } = req.body;
  const id = +req.params.id;
  const newSeat = db.seats.find((seat) => seat.id === id)
  
  senewSeatat.day = day;
  newSeat.seat = seat;
  newSeat.client = client;
  newSeat.email = email;

  res.json({ message: 'OK' });
});

router.route('/seats/:id').delete((req, res) => {
  const id = +req.params.id;
  const index = db.seats.findIndex((seat) => seat.id === id)

  db.seat.splice(index, 1)
  res.json({ message: 'OK' });
})

module.exports = router;
