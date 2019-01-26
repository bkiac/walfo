const express = require('express');

const userRoutes = require('./userRoutes');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({
    something: 'happened',
  });
});

router.use('/user', userRoutes);

module.exports = router;
