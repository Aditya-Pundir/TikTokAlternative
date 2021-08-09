const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to the node react app");
});

app.post("/database/:username/:role", (req, res) => {
  const { username } = req.params;
  const { role } = req.params;
  let dataExist = fs.readFileSync("./database.txt", "utf8");
  let dataNew = `{${dataExist + username + ": " + role}}`;

  fs.writeFileSync("./database.txt", JSON.stringify(dataNew));
  res.send(
    JSON.stringify({
      text: "Hello from Aditya.",
    })
  );
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
