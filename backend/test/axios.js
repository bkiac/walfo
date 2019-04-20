const axiosLib = require('axios');

global.axios = axiosLib.create({
  baseURL: `http://${process.env.HOST}:${process.env.PORT}/api`,
});
