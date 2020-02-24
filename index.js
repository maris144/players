const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const axios = require("axios");

app.set("view engine", "ejs");

app.get("/view", function(req, res) {
  let id = req.query.id;
  let database = require("./database/players.json");
  let player = database.find(p => p.id == id);
  res.render("view", { player: player });
});

app.get("/delete", function(req, res) {
  let id = req.query.id;
  let database = require("./database/players.json");
  let players = database.filter(p => p.id != id);
  var jsonPath = path.join(__dirname, "database", "players.json");
  fs.writeFileSync(jsonPath, JSON.stringify(players));
  res.redirect("/home");
});

app.get("/home", function(req, res) {
  var jsonPath = path.join(__dirname, "database", "players.json");
  var contents = fs.readFileSync(jsonPath);
  res.render("home", { database: JSON.parse(contents) });
});

app.get("/", function(req, res) {
  var jsonPath = path.join(__dirname, "database", "players.json");

  let players = [];
  axios.get("https://www.balldontlie.io/api/v1/players").then(response => {
    const responsePlayers = response.data.data;
    fs.writeFileSync(jsonPath, JSON.stringify(responsePlayers));
    res.redirect("/home");
  });
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
