/* eslint-env jest */
const cryptocompare = require('../../src/api/cryptocompare');
const sampleCoins = require('./mktcapfull');

describe('cryptocompare', () => {
  describe('priceMultiBatch', () => {
    describe('fsym.length < 50', () => {
      it('should return correct prices object', async () => {
        const fsyms = ['BTC', 'ETH', 'LTC'];
        const tsyms = ['USD', 'EUR', 'GBP'];
        const prices = cryptocompare.collectPriceMultiBatch(
          await cryptocompare.priceMultiBatch(fsyms, tsyms),
        );

        fsyms.forEach(fsym => {
          tsyms.forEach(tsym => {
            expect(prices).toHaveProperty(`${fsym}.${tsym}`);
          });
        });
      });
    });

    describe('fsym.length >= 50', () => {
      it('should return chunked price data in a correct single prices object', async () => {
        const fsyms = sampleCoins.Data.map(d => d.CoinInfo.Name);
        const tsyms = ['USD', 'EUR', 'GBP'];

        const prices = cryptocompare.collectPriceMultiBatch(
          await cryptocompare.priceMultiBatch(fsyms, tsyms),
        );

        fsyms.forEach(fsym => {
          tsyms.forEach(tsym => {
            expect(prices).toHaveProperty(`${fsym}.${tsym}`);
          });
        });
      });
    });
  });

  describe('histoDayBatch', () => {
    it('should return correct prices object with historical data', async () => {
      const fsyms = ['BTC', 'EUR', 'LTC'];
      const tsym = 'USD';

      const prices = cryptocompare.collectHistoDayBatch(
        fsyms,
        tsym,
        await cryptocompare.histoDayBatch(fsyms, tsym),
      );

      fsyms.forEach(fsym => {
        expect(prices).toHaveProperty(fsym);
        expect(prices[fsym]).toHaveLength(30 + 1); // Default limit is 30 days + 1 day
        prices[fsym].forEach(pricePerDay => {
          expect(pricePerDay).toHaveProperty(tsym);
        });
      });
    });
  });
});
