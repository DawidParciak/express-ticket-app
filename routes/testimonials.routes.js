const express = require('express');
const router = express.Router();
const uuid = require('uuid').v4;
db = require('../db.js');

router.route('/testimonials').get((req, res) => {
  res.json(db.testimonials);
});

router.route('/testimonials/random').get((req, res) => {
  const randomIndex = Math.floor(Math.random() * (db.testimonials.length));
  res.json(db.testimonials[randomIndex]);
});

router.route('/testimonials/:id').get((req, res) => {
  res.json(db.testimonials.find((e) => e.id === parseInt(req.params.id)));
});

router.route('/testimonials').post((req, res) => {
  const {author, text} = req.body;
  const id = uuid();
  const newTestimonial = {
    id: id,
    author: author,
    text: text,
  };

  db.testimonials.push(newTestimonial);

  res.json({ message: 'OK' });
});

router.route('/testimonials/:id').put((req, res) => {
  const {author, text} = req.body;
  const id = +req.params.id;
  const testimonial = db.testimonials.find((testimonial) => testimonial.id === id)
  
  testimonial.author = author;
  testimonial.text = text;

  res.json({ message: 'OK' });
});


router.route('/testimonials/:id').delete((req, res) => {
  const id = +req.params.id;
  const index = db.testimonials.findIndex((testimonial) => testimonial.id === id)

  db.testimonials.splice(index, 1)
  res.json({ message: 'OK' });
})

module.exports = router;
