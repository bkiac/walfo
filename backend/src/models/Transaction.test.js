/* eslint-env jest */
const _ = require('lodash');
const moment = require('moment');

const { User, Tags, Transaction } = global;

describe('Transaction', () => {
  let user;

  const PRIMARY_PORTFOLIO = 'Primary';
  const SECONDARY_PORTFOLIO = 'Secondary';
  const TERTIARY_PORTFOLIO = 'Tertiary';

  const TAGS_1 = ['hodl', 'satoshi', 'nakamoto'];
  const TAGS_2 = ['hodl', 'pump', 'libertarianism'];
  const TAGS_3 = ['hodl', 'pump', 'dump'];

  beforeAll(async () => {
    user = await new User({
      email: 'not@your.keys',
      password: 'notyourbitcoin',
    });
    await user.save();

    const tags1 = await new Tags({
      array: TAGS_1,
    });
    await tags1.save();

    const tags2 = await new Tags({
      array: TAGS_2,
    });
    await tags2.save();

    const tags3 = await new Tags({
      array: TAGS_3,
    });
    await tags3.save();

    const BTC = [
      {
        user,
        portfolio: PRIMARY_PORTFOLIO,
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-06-12',
        amount: 1,
        price: 3500,
        tags: tags1,
      },
      {
        user,
        portfolio: PRIMARY_PORTFOLIO,
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-05-12',
        amount: 1,
        price: 4000,
        tags: tags1,
      },
      {
        user,
        portfolio: PRIMARY_PORTFOLIO,
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-04-12',
        amount: 1,
        price: 4500,
        tags: tags1,
      },
      {
        user,
        portfolio: SECONDARY_PORTFOLIO,
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-06-13',
        amount: 2,
        price: 3500,
        tags: tags1,
      },
      {
        user,
        portfolio: SECONDARY_PORTFOLIO,
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-06-13',
        amount: 2,
        price: 3500,
        tags: tags1,
      },
      {
        user,
        portfolio: TERTIARY_PORTFOLIO,
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-06-14',
        amount: 1,
        price: 3000,
        tags: tags1,
      },
      {
        user,
        portfolio: TERTIARY_PORTFOLIO,
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-06-15',
        amount: 1,
        price: 4000,
        tags: tags1,
      },
      {
        user,
        portfolio: TERTIARY_PORTFOLIO,
        symbol: 'BTC',
        type: 'BUY',
        date: '2018-06-16',
        amount: 1,
        price: 5000,
        tags: tags1,
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
        tags: tags2,
      },
      {
        user,
        portfolio: PRIMARY_PORTFOLIO,
        symbol: 'ETH',
        type: 'BUY',
        date: '2018-08-12',
        amount: 3,
        price: 200,
        tags: tags2,
      },
      {
        user,
        portfolio: SECONDARY_PORTFOLIO,
        symbol: 'ETH',
        type: 'BUY',
        date: '2018-07-13',
        amount: 2,
        price: 250,
        tags: tags2,
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
        tags: tags3,
      },
    ];

    const txs = [...BTC, ...ETH, ...LTC];
    await Promise.all(txs.map(tx => new Transaction(tx).save()));
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

      // Contains all possible symbols
      expect(positions).toHaveLength(3);

      // BTC transactions aggregated correctly
      const expectedBtcPosition = {
        symbol: 'BTC',
        holdings: 3,
        cost: 12000,
      };
      const currentBtcPosition = positions.find(p => p.symbol === 'BTC');
      expect(currentBtcPosition).toMatchObject(expectedBtcPosition);

      // ETH transactions aggregated correctly
      const expectedEthPosition = {
        symbol: 'ETH',
        holdings: 4,
        cost: 850,
      };
      const currentEthPosition = positions.find(p => p.symbol === 'ETH');
      expect(currentEthPosition).toMatchObject(expectedEthPosition);

      // LTC transactions aggregated correctly
      const expectedLtcPosition = {
        symbol: 'LTC',
        holdings: 1,
        cost: 35,
      };
      const currentLtcPosition = positions.find(p => p.symbol === 'LTC');
      expect(currentLtcPosition).toMatchObject(expectedLtcPosition);
    });

    it("should return the user's transactions grouped into positions filtered by tags", async () => {
      const tags = ['hodl', 'pump'];
      const positions = await Transaction.getPositions(user._id, PRIMARY_PORTFOLIO, tags);

      // Should only be 2 matching position
      expect(positions).toHaveLength(2);

      // Filter tags array is a subset of the merged array of position tags
      const allTagsForPositions = positions.reduce((ts, p) => [..._.uniq(p.tags)]);
      expect(allTagsForPositions).toEqual(expect.arrayContaining(tags));

      // filtered ETH transactions aggregated correctly
      const expectedEthPosition = {
        symbol: 'ETH',
        holdings: 4,
        cost: 850,
      };
      const currentEthPosition = positions.find(p => p.symbol === 'ETH');
      expect(currentEthPosition).toMatchObject(expectedEthPosition);

      // filtered LTC transactions aggregated correctly
      const expectedLtcPosition = {
        symbol: 'LTC',
        holdings: 1,
        cost: 35,
      };
      const currentLtcPosition = positions.find(p => p.symbol === 'LTC');
      expect(currentLtcPosition).toMatchObject(expectedLtcPosition);
    });

    it('should return positions with transactions, which were added before the specified date', async () => {
      const positions = await Transaction.getPositions(
        user._id,
        PRIMARY_PORTFOLIO,
        undefined,
        moment('2018-06-01'),
      );

      // Should only be 1 matching position
      expect(positions).toHaveLength(1);

      // filtered BTC transactions aggregated correctly
      const expectedBtcPosition = {
        symbol: 'BTC',
        holdings: 2,
        cost: 8500,
      };
      const currentBtcPosition = positions.find(p => p.symbol === 'BTC');
      expect(currentBtcPosition).toMatchObject(expectedBtcPosition);
    });

    it('should return positions with transactions, which were added before the specified date, filtered by tags', async () => {
      const tags = ['hodl', 'pump'];
      const positions = await Transaction.getPositions(
        user._id,
        PRIMARY_PORTFOLIO,
        tags,
        moment('2018-08-01'),
      );

      // Should only be 1 matching position
      expect(positions).toHaveLength(1);

      // filtered ETH transactions aggregated correctly
      const expectedEthPosition = {
        symbol: 'ETH',
        holdings: 1,
        cost: 250,
      };
      const currentEthPosition = positions.find(p => p.symbol === 'ETH');
      expect(currentEthPosition).toMatchObject(expectedEthPosition);
    });
  });

  describe('getPositionsForEachDayBetweenDates', () => {
    it('should return correct positions for each day between dates', async () => {
      const startDate = moment('2018-06-14').endOf('day');
      const endDate = moment('2018-06-16').endOf('day');
      // Include the last day
      const numOfDays = Math.floor(moment.duration(endDate.diff(startDate)).asDays()) + 1;

      const positionsForEachDay = await Transaction.getPositionsForEachDayBetweenDates(
        user._id,
        TERTIARY_PORTFOLIO,
        startDate,
        endDate,
      );

      // Should have a position array for each day
      expect(positionsForEachDay).toHaveLength(numOfDays);

      // Should only have 1 position for the first day
      let [positionsForTheDay] = positionsForEachDay;
      expect(positionsForTheDay).toHaveLength(1);
      let expectedPosition = {
        symbol: 'BTC',
        holdings: 1,
        cost: 3000,
      };
      expect(positionsForTheDay[0]).toMatchObject(expectedPosition);

      // Should only have 1 position for the second day
      [, positionsForTheDay] = positionsForEachDay;
      expect(positionsForTheDay).toHaveLength(1);
      expectedPosition = {
        symbol: 'BTC',
        holdings: 2,
        cost: 7000,
      };
      expect(positionsForTheDay[0]).toMatchObject(expectedPosition);

      // Should only have 1 position for the third day
      [, , positionsForTheDay] = positionsForEachDay;
      expect(positionsForTheDay).toHaveLength(1);
      expectedPosition = {
        symbol: 'BTC',
        holdings: 3,
        cost: 12000,
      };
      expect(positionsForTheDay[0]).toMatchObject(expectedPosition);
    });
  });
});
