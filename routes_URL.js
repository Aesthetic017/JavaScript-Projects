const express = require('express');
const {handleGenerateNewURL,handleAnalytics} = require('./controllers_URL')
const router = express.Router();

router.post('/', handleGenerateNewURL)

router.get('/analytics/:shortID',handleAnalytics)

module.exports=router;