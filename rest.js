const express = require("express");
const users = require("./userdata.json");
const fs = require("fs");
const app = express();
const port = 3000;


app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 

// ---------------- ROUTES ----------------


app.get("/users", (req, res) => {
  const html = `
    <ul> 
      ${users.map((user) => `<li>${user.first_name} ${user.last_name}</li>`).join("")}
    </ul>
  `;
  res.send(html);
});

// GET all users (API)
app.get("/api/users", (req, res) => {
  return res.json(users);
});

// GET single user by ID
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json(user);
});

// POST - create new user
app.post("/api/users", (req, res) => {
  const body = req.body;
  if (!body.first_name || !body.last_name || !body.email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newUser = { id: users.length ? users[users.length - 1].id + 1 : 1, ...body };
  users.push(newUser);

  fs.writeFile("./userdata.json", JSON.stringify(users, null, 2), (err) => {
    if (err) return res.status(500).json({ error: "Failed to save user" });
    return res.status(201).json(newUser);
  });
});

// PATCH and DELETE combined
app.route("/api/users/:id")
  // PATCH - update user
  .patch((req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    const allowed = ["first_name", "last_name", "email", "phone"];
    for (const key of allowed) {
      if (req.body[key]) {
        users[idx][key] = req.body[key];
      }
    }

    fs.writeFile("./userdata.json", JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Could not persist changes" });
      return res.json(users[idx]); // Return updated user
    });
  })

  // DELETE - remove user
  .delete((req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    const [removed] = users.splice(idx, 1);

    fs.writeFile("./userdata.json", JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Could not persist changes" });
      return res.status(200).json(removed);
    });
  });


app.listen(port, () => console.log(`Server started at http://localhost:${port}`));
