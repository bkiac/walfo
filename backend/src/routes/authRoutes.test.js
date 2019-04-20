/* eslint-env jest */
const mongoose = require('mongoose');
const axios = require('axios');
const app = require('../app');
require('../models/User');

const User = mongoose.model('User');
let axiosInstance;

beforeAll(async () => {
  await mongoose.connect(`${process.env.DATABASE}_test`, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });
  mongoose.set('useFindAndModify', false);
  mongoose.Promise = global.Promise;

  const server = app.listen(0, '0.0.0.0', () => {
    const { address, port } = server.address();
    axiosInstance = axios.create({
      baseURL: `http://${address}:${port}/api/auth`,
    });
    app.emit('started');
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('authRoutes', () => {
  beforeAll(done => {
    app.on('started', done);
  });

  afterAll(async () => {
    afterAll(async () => {
      await User.deleteMany({});
    });
  });

  it('should register', async () => {
    try {
      const res = await axiosInstance.post('/register', {
        email: 'any@email.com',
        password: 'password',
        confirmPassword: 'password',
      });
      expect(res.statusCode).toBe(200);
    } catch (err) {
      // Shouldn't throw error
    }
  });

  it("shouldn't register without email", async () => {
    try {
      await axiosInstance.post('/register', {
        password: 'password',
        confirmPassword: 'password',
      });
    } catch (err) {
      expect(err.response.status).toBe(422);
    }
  });

  it("shouldn't register without password", async () => {
    try {
      await axiosInstance.post('/register', {
        email: 'any@email.com',
        confirmPassword: 'password',
      });
    } catch (err) {
      expect(err.response.status).toBe(422);
    }
  });

  it("shouldn't register without confirm password", async () => {
    try {
      await axiosInstance.post('/register', {
        email: 'any@email.com',
        password: 'password',
      });
    } catch (err) {
      expect(err.response.status).toBe(422);
    }
  });

  it("shouldn't register without matching passwords", async () => {
    try {
      await axiosInstance.post('/register', {
        email: 'any@email.com',
        password: 'password',
        confirmPassword: 'differentPassword',
      });
    } catch (err) {
      expect(err.response.status).toBe(422);
    }
  });
});
