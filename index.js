// urlshortner.js

const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
const path = require("path");

// -------------------- MongoDB Connection --------------------
async function connectMongoDB(url) {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// -------------------- Schema & Model --------------------
const urlSchema = new mongoose.Schema(
  {
    shortID: { type: String, required: true, unique: true },
    redirectURL: { type: String, required: true },
    visitHistory: [{ timestamp: { type: Date, default: Date.now } }],
  },
  { timestamps: true }
);

const URL = mongoose.model("url", urlSchema);

// -------------------- Express App --------------------
const app = express();
const PORT = 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// -------------------- Routes --------------------

// Home Page - form + table
app.get("/", async (req, res) => {
  const allUrls = await URL.find({});
  const newShortID = req.query.newShortID || null; // read from query param
  res.render("index", { urls: allUrls, newShortID });
});

// Handle URL generation
app.post("/url", async (req, res) => {
  const body = req.body;
  if (!body.url) return res.status(400).send("URL is required");

  const shortID = shortid.generate();
  await URL.create({
    shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  // Redirect with PRG pattern to avoid re-showing on refresh
  res.redirect("/?newShortID=" + shortID);
});

// Analytics (JSON API)
app.get("/url/analytics/:shortID", async (req, res) => {
  const shortID = req.params.shortID;
  const result = await URL.findOne({ shortID });

  if (!result) return res.status(404).json({ error: "Short URL not found" });

  res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
});

// Redirect short URL
app.get("/:shortID", async (req, res) => {
  const shortID = req.params.shortID;
  const entry = await URL.findOneAndUpdate(
    { shortID },
    { $push: { visitHistory: { timestamp: new Date() } } },
    { new: true }
  );

  if (!entry) return res.status(404).send("Short URL not found");

  res.redirect(entry.redirectURL);
});

// -------------------- Start Server --------------------
connectMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`Server started at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB Error:", err));
