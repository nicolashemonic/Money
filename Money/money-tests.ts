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

console.log(typingTest());