const express = require('express');
const router = express.Router();
const SeatControllers = require('../controllers/seats.controller');

router.get('/seats', SeatControllers.getAll);
router.get('/seats/:id', SeatControllers.getById);
router.post('/seats', SeatControllers.postNew);
router.put('/seats/:id', SeatControllers.putById);
router.delete('/seats/:id', SeatControllers.deleteById);

module.exports = router;
