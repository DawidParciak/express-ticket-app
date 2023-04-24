const express = require('express');
const cors = require('cors');
const path = require('path');

//import routes
const testimonialRoutes = require('./routes/testimonials.routes.js');
const concertsRoutes = require('./routes/concerts.routes.js');
const seatsRoutes = require('./routes/seats.routes.js');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/client/build')));

app.use('/api', testimonialRoutes);
app.use('/api',concertsRoutes);
app.use('/api',seatsRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
  res.status(404).send(
    res.json({ message: 'Not found...' })
  );
});

app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});
