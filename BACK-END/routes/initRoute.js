//initalize database

const express = require('express');
const { initDatabase } = require('../initController');

const router = express.Router();

router.post('/', (req, res, next) => {

    
    console.log('POST /init route handler called');
    next();
}, initDatabase);

console.log('init route loaded');

module.exports = router;
