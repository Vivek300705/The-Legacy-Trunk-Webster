// Example route
const express = require('express');
const router = express.Router();

// @route GET /api/example
router.get('/', (req, res) => {
  res.send('Hello from StoryNest backend!');
});

module.exports = router;
