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
require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');

class LegoData {
  constructor() {
    this.sequelize = new Sequelize(
      process.env.PGDATABASE,
      process.env.PGUSER,
      process.env.PGPASSWORD,
      {
        host: process.env.PGHOST,
        dialect: 'postgres',
        port: 5432,
        dialectOptions: {
          ssl: { rejectUnauthorized: false },
        },
      }
    );

    this.Theme = this.sequelize.define('Theme', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: Sequelize.STRING,
    }, {
      timestamps: false,
    });

    this.Set = this.sequelize.define('Set', {
      set_num: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      name: Sequelize.STRING,
      year: Sequelize.INTEGER,
      num_parts: Sequelize.INTEGER,
      theme_id: Sequelize.INTEGER,
      img_url: Sequelize.STRING,
    }, {
      timestamps: false,
    });

    this.Set.belongsTo(this.Theme, { foreignKey: 'theme_id' });
  }

  initialize() {
    return this.sequelize.sync()
      .then(() => Promise.resolve())
      .catch((err) => Promise.reject("Unable to sync with the database: " + err.message));
  }

  getAllSets() {
    return this.Set.findAll({ include: [this.Theme] })
      .then(sets => Promise.resolve(sets))
      .catch(err => Promise.reject("Unable to retrieve sets: " + err.message));
  }

  getSetByNum(setNum) {
    return this.Set.findAll({
      where: { set_num: setNum },
      include: [this.Theme],
    })
      .then((sets) => {
        if (sets.length > 0) {
          return Promise.resolve(sets[0]);
        } else {
          return Promise.reject("Unable to find requested set");
        }
      })
      .catch((err) => Promise.reject("Error retrieving set: " + err.message));
  }

  getSetsByTheme(theme) {
    return this.Set.findAll({
      include: [this.Theme],
      where: {
        '$Theme.name$': {
          [Sequelize.Op.iLike]: `%${theme}%`,
        },
      },
    })
      .then((sets) => {
        if (sets.length > 0) {
          return Promise.resolve(sets);
        } else {
          return Promise.reject("Unable to find requested sets");
        }
      })
      .catch((err) => Promise.reject("Error retrieving sets by theme: " + err.message));
  }

  addSet(newSet) {
    return this.Set.create(newSet)
      .then(() => Promise.resolve())
      .catch((err) => {
        if (err.errors && err.errors.length > 0) {
          return Promise.reject(err.errors[0].message);
        } else {
          return Promise.reject(err.message);
        }
      });
  }

  deleteSetByNum(setNum) {
    return this.Set.destroy({ where: { set_num: setNum } })
      .then((deletedCount) => {
        if (deletedCount === 0) {
          return Promise.reject(`No set found with set_num '${setNum}' to delete.`);
        } else {
          return Promise.resolve();
        }
      })
      .catch((err) => {
        if (err.errors && err.errors.length > 0) {
          return Promise.reject(err.errors[0].message);
        } else {
          return Promise.reject(err.message);
        }
      });
  }

  getAllThemes() {
    return this.Theme.findAll()
      .then((themes) => Promise.resolve(themes))
      .catch((err) => Promise.reject("Unable to retrieve themes: " + err.message));
  }
}

module.exports = LegoData;
