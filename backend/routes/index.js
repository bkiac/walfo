const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({
    something: 'happened',
  });
});

module.exports = router;
