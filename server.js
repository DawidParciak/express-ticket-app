const express = require('express');
const cors = require('cors');

//import routes
const testimonialRoutes = require('./routes/testimonials.routes.js');
const concertsRoutes = require('./routes/concerts.routes.js');
const seatsRoutes = require('./routes/seats.routes.js');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', testimonialRoutes);
app.use('/api',concertsRoutes);
app.use('/api',seatsRoutes);

app.use((req, res) => {
  res.status(404).send(
    res.json({ message: 'Not found...' })
  );
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
