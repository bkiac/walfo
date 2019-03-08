/* eslint-env jest */
const mongoose = require('mongoose');
require('../../src/models/User');
require('../../src/models/Tags');
require('../../src/models/Transaction');

const User = mongoose.model('User');
const Tags = mongoose.model('Tags');
const Transaction = mongoose.model('Transaction');

beforeAll(async () => {
  await mongoose.connect(`${process.env.DATABASE}_test`, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });
  mongoose.set('useFindAndModify', false);
  mongoose.Promise = global.Promise;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Transaction', () => {
  let user;
  let BTC;
  let ETH;
  let LTC;

  beforeAll(async () => {
    user = await new User({
      email: 'not@your.keys',
      password: 'notyourbitcoin',
    });
    await user.save();

    const tags = await new Tags({
      array: ['hodl', 'pump', 'dump'],
    });
    await tags.save();

    BTC = [
      {
        user,
        portfolio: 'Main',
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-06-12',
        amount: 1,
        price: 3500,
        tags,
      },
      {
        user,
        portfolio: 'Secondary',
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-06-13',
        amount: 2,
        price: 3500,
        tags,
      },
      {
        user,
        portfolio: 'Tertiary',
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-06-14',
        amount: 3,
        price: 3500,
        tags,
      },
    ];
    ETH = [
      {
        user,
        portfolio: 'Main',
        symbol: 'ETH',
        type: 'BUY',
        date: '2018-07-12',
        amount: 1,
        price: 250,
        tags,
      },
      {
        user,
        portfolio: 'Secondary',
        symbol: 'ETH',
        type: 'BUY',
        date: '2018-07-13',
        amount: 2,
        price: 250,
        tags,
      },
    ];
    LTC = [
      {
        user,
        portfolio: 'Main',
        symbol: 'LTC',
        type: 'BUY',
        date: '2018-08-12',
        amount: 1,
        price: 3500,
        tags,
      },
    ];

    const txs = [...BTC, ...ETH, ...LTC];
    await Promise.all(txs.map(tx => new Transaction(tx).save()));
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Tags.deleteMany({});
    await Transaction.deleteMany({});
  });

  describe('getSymbols', () => {
    it("should return all of the user's symbols", async () => {
      const symbols = await Transaction.getSymbols(user._id);
      expect(symbols.sort()).toEqual(['BTC', 'ETH', 'LTC'].sort());
    });

    it('should return symbols with matching portfolio', async () => {
      let symbols = await Transaction.getSymbols(user._id, 'Main');
      expect(symbols.sort()).toEqual(['BTC', 'ETH', 'LTC'].sort());

      symbols = await Transaction.getSymbols(user._id, 'Secondary');
      expect(symbols.sort()).toEqual(['BTC', 'ETH'].sort());

      symbols = await Transaction.getSymbols(user._id, 'Tertiary');
      expect(symbols.sort()).toEqual(['BTC'].sort());
    });

    it('should return symbols which were added before the specified date', async () => {
      let symbols = await Transaction.getSymbols(user._id, undefined, '2018-08-12');
      expect(symbols.sort()).toEqual(['BTC', 'ETH', 'LTC'].sort());

      symbols = await Transaction.getSymbols(user._id, undefined, '2018-07-12');
      expect(symbols.sort()).toEqual(['BTC', 'ETH'].sort());

      symbols = await Transaction.getSymbols(user._id, undefined, '2018-06-12');
      expect(symbols.sort()).toEqual(['BTC'].sort());
    });

    it('should return symbols which were added before the specified date with matching portfolio', async () => {
      let symbols = await Transaction.getSymbols(user._id, 'Main', '2018-08-12');
      expect(symbols.sort()).toEqual(['BTC', 'ETH', 'LTC'].sort());

      symbols = await Transaction.getSymbols(user._id, 'Secondary', '2018-07-12');
      expect(symbols.sort()).toEqual(['BTC'].sort());

      symbols = await Transaction.getSymbols(user._id, 'Tertiary', '2018-06-12');
      expect(symbols.sort()).toEqual([].sort());
    });
  });

  describe('getPositions', () => {
    it('should return correct positions', async () => {
      // const positions = await Transaction.getPositions(user._id, 'Main');
      // expect(positions.sort()).toEqual([
      //   [
      //     {
      //       id: 'LTC',
      //       tags: ['hodl', 'pump', 'dump'],
      //       totalHoldings: 1,
      //       avgCost: 3500,
      //       transactions: [{
      //         _id: LTC[0]._id,
      //         amount: LTC[0].amount,
      //         date: LTC[0].
      //       }],
      //     },
      //     {
      //       id: 'ETH',
      //       tags: ['hodl', 'pump', 'dump'],
      //       totalHoldings: 1,
      //       avgCost: 250,
      //       transactions: [{ ...ETH[0], date: undefined, _id: undefined }],
      //     },
      //     {
      //       id: 'BTC',
      //       tags: ['hodl', 'pump', 'dump'],
      //       totalHoldings: 1,
      //       avgCost: 3500,
      //       transactions: [{ ...BTC[0], date: undefined, _id: undefined }],
      //     },
      //   ],
      // ]);
    });
  });
});
