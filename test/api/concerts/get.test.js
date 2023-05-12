const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Concert = require('../../../models/concert.model');
const Seat = require('../../../models/seat.model')

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('GET /api/concerts', () => {

  before(async () => {
    const testConcert1 = new Concert({
      _id: '645e76080022bad1551aa566',
      performer: 'Performer #1',
      genre: 'Genre #1',
      price: 20,
      day: 1,
      image: 'Image #1'
    });
    await testConcert1.save();

    const testConcert2 = new Concert({
      _id: '645e76980022bad1551aa568',
      performer: 'Performer #2',
      genre: 'Genre #2',
      price: 30,
      day: 2,
      image: 'Image #2'
    });
    await testConcert2.save();

    const testConcert3 = new Concert({
      _id: '645e763f0022bad1551aa567',
      performer: 'Performer #3',
      genre: 'Genre #3',
      price: 20,
      day: 3,
      image: 'Image #3'
    });
    await testConcert3.save();
  });

  after(async () => {
    await Concert.deleteMany();
  })

  it('should return all concerts', async () => {
    const res = await request(server).get('/api/concerts');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(3);
  });

  it('should return available tickets for each concert', async () => {
    const res = await request(server).get('/api/concerts');

    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(3);

    for (let i = 0; i < res.body.length; i++) {
      const concert = res.body[i];
      const reservedSeats = await Seat.countDocuments({ day: concert.day });
      const availableTickets = 50 - reservedSeats;

      expect(concert.tickets).to.be.equal(availableTickets);
    }
  });

  it('/:id should return one concert by :id ', async () => {
    const concertId = '645e76080022bad1551aa566'
    const res = await request(server).get(`/api/concerts/${concertId}`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.not.be.null;
    expect(res.body._id).to.be.equal(concertId);
  });

  it('/:id should return a 404 error when given an invalid :id', async () => {
    const res = await request(server).get('/api/concerts/645e76080022bad1551aa469');
    expect(res.status).to.be.equal(404);
  });
});
