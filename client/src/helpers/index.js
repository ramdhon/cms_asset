const moment = require('moment');

function formatNumber(amount, decimalCount = 2, decimal = ".", thousands = ",") {
  try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
      console.log(e)
  }
};

function printStr(input) {
  return input || '-';
}

function printStrForm(input) {
  return input || '____________________';
}

function printDate(input, withTime = true, withDay = false) {
  const date = input || new Date();
  let format = 'MMMM Do YYYY';
  format = format + (withTime ? ', h:mm:ss a' : '');
  format = (withDay ? 'dddd, ' : '') + format;

  return moment(date).format(format);
}

function printBlur(input) {
  if (!input) {
    return input;
  }

  const length = input.length > 6 ? 6 : input.length;
  const startingIndex = Math.round(Math.random() * (input.length - length));
  const endingIndex = startingIndex + length;

  return '***' + input.slice(startingIndex, endingIndex) + '***';
}

function inWords(num) {
  const kamus1 = {
    0: '',
    1: 'satu',
    2: 'dua',
    3: 'tiga',
    4: 'empat',
    5: 'lima',
    6: 'enam',
    7: 'tujuh',
    8: 'delapan',
    9: 'sembilan',
    10: 'sepuluh',
    11: 'sebelas',
    100: 'seratus',
    1000: 'seribu'
  }

  const kamus2 = [
    [1e12, 'triliun'],
    [1e9, 'milyar'],
    [1e6, 'juta'],
    [1e3, 'ribu'],
    [1e2, 'ratus'],
    [1e1, 'puluh']
  ]

  if(kamus1[num] !== undefined) {
    return kamus1[num]
  } else if(num > 11 && num < 20) {
    return kamus1[num - 10] + ' belas'
  } else {
    let kepala = kamus2.find(item => Math.floor(num / item[0]) > 0)
    let satuan = Math.floor(num / kepala[0])
    if(kepala[0] * satuan in kamus1) {
      return `${kamus1[kepala[0] * satuan]} ${inWords(num - (kepala[0] * satuan))}`
    } else {
      return `${inWords(satuan)} ${kepala[1]} ${inWords(num - (kepala[0] * satuan))}`
    }
  }
}


function formatCurrency(input, decimal = '.', thousands = ',') {
  let number = input.split(thousands).join('');
  number = decimal !== '.' ? number.split(decimal).join('.') : number;

  return number;
}

function currencyInput(input, decimal = '.', thousands = ',') {
  let output = '';
  let inputstr = String(input).split(decimal).join('');
  if (inputstr.length > 3) {
    inputstr = String(Number(inputstr));
  }
  const reversed = inputstr.split('').reverse().join('');

  if (inputstr.length <= 3) {
    if (inputstr === '0') {
      return '0.00'
    }
    let tmp = Number(reversed) * Math.pow(10, 3 - reversed.length);

    tmp = String(tmp).split('');
    tmp.splice(2, 0, decimal);

    return tmp.reverse().join('');
  }
  reversed.split('').forEach((el, id) => {
    output += el;
    if (id === 1) {
      output += decimal;
    }
    if (id !== reversed.length - 1 && id > 1 && id % 3 === 1) {
      output += thousands;
    }
  })

  return output.split('').reverse().join('');
}

module.exports = { formatNumber, formatCurrency, currencyInput, printBlur, printStr, printStrForm, printDate, inWords };