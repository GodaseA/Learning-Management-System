const express = require('express');
const router = express.Router();

// Test route to check database connection
router.get('/test-db', (req, res) => {
  res.json({ 
    message: 'Database test route working',
    mongoose: require('mongoose').connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

module.exports = router;
