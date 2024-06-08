var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.json({message:"API is working properly,from test--API"});
});

module.exports = router;

//