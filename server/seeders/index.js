const Car = require('../models/Car');
const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const log = require('../utils/log');
const { mongoUrl, mongoAtlas } = require('../config');

let connectionInstance;
const dctimeout = 5000;
async function seeder() {
  try {
    const carPath = path.join(__dirname, 'MasterCar.csv');
    const masterCarCsv = fs.readFileSync(carPath, 'utf8');
    const carRaw = await Papa.parse(masterCarCsv, { header: true });
    const carDataJson = carRaw.data;
    
    const CreatePromises = [];

    log(`Connecting db ${mongoAtlas ? 'MONGOATLAS' : 'localhost'} for seeding process...`);
    const connection = await mongoose.connect(mongoAtlas || mongoUrl, {useNewUrlParser:true})
    connectionInstance = connection;
    log('Db connected while seeding process');

    carDataJson.forEach(el => {
      CreatePromises.push(Car.create(el))
    })

    const info = await Promise.all(CreatePromises);
    log(`${info.length} data successfully seeded`);
    log('Disconnecting db after seeding process...');
  } catch (err) {
    if (err.code === 'MissingQuotes' || err.code === 'UndetectableDelimiter') {
      log('Error while parsing the csv');
    } else {
      log(err);
    }
  }
}

async function disconnectDB() {
  try {
    await connectionInstance.disconnect();
    log('Db successfully disconnected after seeding process');
  } catch (err) {
    log('Error disconnecting the database');
  }
}

async function main() {
  await seeder();
  setTimeout(() => {
    disconnectDB();
  }, dctimeout);
}

main();
