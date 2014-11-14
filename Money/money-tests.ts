declare var Source: any;

function typingTest() {

    Money.setCulture('fr-FR');

    var money = new Money(99, 'EUR');

    return {
        regularFormat: money.toString(),
        shortFormat: money.toString(true),
        amountFormat: money.toString(false, '<b>{0}</b>'),
        symbolFormat: money.toString(false, '', '<b>{0}</b>'),
        shortAmountFormat: money.toString(true, '<b>{0}</b>'),
        shortSymbolFormat: money.toString(true, null, '<b>{0}</b>'),
    }
}

function formattingTest() {

    Money.setCulture('fr-FR');

    var money = new Money(99, 'EUR');
    var moneySource = new Source.Money(99, 'EUR');

    return {
        regularFormatEqual: money.toString() === moneySource.toString(),
        shortFormatEqual: money.toString(true) === moneySource.toString('{0:s}'),
        amountFormatEqual: money.toString(false, '<b>{0}</b>') === moneySource.toString('<b>{0}</b>'),
        symbolFormatEqual: money.toString(false, '', '<b>{0}</b>') === moneySource.toString(null, '<b>{0}</b>'),
        shortAmountFormatEqual: money.toString(true, '<b>{0}</b>') === moneySource.toString('<b>{0:s}</b>'),
        shortSymbolFormatEqual: money.toString(true, null, '<b>{0}</b>') === moneySource.toString('{0:s}', '<b>{0}</b>'),
    }
}

window.onload = () => {
    document.getElementById('typing-test').innerText = JSON.stringify(typingTest());
    document.getElementById('formatting-test').innerText = JSON.stringify(formattingTest());
}

console.log(typingTest());
console.log(formattingTest());