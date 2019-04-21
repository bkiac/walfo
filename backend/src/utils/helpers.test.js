/* eslint-env jest */
const helpers = require('./helpers');

describe('helpers', () => {
  describe('chunk', () => {
    describe('array.length > chunkSize', () => {
      it('should return a chunked array, with chunks in the given size', () => {
        const array = [1, 2, 3, 4];
        const chunkSize = 2;
        const chunks = helpers.chunk(array, chunkSize);
        expect(chunks).toHaveLength(Math.ceil(array.length / chunkSize));
        chunks.forEach(ch => expect(ch).toHaveLength(chunkSize));
      });
    });

    describe('array.length <= chunkSize', () => {
      it('should return the whole array in the first chunk', () => {
        const array = [1, 2, 3, 4];
        const chunkSize = 6;
        const chunks = helpers.chunk(array, chunkSize);
        expect(chunks).toHaveLength(Math.ceil(array.length / chunkSize));
        chunks.forEach(ch => expect(ch).toHaveLength(array.length));
      });
    });
  });
});
