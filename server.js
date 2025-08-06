/********************************************************************************
*  WEB700 – Assignment 06
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Zeinab Mohamed      Student ID: 123970246      Date: 14th June 2025
*
*  Published URL: https://assignment6-l1a5p5n31-zeynab786s-projects.vercel.app 
*
********************************************************************************/

const LegoData = require("./modules/legoSets");
const legoData = new LegoData();
const express = require('express');
const app = express();
const path = require('path');
const HTTP_PORT = process.env.PORT || 8080;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home
app.get("/", (req, res) => {
    res.render("home");
});

// About
app.get("/about", (req, res) => {
    res.render("about");
});

// List all Lego Sets or filter by theme
app.get("/lego/sets", async (req, res) => {
    try {
        const sets = req.query.theme 
            ? await legoData.getSetsByTheme(req.query.theme)
            : await legoData.getAllSets();
        res.render("sets", { sets });
    } catch (err) {
        res.status(404).render("404", { message: err });
    }
});

// View individual Lego Set
app.get("/lego/sets/:set_num", async (req, res) => {
    try {
        const set = await legoData.getSetByNum(req.params.set_num);
        res.render("set", { set });
    } catch (err) {
        res.status(404).render("404", { message: err });
    }
});

// Show Add Set Form
app.get('/lego/addSet', async (req, res) => {
    try {
        const themes = await legoData.getAllThemes();
        res.render("addSet", { themes });
    } catch (err) {
        res.status(404).render("404", { message: err });
    }
});

// Handle Add Set Form Submission
app.post('/lego/addSet', async (req, res) => {
    try {
        await legoData.addSet(req.body);
        res.redirect('/lego/sets');
    } catch (err) {
        res.status(500).render("500", { message: err });
    }
});

// Delete a Lego Set
app.get("/lego/deleteSet/:set_num", async (req, res) => {
    try {
        await legoData.deleteSetByNum(req.params.set_num);
        res.redirect("/lego/sets");
    } catch (err) {
        res.status(500).render("500", { message: err });
    }
});

// Start server after DB connection
async function startServer() {
    try {
        await legoData.initialize();
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on port ${HTTP_PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err.message);
    }
}

startServer();
