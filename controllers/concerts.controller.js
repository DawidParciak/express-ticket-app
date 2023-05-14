const Concert = require('../models/concert.model.js');
const Seat = require('../models/seat.model.js');
var sanitize = require('mongo-sanitize');

exports.getAll = async (req, res) => {
  try {
    const concerts = await Concert.find();
    const updatedConcerts = [];

    for (let i = 0; i < concerts.length; i++) {
      const concert = concerts[i];
      const reservedSeats = await Seat.countDocuments({ day: concert.day });
      const availableTickets = 50 - reservedSeats;

      const updatedConcert = concert.toObject();
      updatedConcert.tickets = availableTickets;
      updatedConcerts.push(updatedConcert);
    }

    res.json(updatedConcerts);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if(!concert) res.status(404).json({ message: 'Not found' });
    else res.json(concert);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.postNew = async (req, res) => {
  try {
    const { performer, genre, price, day, image } = sanitize(req.body);
    const newConcert = new Concert({ performer: performer, genre: genre, price: price, day: day, image: image });
    await newConcert.save();
    res.json({ message: 'OK' });
  } 
  catch(err) {
    res.status(500).json({ message: err });
  } 
};

exports.putById = async (req, res) => {
  const { performer, genre, price, day, image } = sanitize(req.body);
  try {
    const concert = await Concert.findById(req.params.id);
    if(concert) {
      await Concert.updateOne({ _id: req.params.id }, { $set: { performer: performer, genre: genre, price: price, day: day, image: image }});
      res.json(await Concert.findById(req.params.id));
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if(concert) {
      await Concert.deleteOne({ _id: req.params.id });
      res.json(concert);
    }
    else {
      res.status(404).json({ message: 'Not found...' });
    }
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};
