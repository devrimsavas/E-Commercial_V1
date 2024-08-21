//search post route 

const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/SearchController');

// Search route
router.post('/', SearchController.searchProducts);

module.exports = router;
