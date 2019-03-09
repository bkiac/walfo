/* eslint-env jest */
const mongoose = require('mongoose');
require('../../src/models/Tags');

const Tags = mongoose.model('Tags');

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

describe('Tags', () => {
  afterAll(async () => {
    await Tags.deleteMany({});
  });

  describe('addToSet', () => {
    it('should add new element', async () => {
      const tags = ['brand', 'new', 'tags'];
      let tagsDoc = await Tags.create({ array: tags });

      const oneNewTag = ['oneNew'];
      tagsDoc = await Tags.addToSet(tagsDoc._id, oneNewTag);

      expect(JSON.stringify(tagsDoc.array.sort())).toEqual(
        JSON.stringify([...tags, ...oneNewTag].sort()),
      );
    });

    it('should add multiple new elements', async () => {
      const tags = ['very', 'old', 'tags'];
      let tagsDoc = await Tags.create({ array: tags });

      const newTags = ['brand', 'new'];
      tagsDoc = await Tags.addToSet(tagsDoc._id, newTags);

      expect([...tagsDoc.array].sort()).toEqual([...tags, ...newTags].sort());
    });

    it('should only add new elements', async () => {
      const tags = ['brand', 'new', 'tags'];
      let tagsDoc = await Tags.create({ array: tags });

      const overlappingTags = ['overlapping', 'tags'];
      tagsDoc = await Tags.addToSet(tagsDoc._id, overlappingTags);

      expect([...tagsDoc.array].sort()).toEqual([...tags, 'overlapping'].sort());
    });

    it('should not add any elements', async () => {
      const tags = ['brand', 'new', 'tags'];
      let tagsDoc = await Tags.create({ array: tags });

      const sameTags = ['brand', 'new', 'tags'];
      tagsDoc = await Tags.addToSet(tagsDoc._id, sameTags);

      expect([...tagsDoc.array].sort()).toEqual(tags.sort());
    });
  });
});