/* eslint-env jest */
const moment = require('moment');

const { axios, Tags } = global;

describe('transactionRoutes', () => {
  const route = '/transactions';

  const user = {
    email: 'test@transaction.com',
    password: 'password',
    confirmPassword: 'password',
  };

  const config = {
    headers: {
      Authorization: undefined,
    },
  };

  const validTx = {
    portfolio: 'My Portfolio',
    symbol: 'BTC',
    date: moment('2018-12-12').toISOString(),
    amount: 1.2,
    price: 10421.21,
    type: 'BUY',
    tags: ['PoW', 'fixed supply'],
  };

  beforeAll(async () => {
    try {
      const res = await axios.post('/auth/register', user);
      config.headers.Authorization = `Bearer ${res.data.token}`;
    } catch (err) {
      console.error(err.response.data);
      throw Error(err);
    }
  });

  describe(`POST ${route}`, () => {
    it('should create new transaction', async () => {
      try {
        const res = await axios.post(route, validTx, config);
        expect(res.status).toBe(201);
      } catch (err) {
        console.error(err.response.data);
        throw Error(err);
      }
    });

    it('should not create new transaction without authorization', async () => {
      try {
        await axios.post(route, validTx);
      } catch (err) {
        expect(err.response.status).toBe(401);
      }
    });

    it('should not create new transaction without portfolio', async () => {
      try {
        await axios.post(route, { ...validTx, portfolio: undefined }, config);
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it('should not create new transaction without symbol', async () => {
      try {
        await axios.post(route, { ...validTx, symbol: undefined }, config);
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it('should not create new transaction with invalid symbol', async () => {
      try {
        await axios.post(route, { ...validTx, symbol: 'This symbol does not exist' }, config);
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it('should not create new transaction without date', async () => {
      try {
        await axios.post(route, { ...validTx, date: undefined }, config);
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it('should not create new transaction with wrong date format', async () => {
      try {
        await axios.post(route, { ...validTx, date: 'This is not a date' }, config);
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it('should not create new transaction without amount', async () => {
      try {
        await axios.post(route, { ...validTx, amount: undefined }, config);
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it('should not create new sell transaction with higher amount than currently available', async () => {
      const tx = {
        portfolio: 'Amount Test Portfolio',
        symbol: 'BTC',
        date: '2018-12-12',
        price: 10421.21,
      };

      try {
        // Buy 1 BTC
        await axios.post(
          route,
          {
            ...tx,
            amount: 1,
            type: 'BUY',
          },
          config,
        );

        // Try to sell 2 BTC
        await axios.post(
          route,
          {
            ...tx,
            amount: 2,
            type: 'SELL',
          },
          config,
        );
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it('should not create new transaction without price', async () => {
      try {
        await axios.post(route, { ...validTx, price: undefined }, config);
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it('should not create new transaction without type', async () => {
      try {
        await axios.post(route, { ...validTx, type: undefined }, config);
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it('should not create new transaction with wrong type', async () => {
      try {
        await axios.post(route, { ...validTx, type: 'This is not `BUY` or `SELL`' }, config);
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });
  });

  describe(`PUT ${route}/:id`, () => {
    const validUpdatedTx = {
      date: moment('2017-01-02').toISOString(),
      amount: 2,
      price: 1000,
      tags: ['changed', 'tags'],
    };

    it('should update transaction', async () => {
      try {
        // Create new transaction
        const createRes = await axios.post(route, validTx, config);
        expect(createRes.data).toMatchObject({ ...validTx, tags: { array: validTx.tags } });

        // Update previously added transaction's `date`, `amount`, `price` and `tags`
        const updateRes = await axios.put(`${route}/${createRes.data._id}`, validUpdatedTx, config);
        expect(updateRes.status).toBe(200);
        expect(updateRes.data).toMatchObject({
          _id: createRes.data._id,
          ...validUpdatedTx,
          tags: createRes.data.tags._id, // Compare only IDs because `tags` aren't populated
        });

        // Query actual `tags` array from database
        const changedTags = await Tags.findOne({ _id: createRes.data.tags._id });
        expect([...changedTags.array].sort()).toEqual(
          [...validTx.tags, ...validUpdatedTx.tags].sort(),
        );
      } catch (err) {
        console.error(err.response.data);
        throw Error(err);
      }
    });

    it('should not update transaction without authorization', async () => {
      try {
        const createRes = await axios.post(route, validTx, config);
        await axios.put(`${route}/${createRes.data._id}`, validUpdatedTx);
      } catch (err) {
        expect(err.response.status).toBe(401);
      }
    });

    it('should not update the portfolio of a transaction', async () => {
      try {
        const createRes = await axios.post(route, validTx, config);
        await axios.put(
          `${route}/${createRes.data._id}`,
          { ...validUpdatedTx, portfolio: 'Changed portfolio' },
          config,
        );
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it('should not update the symbol of a transaction', async () => {
      try {
        const createRes = await axios.post(route, validTx, config);
        await axios.put(
          `${route}/${createRes.data._id}`,
          { ...validUpdatedTx, symbol: 'ETH' },
          config,
        );
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it('should not update the type of a transaction', async () => {
      try {
        const createRes = await axios.post(route, validTx, config);
        await axios.put(
          `${route}/${createRes.data._id}`,
          { ...validUpdatedTx, type: 'SELL' },
          config,
        );
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });
  });

  describe(`DELETE ${route}/:id`, () => {
    it('should delete transaction', async () => {
      try {
        const createRes = await axios.post(route, validTx, config);
        const deleteRes = await axios.delete(`${route}/${createRes.data._id}`, config);
        expect(deleteRes.status).toBe(200);
      } catch (err) {
        console.error(err.response.data);
        throw Error(err);
      }
    });

    it('should not delete any transaction without authorization', async () => {
      try {
        const res = await axios.post(route, validTx);
        await axios.delete(`${route}/${res.data._id}`, config);
      } catch (err) {
        expect(err.response.status).toBe(401);
      }
    });
  });
});
