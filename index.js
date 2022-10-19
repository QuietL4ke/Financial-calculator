const bigDecimal = require('js-big-decimal');

const calculator = document.getElementById('calculator');
const regex = /[\d\.]/g;
const result = document.getElementById('form-result');

result.textContent = 0;

function doOperation(number1, number2, operation, precision) {
    let number;
    switch (operation) {
        case '+':
            number = roundOperation(number1.add(number2), precision);
            break;
        case '-':
            number = roundOperation(number1.add(number2.negate()), precision);
            break;
        case '*':
            number = roundOperation(number1.multiply(number2), precision);
            break;
        case '/':
            number = roundOperation(number1.divide(number2), precision);
            break;
    }
    return number;
}

function formatOperationNumber(number) {
    number = number.value;
    if (number.indexOf('.') != -1) {
        number = number.substring(0, number.split('').findLastIndex(e => e !== '0') + 1);
        if (number == '') {
            number = '0';
        }
        if (number.charAt(number.length - 1) == '.') {
            number = number.substring(0, number.length - 1);
        }
    }
    return formatNumber(number);
}

function roundOperation(number, precision, roundingModeInt) {
    let roundingMode = bigDecimal.RoundingModes.HALF_UP
    if (roundingModeInt) {
        if (roundingModeInt == 2) {
            roundingMode = bigDecimal.RoundingModes.HALF_EVEN;
        } else {
            if (roundingModeInt == 3) {
                const zero = new bigDecimal('0');
                if (number.compareTo(zero) == 1) {
                    return number.floor();
                } else {
                    return number.ceil();
                }
            }
        }
    }
    const sign = number.value.charAt(0);
    number = number.round(precision, roundingMode);
    if (sign == '+' || sign == '-') {
        let sign2 = number.value.charAt(0);
        if (sign == '-' && sign2 != '-') {
            number = number.negate();
        }
    }
    return number;
}

function doGlobalOperation() {
    try {
        const number1 = new bigDecimal(document.getElementById('number1').value.split('').filter(el => el !== ' ').join(''));
        const number2 = new bigDecimal(document.getElementById('number2').value.split('').filter(el => el !== ' ').join(''));
        const number3 = new bigDecimal(document.getElementById('number3').value.split('').filter(el => el !== ' ').join(''));
        const number4 = new bigDecimal(document.getElementById('number4').value.split('').filter(el => el !== ' ').join(''));

        const operation1 = document.getElementById('operation1').value;
        const operation2 = document.getElementById('operation2').value;
        const operation3 = document.getElementById('operation3').value;

        const roundingModeInt = document.getElementById('rounding').value;

        const op23 = doOperation(number2, number3, operation2, 10);

        let res;
        if (operation1 == '*' || operation1 == '/') {
            const op13 = doOperation(number1, op23, operation1, 10);
            res = doOperation(op13, number4, operation3, 10);
        } else {
            const op24 = doOperation(op23, number4, operation3, 10);
            res = doOperation(number1, op24, operation1, 10);
        }
        if (roundingModeInt != 4) res = roundOperation(res, 0, roundingModeInt);
        else res = roundOperation(res, 6, roundingModeInt)
        result.textContent = formatOperationNumber(res);
    } catch (e) {
        result.textContent = e.message;
        console.log(e);
    }
}

function formatNumber(value, e) {
    let sign = '';
    if (value.charAt(0) == '+' || value.charAt(0) == '-') {
        sign = value.charAt(0);
    }
    if (e && (e.data === '.' || e.data === ',')) {
        value = value.replace(',', '.');
        if (value.indexOf('.') != value.lastIndexOf('.')) {
            value = value.replace('.', '');
        }
    }
    value = value.split('').filter(letter => letter.match(regex) != null).join('');
    let i = value.indexOf('.') != -1 ? value.indexOf('.') - 1 : value.length - 1;
    while (true) {
        if (i - 2 <= 0) {
            break;
        }
        value = value.substring(0, i - 2) + ' ' + value.substring(i - 2, value.length);
        i = i - 3;
    }
    return sign + value;
}

for (const input of calculator.getElementsByTagName('input')) {
    input.addEventListener('input', function (e) {
        input.value = formatNumber(input.value, e);
        doGlobalOperation();
    });
}


for (const select of calculator.getElementsByTagName('select')) {
    select.addEventListener('change', function (e) {
        doGlobalOperation();
    })
}