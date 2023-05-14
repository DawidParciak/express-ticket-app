const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Concert = require('../../../models/concert.model');
const Seat = require('../../../models/seat.model')

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('GET /api/concerts', () => {
  let testConcerts;

  before(async () => {
    const testConcert1 = new Concert({
      _id: '645e76080022bad1551aa566',
      performer: 'Performer #1',
      genre: 'Genre #1',
      price: 20,
      day: 1,
      image: 'Image #1'
    });

    const testConcert2 = new Concert({
      _id: '645e76980022bad1551aa568',
      performer: 'Performer #2',
      genre: 'Genre #2',
      price: 30,
      day: 2,
      image: 'Image #2'
    });

    const testConcert3 = new Concert({
      _id: '645e763f0022bad1551aa567',
      performer: 'Performer #3',
      genre: 'Genre #3',
      price: 20,
      day: 3,
      image: 'Image #3'
    });

    testConcerts = [testConcert1, testConcert2, testConcert3];

    await Concert.insertMany(testConcerts);
  });

  after(async () => {
    await Concert.deleteMany();
  });

  it('should return all concerts', async () => {
    const res = await request(server).get('/api/concerts');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(testConcerts.length);
  });

  it('should return available tickets for each concert', async () => {
    const res = await request(server).get('/api/concerts');

    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(testConcerts.length);

    for (let i = 0; i < res.body.length; i++) {
      const concert = res.body[i];
      const reservedSeats = await Seat.countDocuments({ day: concert.day });
      const availableTickets = 50 - reservedSeats;

      expect(concert.tickets).to.be.equal(availableTickets);
    }
  });

  it('/:id should return one concert by :id ', async () => {
    const concert = testConcerts[0];
    const res = await request(server).get(`/api/concerts/${concert._id}`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.deep.equal({
      __v: 0,
      _id: concert._id.toString(),
      performer: concert.performer,
      genre: concert.genre,
      price: concert.price,
      day: concert.day,
      image: concert.image
    });
  });

  it('/:id should return a 404 error when given an invalid :id', async () => {
    const res = await request(server).get('/api/concerts/645e76080022bad1551aa469');
    expect(res.status).to.be.equal(404);
  });
});
