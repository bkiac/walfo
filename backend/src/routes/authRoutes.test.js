/* eslint-env jest */
const db = require('../../test/database');

const { axios } = global;

beforeAll(async () => {
  await db.setup();
});

afterAll(async () => {
  await db.teardown();
});

describe('authRoutes', () => {
  const registerRoute = '/auth/register';
  const loginRoute = '/auth/login';

  describe(`POST ${registerRoute}`, () => {
    it('should register', async () => {
      try {
        const res = await axios.post(registerRoute, {
          email: 'any@email.com',
          password: 'password',
          confirmPassword: 'password',
        });
        expect(res.status).toBe(200);
      } catch (err) {
        console.error(err);
        throw Error(err);
      }
    });

    it("shouldn't register without email", async () => {
      try {
        await axios.post(registerRoute, {
          password: 'password',
          confirmPassword: 'password',
        });
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it("shouldn't register without password", async () => {
      try {
        await axios.post(registerRoute, {
          email: 'any@email.com',
          confirmPassword: 'password',
        });
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it("shouldn't register without confirm password", async () => {
      try {
        await axios.post(registerRoute, {
          email: 'any@email.com',
          password: 'password',
        });
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });

    it("shouldn't register without matching passwords", async () => {
      try {
        await axios.post(registerRoute, {
          email: 'any@email.com',
          password: 'password',
          confirmPassword: 'differentPassword',
        });
      } catch (err) {
        expect(err.response.status).toBe(422);
      }
    });
  });

  describe(`POST ${loginRoute}`, () => {
    const email = 'login@test.com';
    const password = 'password';

    beforeAll(async () => {
      try {
        await axios.post(registerRoute, {
          email,
          password,
          confirmPassword: password,
        });
      } catch (err) {
        console.error(err);
        throw Error(err);
      }
    });

    it('should login', async () => {
      try {
        const res = await axios.post(loginRoute, {
          email,
          password,
        });
        expect(res.status).toBe(200);
      } catch (err) {
        console.error(err);
        throw Error(err);
      }
    });

    it("shouldn't login without email", async () => {
      try {
        await axios.post(loginRoute, {
          password,
        });
      } catch (err) {
        expect(err.response.status).toBe(401);
      }
    });

    it("shouldn't login without password", async () => {
      try {
        await axios.post(loginRoute, {
          email,
        });
      } catch (err) {
        expect(err.response.status).toBe(401);
      }
    });

    it("shouldn't login with wrong password", async () => {
      try {
        await axios.post(loginRoute, {
          email,
          password: 'wrongPassword',
        });
      } catch (err) {
        expect(err.response.status).toBe(401);
      }
    });
  });
});
