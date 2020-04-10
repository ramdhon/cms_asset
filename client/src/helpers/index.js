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

function formatCurrency(input, decimal = '.', thousands = ',') {
  let number = input.split(thousands).join('');
  number = decimal !== '.' ? number.split(decimal).join('.') : number;

  return number;
}

function currencyInput(input, decimal = '.', thousands = ',') {
  console.log({input})
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

module.exports = { formatNumber, formatCurrency, currencyInput };