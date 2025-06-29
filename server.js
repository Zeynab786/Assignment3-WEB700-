/********************************************************************************
*  WEB700 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Zeinab Mohamed      Student ID: 123970246      Date: 14th June 2025
*
*  Published URL: https://assignment3-l1a5p5n31-zeynab786s-projects.vercel.app 
*
********************************************************************************/
const express = require("express");
const path = require("path");

const LegoData = require("./modules/legoSets");
const legoData = new LegoData();

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/lego/sets", async (req, res) => {
  try {
    const theme = req.query.theme;

    if (theme) {
      const sets = await legoData.getSetsByTheme(theme);
      res.json(sets);
    } else {
      const sets = await legoData.getAllSets();
      res.json(sets);
    }
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    const setNum = req.params.set_num;
    const set = await legoData.getSetByNum(setNum);
    res.json(set);
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// ✅ Proper Vercel export: wait for data to initialize before exporting the app
module.exports = async (req, res) => {
  try {
    if (!legoData.initialized) {
      await legoData.initialize();
      legoData.initialized = true; // flag to avoid re-initializing on each request
    }
    return app(req, res);
  } catch (err) {
    console.error("Initialization failed:", err);
    res.status(500).send("Server initialization error");
  }
};
