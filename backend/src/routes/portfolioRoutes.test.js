/* eslint-env jest */
const moment = require('moment');

const { axios } = global;

// Doesn't do anything...
jest.mock('../api/cryptocompare', () => ({
  ...jest.requireActual('../api/cryptocompare'),
  collectPriceMultiBatch: jest.fn(),
}));

describe('portfolioRoutes', () => {
  const route = '/portfolios';

  const user = {
    email: 'test@portfolios.com',
    password: 'password',
    confirmPassword: 'password',
  };

  const config = {
    headers: {
      Authorization: undefined,
    },
  };

  const btcTx = {
    portfolio: 'My Portfolio',
    symbol: 'BTC',
    tags: ['PoW', 'fixed supply'],
  };
  const btcTxs = [
    {
      ...btcTx,
      date: moment()
        .subtract(10, 'day')
        .toISOString(),
      amount: 1,
      price: 3000,
      type: 'BUY',
    },
    {
      ...btcTx,
      date: moment()
        .subtract(9, 'day')
        .toISOString(),
      amount: 1,
      price: 4000,
      type: 'BUY',
    },
    {
      ...btcTx,
      date: moment()
        .subtract(8, 'day')
        .toISOString(),
      amount: 1,
      price: 3000,
      type: 'SELL',
    },
  ];

  const ethTx = {
    portfolio: 'My Portfolio',
    symbol: 'ETH',
    tags: ['PoS', 'platform'],
  };
  const ethTxs = [
    {
      ...ethTx,
      date: moment()
        .subtract(7, 'day')
        .toISOString(),
      amount: 2,
      price: 100,
      type: 'BUY',
    },
    {
      ...ethTx,
      date: moment()
        .subtract(6, 'day')
        .toISOString(),
      amount: 1,
      price: 150,
      type: 'SELL',
    },
  ];

  const ltcTx = {
    portfolio: 'My Portfolio',
    symbol: 'LTC',
    tags: ['PoW', 'fixed supply'],
  };
  const ltcTxs = [
    {
      ...ltcTx,
      date: moment()
        .subtract(5, 'day')
        .toISOString(),
      amount: 3,
      price: 50,
      type: 'BUY',
    },
    {
      ...ltcTx,
      date: moment()
        .subtract(4, 'day')
        .toISOString(),
      amount: 1,
      price: 60,
      type: 'SELL',
    },
    {
      ...ltcTx,
      date: moment()
        .subtract(3, 'day')
        .toISOString(),
      amount: 1,
      price: 40,
      type: 'SELL',
    },
  ];

  const bnbTx = {
    portfolio: 'My Portfolio',
    symbol: 'BNB',
    tags: ['platform'],
  };
  const bnbTxs = [
    {
      ...bnbTx,
      date: moment()
        .subtract(2, 'day')
        .toISOString(),
      amount: 1,
      price: 10,
      type: 'BUY',
    },
    {
      ...bnbTx,
      date: moment()
        .subtract(1, 'day')
        .toISOString(),
      amount: 1,
      price: 5,
      type: 'SELL',
    },
  ];

  const txForAnotherPortfolio = {
    ...bnbTx,
    portfolio: 'Another Portfolio',
    date: moment().toISOString(),
    amount: 1,
    price: 15,
    type: 'BUY',
  };

  const myPortfolio = {
    name: 'My Portfolio',
    cost: 3650,
    positions: [
      {
        symbol: bnbTx.symbol,
        tags: bnbTx.tags,
        holdings: 0,
        cost: 0,
      },
      {
        symbol: ltcTx.symbol,
        tags: ltcTx.tags,
        holdings: 1,
        cost: 50,
      },
      {
        symbol: ethTx.symbol,
        tags: ethTx.tags,
        holdings: 1,
        cost: 100,
      },
      {
        symbol: btcTx.symbol,
        tags: btcTx.tags,
        holdings: 1,
        cost: 3500,
      },
    ],
  };

  beforeAll(async () => {
    try {
      const res = await axios.post('/auth/register', user);
      config.headers.Authorization = `Bearer ${res.data.token}`;

      // Async/await in loop didn't work for some reason
      await axios.post('/transactions', btcTxs[0], config);
      await axios.post('/transactions', btcTxs[1], config);
      await axios.post('/transactions', btcTxs[2], config);

      await axios.post('/transactions', ethTxs[0], config);
      await axios.post('/transactions', ethTxs[1], config);

      await axios.post('/transactions', ltcTxs[0], config);
      await axios.post('/transactions', ltcTxs[1], config);
      await axios.post('/transactions', ltcTxs[2], config);

      await axios.post('/transactions', bnbTxs[0], config);
      await axios.post('/transactions', bnbTxs[1], config);

      await axios.post('/transactions', txForAnotherPortfolio, config);
    } catch (err) {
      console.log(err.response.data);
      throw Error(err);
    }
  });

  describe(`GET ${route}`, () => {
    it('should return all portfolio names', async () => {
      try {
        const res = await axios.get(route, config);
        expect(res.status).toBe(200);
        expect(res.data.sort()).toEqual(['My Portfolio', 'Another Portfolio'].sort());
      } catch (err) {
        throw Error(err);
      }
    });
  });

  describe(`GET ${route}/:portfolio`, () => {
    it('should return portfolio', async () => {
      try {
        const res = await axios.get(`${route}/My Portfolio`, config);
        expect(res.status).toBe(200);
        expect(res.data).toMatchObject(myPortfolio);
      } catch (err) {
        throw Error(err);
      }
    });

    it('should not return portfolio with invalid name', async () => {
      try {
        await axios.get(`${route}/This does not exist`, config);
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it('should not return portfolio without authorization', async () => {
      try {
        await axios.get(`${route}/My portfolio`);
      } catch (err) {
        expect(err.response.status).toBe(401);
      }
    });
  });

  describe(`GET ${route}/:portfolio/historical`, () => {
    const numOfLastDays = 5;
    const startDate = moment()
      .subtract(numOfLastDays, 'day')
      .toISOString();

    it('should return historical portfolio', async () => {
      try {
        const res = await axios.get(`${route}/My Portfolio/historical?date=${startDate}`, config);
        expect(res.status).toBe(200);
        // Last N days + today
        expect(res.data).toHaveLength(numOfLastDays + 1);
      } catch (err) {
        throw Error(err);
      }
    });

    it('should not return portfolio without date', async () => {
      try {
        await axios.get(`${route}/My portfolio/historical`, config);
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it('should not return portfolio with invalid date', async () => {
      // There shouldn't be 30 day old transactions
      const invalidDate = moment()
        .subtract(30, 'day')
        .toISOString();
      try {
        await axios.get(`${route}/My portfolio/historical?date=${invalidDate}`, config);
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it('should not return portfolio with invalid name', async () => {
      try {
        await axios.get(`${route}/This does not exist/historical`, config);
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it('should not return portfolio without authorization', async () => {
      try {
        await axios.get(`${route}/My portfolio/historical`);
      } catch (err) {
        expect(err.response.status).toBe(401);
      }
    });
  });
});
