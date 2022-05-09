const express = require('express');
const router = express.Router();

// Display running message on Heroku server
router.get('/', (req, res) => {
    res.send('server is up and running');
});

module.exports = router;