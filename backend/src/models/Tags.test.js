/* eslint-env jest */
const db = require('../../test/database');

const { Tags } = global;

beforeAll(async () => {
  await db.setup();
});

afterAll(async () => {
  await db.teardown();
});

describe('Tags', () => {
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

    it('should not have the same elements', async () => {
      const tags = ['these', 'are', 'the', 'same', 'same', 'same'];
      const tagsDoc = await Tags.create({ array: tags });

      const expectedTags = ['these', 'are', 'the', 'same'];

      expect([...tagsDoc.array].sort()).toEqual(expectedTags.sort());
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
