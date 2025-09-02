const shortid = require("shortid")

const URL = require('./schema_URL')

async function handleGenerateNewURL(req, res ){
  const body = req.body;
  if (!body.url) return res.status(400).json({error:"URL Required"})  
  const shortID = shortid.generate()
  await URL.create({
    shortID:shortID,
    redirectURL: body.url,
    visitHistory:[]
  });
  return res.json({id : shortID});
}

 async function handleAnalytics(req,res){
  const shortID = req.params.shortID
  const result = await URL.findOne({shortID})
  return res.json({totalClicks:result.visitHistory.length, analytics:result.visitHistory})
}

module.exports = {
    handleGenerateNewURL,handleAnalytics,
}