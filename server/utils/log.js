const moment = require('moment');
const fs = require('fs');
const path = require('path');

function log(...args) {
  const now = new Date();
  const momentFormat = 'MMM-DD-YYYY, HH:mm:ss';

  const logDir = path.join(__dirname, '../logs');
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

  let flagObj = false;
  args.forEach(arg => {
    if (typeof arg === 'object') {
      flagObj = true;
    }
  })
  if (flagObj) {
    console.log(args);
    logs.push(JSON.stringify(args));
  }

  fs.writeFileSync(logFileDir, logs.join(delimiter));
}

module.exports = log;