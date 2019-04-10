/* eslint-env jest */
const mongoose = require('mongoose');
require('./User');
require('./Tags');
require('./Transaction');

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

  const PRIMARY_PORTFOLIO = 'Primary';
  const SECONDARY_PORTFOLIO = 'Secondary';
  const TERTIARY_PORTFOLIO = 'Tertiary';

  const PRIMARY_TAGS = ['hodl'];
  const SECONDARY_TAGS = ['hodl', 'pump'];
  const TERTIARY_TAGS = ['hodl', 'pump', 'dump'];

  beforeAll(async () => {
    user = await new User({
      email: 'not@your.keys',
      password: 'notyourbitcoin',
    });
    await user.save();

    const primaryTags = await new Tags({
      array: PRIMARY_TAGS,
    });
    await primaryTags.save();

    const secondaryTags = await new Tags({
      array: SECONDARY_TAGS,
    });
    await secondaryTags.save();

    const tertiaryTags = await new Tags({
      array: TERTIARY_TAGS,
    });
    await tertiaryTags.save();

    const BTC = [
      {
        user,
        portfolio: PRIMARY_PORTFOLIO,
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-06-12',
        amount: 1,
        price: 3500,
        tags: primaryTags,
      },
      {
        user,
        portfolio: PRIMARY_PORTFOLIO,
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-05-12',
        amount: 1,
        price: 4000,
        tags: primaryTags,
      },
      {
        user,
        portfolio: PRIMARY_PORTFOLIO,
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-04-12',
        amount: 1,
        price: 4500,
        tags: primaryTags,
      },
      {
        user,
        portfolio: SECONDARY_PORTFOLIO,
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-06-13',
        amount: 2,
        price: 3500,
        tags: secondaryTags,
      },
      {
        user,
        portfolio: SECONDARY_PORTFOLIO,
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-06-13',
        amount: 2,
        price: 3500,
        tags: secondaryTags,
      },
      {
        user,
        portfolio: TERTIARY_PORTFOLIO,
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-06-14',
        amount: 3,
        price: 3500,
        tags: tertiaryTags,
      },
    ];
    const ETH = [
      {
        user,
        portfolio: PRIMARY_PORTFOLIO,
        symbol: 'ETH',
        type: 'BUY',
        date: '2018-07-12',
        amount: 1,
        price: 250,
        tags: primaryTags,
      },
      {
        user,
        portfolio: PRIMARY_PORTFOLIO,
        symbol: 'ETH',
        type: 'BUY',
        date: '2018-08-12',
        amount: 3,
        price: 200,
        tags: primaryTags,
      },
      {
        user,
        portfolio: SECONDARY_PORTFOLIO,
        symbol: 'ETH',
        type: 'BUY',
        date: '2018-07-13',
        amount: 2,
        price: 250,
        tags: secondaryTags,
      },
    ];
    const LTC = [
      {
        user,
        portfolio: PRIMARY_PORTFOLIO,
        symbol: 'LTC',
        type: 'BUY',
        date: '2018-08-12',
        amount: 1,
        price: 35,
        tags: primaryTags,
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
      let symbols = await Transaction.getSymbols(user._id, PRIMARY_PORTFOLIO);
      expect(symbols.sort()).toEqual(['BTC', 'ETH', 'LTC'].sort());

      symbols = await Transaction.getSymbols(user._id, SECONDARY_PORTFOLIO);
      expect(symbols.sort()).toEqual(['BTC', 'ETH'].sort());

      symbols = await Transaction.getSymbols(user._id, TERTIARY_PORTFOLIO);
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
      let symbols = await Transaction.getSymbols(user._id, PRIMARY_PORTFOLIO, '2018-08-12');
      expect(symbols.sort()).toEqual(['BTC', 'ETH', 'LTC'].sort());

      symbols = await Transaction.getSymbols(user._id, SECONDARY_PORTFOLIO, '2018-07-12');
      expect(symbols.sort()).toEqual(['BTC'].sort());

      symbols = await Transaction.getSymbols(user._id, TERTIARY_PORTFOLIO, '2018-06-12');
      expect(symbols.sort()).toEqual([].sort());
    });
  });

  describe('getPositions', () => {
    it("should return the user's transactions grouped into positions", async () => {
      const positions = await Transaction.getPositions(user._id, PRIMARY_PORTFOLIO);

      const expectedBtcPosition = {
        symbol: 'BTC',
        tags: PRIMARY_TAGS,
        holdings: 3,
        cost: 12000,
      };
      const currentBtcPosition = positions.find(p => p.symbol === 'BTC');
      expect(currentBtcPosition).toMatchObject(expectedBtcPosition);

      const expectedEthPosition = {
        symbol: 'ETH',
        tags: PRIMARY_TAGS,
        holdings: 4,
        cost: 850,
      };
      const currentEthPosition = positions.find(p => p.symbol === 'ETH');
      expect(currentEthPosition).toMatchObject(expectedEthPosition);

      const expectedLtcPosition = {
        symbol: 'LTC',
        tags: PRIMARY_TAGS,
        holdings: 1,
        cost: 35,
      };
      const currentLtcPosition = positions.find(p => p.symbol === 'LTC');
      expect(currentLtcPosition).toMatchObject(expectedLtcPosition);
    });
  });
});
