const connectToMongo = require("./db"); // Importing db.js to connect to MongoDB
const express = require("express");

connectToMongo(); // Connecting to MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Using express.json() so that we can send JSON responses

// Routing for server's home page:
app.get("/", (req, res) => {
  res.send("Welcome to the node react app");
});

// Available routes:
app.use("/api/auth", require("./routes/auth")); // Authentication Route
app.use("/api/notes", require("./routes/notes")); // Notes Route

// Making the server listen on PORT:
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
