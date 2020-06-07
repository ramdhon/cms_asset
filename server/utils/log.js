const moment = require('moment');
const fs = require('fs');
const path = require('path');

const Log = require('../models/Log');

function log(...args) {
  const now = new Date();
  const momentFormat = 'MMM-DD-YYYY, HH:mm:ss';

  const logDir = path.join(__dirname, './logs');
  const logFilename = moment(now).format('MMMM-DD-YYYY') + '.dat';
  const logFileDir = path.join(logDir, logFilename);

  const logFileIsExisting = fs.existsSync(logFileDir);
  let rawLogs = '';
  let logs = [];
  let delimiter = '\n';

  if (logFileIsExisting) {
    rawLogs = fs.readFileSync(logFileDir, 'utf8');
    delimiter = rawLogs.indexOf('\r\n') > -1 ? '\r\n' : rawLogs.indexOf('\r') > -1 ? '\r' : rawLogs.indexOf('\n') > -1 ? '\n' : delimiter;
    logs = rawLogs.split(delimiter);
  }

  const printoutlog = `[${moment(now).format(momentFormat)}]:\t${args.join(' ')}`;

  console.log(printoutlog);

  logs.push(printoutlog);
  fs.writeFileSync(logFileDir, logs.join(delimiter));

  Log.create({ args: printoutlog, created: new Date() })
    .then(newArgs => {
      console.log(`[${moment(new Date()).format(momentFormat)}][LOC]:\t[SUC] Saved the log.`, newArgs._id);
    })
    .catch(err => {
      const errorStatus = '[ERROR saving log on the cloud]'
      console.log(`[${moment(new Date()).format(momentFormat)}][LOC]:\t[ERR] Error saving the log.`, err);
      logs.push(printoutlog + ` ${errorStatus}`);
      fs.writeFileSync(logFileDir, logs.join(delimiter));
    })
}

module.exports = log;