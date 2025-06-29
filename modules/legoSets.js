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

const setData = require("../data/setData");
const themeData = require("../data/themeData");

class LegoData {
  constructor() {
    this.sets = [];
  }

  initialize() {
    return new Promise((resolve, reject) => {
      try {
        this.sets = [];

        setData.forEach((set) => {
          const foundtheme = themeData.find((theme) => theme.id === set.theme_id);

          const setWithTheme = {
            ...set,
            theme: foundtheme ? foundtheme.name : "Unknown"
          };

          this.sets.push(setWithTheme);
        });

        resolve();
      } catch (err) {
        reject("Failed to initialize data: " + err);
      }
    });
  }

  getAllSets() {
    return new Promise((resolve, reject) => {
      if (this.sets.length === 0) {
        reject("sets not available.");
      } else {
        resolve(this.sets);
      }
    });
  }

  getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      const foundSet = this.sets.find((set) => set.set_num === setNum);

      if (foundSet) {
        resolve(foundSet);
      } else {
        reject("Set not found: " + setNum);
      }
    });
  }

  getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
      const filteredSets = this.sets.filter((set) =>
        set.theme.toLowerCase().includes(theme.toLowerCase())
      );

      if (filteredSets.length > 0) {
        resolve(filteredSets);
      } else {
        reject(`No sets found with theme including: '${theme}'`);
      }
    });
  }
}

module.exports = LegoData;
