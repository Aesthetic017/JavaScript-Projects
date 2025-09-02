const express = require("express");
const urlRoute = require("./routes_URL");
const { connectMongoDB } = require("./connection_URL");
const URL = require("./schema_URL");

const app = express();
const PORT = 8001;

app.use(express.json());
app.use("/url", urlRoute);

connectMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// GET route to redirect
app.get("/:shortID", async (req, res) => {
  const shortID = req.params.shortID;

  const entry = await URL.findOneAndUpdate(
    { shortID },
    { $push: { visitHistory: { timestamp: new Date() } } },
    { new: true } // return the updated document
  );

  if (!entry) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  return res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at ${PORT}`));
