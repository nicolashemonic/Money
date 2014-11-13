class Money {

    constructor(amount, currency) {
        this.amount = amount;
        this.currency = currency;

        if (!Money.culture) {
            Money.setCulture(document.documentElement.lang);
        }
    }

    private amount: number;
    private currency: string;
    private static culture: Culture;

    public toString(amountFormat: string, symbolFormat: string) {
        var symbol = this.currency == Money.culture.isoCode ? Money.culture.symbol : this.currency;
        var decimalCount = Money.currencies[this.currency];
        var format = this.amount >= 0 ? Money.currencyPositiveFormats[Money.culture.positiveFormat] : Money.currencyNegativeFormats[Money.culture.negativeFormat];
        var shortFormat = amountFormat != null && amountFormat.indexOf('{0:s}') >= 0;

        amountFormat = amountFormat != null ? amountFormat.replace('{0:s}', '{0}') : null;

        var fmt = (str, format) => {
            return format == null ? str : format.replace('{0}', str);
        };

        var result = [];
        var amountStr = [];

        for (var i = 0; i < format.length; i++) {
            var c = format.charAt(i);
            switch (c) {
                case "$":
                    if (amountStr.length > 0) {
                        result.push(fmt(amountStr.join(""), amountFormat));
                        amountStr = [];
                    }
                    result.push(fmt(symbol, symbolFormat));
                    break;
                case "n":
                    amountStr.push(this.writeAmount(Math.abs(this.amount), decimalCount, shortFormat));
                    break;
                case "-":
                    amountStr.push(Money.culture.negativeSign);
                    break;
                case "(":
                case ")":
                    amountStr.push(c);
                    break;
                default:
                    if (amountStr.length != 0)
                        amountStr.push(c);
                    else
                        result.push(c);
                    break;
            }
        }
        if (amountStr.length > 0) {
            result.push(fmt(amountStr.join(""), amountFormat));
            amountStr = [];
        }

        return result.join("");
    }

    private writeAmount(amount: number, decimalCount: number, shortFormat: boolean) {
        amount = this.roundAmount(amount, decimalCount);

        var value = Math.floor(amount);
        var decimals = Math.round((amount - value) * Math.pow(10, decimalCount));
        var result = [];
        var zero = Money.culture.zero.charCodeAt(0);
        var groupSizes = Money.culture.groupSizes;
        var groupSeparator = Money.culture.groupSeparator;
        var groupIndex = 0;
        var groupSize = groupSizes[groupIndex];

        if (decimals != 0 || !shortFormat) {

            for (var i = 0; i < decimalCount; i++) {
                var d = decimals % 10;
                result.unshift(String.fromCharCode(zero + d));
                decimals -= d;
                decimals /= 10;
            }
            if (decimalCount != 0)
                result.unshift(Money.culture.decimalSeparator);
        }

        if (value == 0)
            result.unshift(String.fromCharCode(zero));
        else {
            while (value >= 1) {
                if (groupSize == 0) {
                    result.unshift(groupSeparator);
                    if (groupIndex < groupSizes.length - 1)
                        groupIndex++;
                    groupSize = groupSizes[groupIndex];
                    if (groupSize == 0)
                        groupSize = -1; // disable group management
                }

                var d = value % 10;
                result.unshift(String.fromCharCode(zero + d));
                value -= d;
                if (groupSize > 0)
                    groupSize--;

                value = value / 10;
            }
        }

        return result.join("");
    }

    private roundAmount(amount: number, digitCount: number) {
        var precision = Math.pow(10, digitCount);
        return Math.round(amount * precision) / precision;
    }

    private static valueAt(culture: string, index: number, value: any) {
        return culture.length > index ? culture[index] : value;
    }

    public static setCulture(name: string = 'en-US') {
        var culture = Culture.cultures[name.replace('-', '')];

        if (!culture) {
            culture = Culture.cultures['enUS'];
        }

        Money.culture = new Culture(
            culture[0],
            culture[1],
            Money.valueAt(culture, 2, "-"),
            Money.valueAt(culture, 3, 3),
            Money.valueAt(culture, 4, 8),
            Money.valueAt(culture, 5, "."),
            Money.valueAt(culture, 6, ","),
            Money.valueAt(culture, 7, "0"),
            Money.valueAt(culture, 8, [3])
        );
    }

    //#region currencyPositiveFormats

    private static currencyPositiveFormats = ["$n", "n$", "$ n", "n $"];

    //#endregion

    //#region currencyNegativeFormats

    private static currencyNegativeFormats = ["($n)", "-$n", "$-n", "$n-", "(n$)", "-n$", "n-$", "n$-", "-n $", "-$ n", "n $-", "$ n-", "$ -n", "n- $", "($ n)", "(n $)"];

    //#endregion

    //#region currencies

    private static currencies = {
        'AED': 2,
        'AFN': 2,
        'ALL': 2,
        'AMD': 2,
        'ANG': 2,
        'AOA': 2,
        'ARS': 2,
        'AUD': 2,
        'AWG': 2,
        'AZN': 2,
        'BAM': 2,
        'BBD': 2,
        'BDT': 2,
        'BGN': 2,
        'BHD': 3,
        'BIF': 0,
        'BMD': 2,
        'BND': 2,
        'BOB': 2,
        'BOV': 2,
        'BRL': 2,
        'BSD': 2,
        'BTN': 2,
        'BWP': 2,
        'BYR': 0,
        'BZD': 2,
        'CAD': 2,
        'CDF': 2,
        'CHE': 2,
        'CHF': 2,
        'CHW': 2,
        'CLF': 0,
        'CLP': 0,
        'CNY': 2,
        'COP': 2,
        'COU': 2,
        'CRC': 2,
        'CUP': 2,
        'CVE': 2,
        'CZK': 2,
        'DJF': 0,
        'DKK': 2,
        'DOP': 2,
        'DZD': 2,
        'EEK': 2,
        'EGP': 2,
        'ERN': 2,
        'ETB': 2,
        'EUR': 2,
        'FJD': 2,
        'FKP': 2,
        'GBP': 2,
        'GEL': 2,
        'GHS': 2,
        'GIP': 2,
        'GMD': 2,
        'GNF': 0,
        'GTQ': 2,
        'GYD': 2,
        'HKD': 2,
        'HNL': 2,
        'HRK': 2,
        'HTG': 2,
        'HUF': 2,
        'IDR': 2,
        'ILS': 2,
        'INR': 2,
        'IQD': 3,
        'IRR': 2,
        'ISK': 0,
        'JMD': 2,
        'JOD': 3,
        'JPY': 0,
        'KES': 2,
        'KGS': 2,
        'KHR': 2,
        'KMF': 0,
        'KPW': 2,
        'KRW': 0,
        'KWD': 3,
        'KYD': 2,
        'KZT': 2,
        'LAK': 2,
        'LBP': 2,
        'LKR': 2,
        'LRD': 2,
        'LSL': 2,
        'LTL': 2,
        'LVL': 2,
        'LYD': 3,
        'MAD': 2,
        'MDL': 2,
        'MGA': 0,
        'MKD': 2,
        'MMK': 2,
        'MNT': 2,
        'MOP': 2,
        'MRO': 0,
        'MUR': 2,
        'MVR': 2,
        'MWK': 2,
        'MXN': 2,
        'MYR': 2,
        'MZN': 2,
        'NAD': 2,
        'NGN': 2,
        'NIO': 2,
        'NOK': 2,
        'NPR': 2,
        'NZD': 2,
        'OMR': 3,
        'PAB': 2,
        'PEN': 2,
        'PGK': 2,
        'PHP': 2,
        'PKR': 2,
        'PLN': 2,
        'PYG': 0,
        'QAR': 2,
        'RON': 2,
        'RSD': 2,
        'RUB': 2,
        'RWF': 0,
        'SAR': 2,
        'SBD': 2,
        'SCR': 2,
        'SDG': 2,
        'SEK': 2,
        'SGD': 2,
        'SHP': 2,
        'SLL': 2,
        'SOS': 2,
        'SRD': 2,
        'STD': 2,
        'SYP': 2,
        'SZL': 2,
        'THB': 2,
        'TJS': 2,
        'TND': 3,
        'OP': 2,
        'TRY': 2,
        'TTD': 2,
        'TWD': 2,
        'TZS': 2,
        'UAH': 2,
        'UGX': 2,
        'USD': 2,
        'UYU': 2,
        'UZS': 2,
        'VEF': 2,
        'VND': 2,
        'VUV': 0,
        'WST': 2,
        'XAF': 0,
        'XOF': 0,
        'XPF': 0,
        'YER': 2,
        'ZAR': 2,
        'ZMK': 2,
        'ZWD': 2
    };

    //#endregion

}

class Culture {

    constructor(isoCode, symbol, negativeSign, positiveFormat, negativeFormat, decimalSeparator, groupSeparator, zero, groupSizes) {
        this.isoCode = isoCode;
        this.symbol = symbol;
        this.positiveFormat = positiveFormat;
        this.negativeFormat = negativeFormat;
        this.negativeSign = negativeSign;
        this.decimalSeparator = decimalSeparator;
        this.groupSeparator = groupSeparator;
        this.zero = zero;
        this.groupSizes = groupSizes;
    }

    public isoCode: string;
    public symbol: string;
    public positiveFormat: string;
    public negativeFormat: number;
    public negativeSign: number;
    public decimalSeparator: string;
    public groupSeparator: string;
    public zero: string;
    public groupSizes: number[];

    //#region cultures

    public static cultures = {
        'arSA': ['SAR', 'ر.س.\u200f', '-', 2, 3, '.', ',', '٠'],
        'bgBG': ['BGL', 'лв', '-', 3, 8, ',', ' '],
        'caES': ['EUR', '\u20ac'],
        'zhTW': ['TWD', 'NT$', '-', 0, 1, '.'],
        'csCZ': ['CZK', 'Kč', '-', 3, 8, ',', ' '],
        'daDK': ['DKK', 'kr', '-', 2, 12],
        'deDE': ['EUR', '\u20ac'],
        'elGR': ['EUR', '\u20ac'],
        'enUS': ['USD', '$', '-', 0, 0, '.'],
        'fiFI': ['EUR', '\u20ac', '-', 3, 8, ',', ' '],
        'frFR': ['EUR', '\u20ac', '-', 3, 8, ',', ' '],
        'heIL': ['ILS', '\u20aa', '-', 2, 2, '.'],
        'huHU': ['HUF', 'Ft', '-', 3, 8, ',', ' '],
        'isIS': ['ISK', 'kr.'],
        'itIT': ['EUR', '\u20ac', '-', 2, 9],
        'jaJP': ['JPY', '¥', '-', 0, 1, '.'],
        'koKR': ['KRW', '\u20a9', '-', 0, 1, '.'],
        'nlNL': ['EUR', '\u20ac', '-', 2, 12],
        'nbNO': ['NOK', 'kr', '-', 2, 12, ',', ' '],
        'plPL': ['PLN', 'zł', '-', 3, 8, ',', ' '],
        'ptBR': ['BRL', 'R$', '-', 2, 9],
        'roRO': ['ROL', 'lei'],
        'ruRU': ['RUR', 'р.', '-', 1, 5, ',', ' '],
        'hrHR': ['HRK', 'kn'],
        'skSK': ['EUR', '\u20ac', '-', 3, 8, ',', ' '],
        'sqAL': ['ALL', 'Lek', '-', 1, 5],
        'svSE': ['SEK', 'kr'],
        'thTH': ['THB', '฿', '-', 0, 1, '.', ',', '๐'],
        'trTR': ['TRY', 'TL'],
        'urPK': ['PKR', 'Rs', '-', 0, 3, '.', ',', '۰'],
        'idID': ['IDR', 'Rp', '-', 0, 0],
        'ukUA': ['UAH', 'грн.', '-', 3, 8, ',', ' '],
        'beBY': ['BYB', 'р.', '-', 3, 8, ',', ' '],
        'slSI': ['EUR', '\u20ac'],
        'etEE': ['EEK', 'kr', '-', 3, 8, '.', ' '],
        'lvLV': ['LVL', 'Ls', '-', 2, 9, ',', ' '],
        'ltLT': ['LTL', 'Lt'],
        'faIR': ['IRR', 'ريال', '-', 2, 3, '/', ',', '۰'],
        'viVN': ['VND', '\u20ab'],
        'hyAM': ['AMD', 'դր.', '-', 3, 8, '.'],
        'azLatnAZ': ['AZM', 'man.', '-', 3, 8, ',', ' '],
        'euES': ['EUR', '\u20ac'],
        'mkMK': ['MKD', 'ден.'],
        'afZA': ['ZAR', 'R', '-', 2, 2, '.'],
        'kaGE': ['GEL', 'Lari', '-', 3, 8, ',', ' '],
        'foFO': ['DKK', 'kr', '-', 2, 12],
        'hiIN': ['INR', 'रु', '-', 2, 12, '.', ',', '0', [3, 2]],
        'msMY': ['MYR', 'R', '-', 0, 0],
        'kkKZ': ['KZT', 'Т', '-', 0, 1, '-', ' '],
        'kyKG': ['KGS', 'сом', '-', 3, 8, '-', ' '],
        'swKE': ['KES', 'S', '-', 0, 0, '.'],
        'uzLatnUZ': ['UZS', 'su\'m', '-', 3, 8, ',', ' '],
        'ttRU': ['RUR', 'р.', '-', 3, 8, ',', ' '],
        'paIN': ['INR', 'ਰੁ', '-', 2, 12, '.', ',', '੦', [3, 2]],
        'guIN': ['INR', 'રૂ', '-', 2, 12, '.', ',', '૦', [3, 2]],
        'taIN': ['INR', 'ரூ', '-', 2, 12, '.', ',', '௦', [3, 2]],
        'teIN': ['INR', 'రూ', '-', 2, 12, '.', ',', '౦', [3, 2]],
        'knIN': ['INR', 'ರೂ', '-', 2, 12, '.', ',', '೦', [3, 2]],
        'mrIN': ['INR', 'रु', '-', 2, 12, '.', ',', '०', [3, 2]],
        'saIN': ['INR', 'रु', '-', 2, 12, '.', ',', '०', [3, 2]],
        'mnMN': ['MNT', '\u20ae', '-', 1, 5, ',', ' '],
        'glES': ['EUR', '\u20ac'],
        'kokIN': ['INR', 'रु', '-', 2, 12, '.', ',', '०', [3, 2]],
        'syrSY': ['SYP', 'ل.س.\u200f', '-', 2, 3, '.'],
        'dvMV': ['MVR', 'ރ.', '-', 3, 10, '.'],
        'arIQ': ['IQD', 'د.ع.\u200f', '-', 2, 3, '.', ',', '٠'],
        'zhCN': ['CNY', '\uffe5', '-', 0, 2, '.'],
        'deCH': ['CHF', 'SFr.', '-', 2, 2, '.', '\''],
        'enGB': ['GBP', '£', '-', 0, 1, '.'],
        'esMX': ['MXN', '$', '-', 0, 1, '.'],
        'frBE': ['EUR', '\u20ac', '-', 2, 12],
        'itCH': ['CHF', 'SFr.', '-', 2, 2, '.', '\''],
        'nlBE': ['EUR', '\u20ac', '-', 2, 12],
        'nnNO': ['NOK', 'kr', '-', 2, 12, ',', ' '],
        'ptPT': ['EUR', '\u20ac'],
        'srLatnCS': ['CSD', 'Din.'],
        'svFI': ['EUR', '\u20ac', '-', 3, 8, ',', ' '],
        'azCyrlAZ': ['AZM', 'ман.', '-', 3, 8, ',', ' '],
        'msBN': ['BND', '$', '-', 0, 0],
        'uzCyrlUZ': ['UZS', 'сўм', '-', 3, 8, ',', ' '],
        'arEG': ['EGP', 'ج.م.\u200f', '-', 2, 3, '.', ',', '٠'],
        'zhHK': ['HKD', 'HK$', '-', 0, 0, '.'],
        'deAT': ['EUR', '\u20ac', '-', 2, 9],
        'enAU': ['AUD', '$', '-', 0, 1, '.'],
        'esES': ['EUR', '\u20ac'],
        'frCA': ['CAD', '$', '-', 3, 15, ',', ' '],
        'srCyrlCS': ['CSD', 'Дин.'],
        'arLY': ['LYD', 'د.ل.\u200f', '-', 2, 3, '.'],
        'zhSG': ['SGD', '$', '-', 0, 0, '.'],
        'deLU': ['EUR', '\u20ac'],
        'enCA': ['CAD', '$', '-', 0, 1, '.'],
        'esGT': ['GTQ', 'Q', '-', 0, 0, '.'],
        'frCH': ['CHF', 'SFr.', '-', 2, 2, '.', '\''],
        'arDZ': ['DZD', 'د.ج.\u200f', '-', 2, 3, '.'],
        'zhMO': ['MOP', 'MOP', '-', 0, 0, '.'],
        'deLI': ['CHF', 'CHF', '-', 2, 2, '.', '\''],
        'enNZ': ['NZD', '$', '-', 0, 1, '.'],
        'esCR': ['CRC', '\u20a1', '-', 0, 0],
        'frLU': ['EUR', '\u20ac', '-', 3, 8, ',', ' '],
        'arMA': ['MAD', 'د.م.\u200f', '-', 2, 3, '.'],
        'enIE': ['EUR', '\u20ac', '-', 0, 1, '.'],
        'esPA': ['PAB', 'B/.', '-', 2, 14, '.'],
        'frMC': ['EUR', '\u20ac', '-', 3, 8, ',', ' '],
        'arTN': ['TND', 'د.ت.\u200f', '-', 2, 3, '.'],
        'enZA': ['ZAR', 'R', '-', 2, 2, '.'],
        'esDO': ['DOP', 'RD$', '-', 0, 0, '.'],
        'arOM': ['OMR', 'ر.ع.\u200f', '-', 2, 3, '.', ',', '٠'],
        'enJM': ['JMD', 'J$', '-', 0, 1, '.'],
        'esVE': ['VEB', 'Bs', '-', 2, 12],
        'arYE': ['YER', 'ر.ي.\u200f', '-', 2, 3, '.', ',', '٠'],
        'en029': ['USD', '$', '-', 0, 1, '.'],
        'esCO': ['COP', '$', '-', 2, 14],
        'arSY': ['SYP', 'ل.س.\u200f', '-', 2, 3, '.', ',', '٠'],
        'enBZ': ['BZD', 'BZ$', '-', 0, 0, '.', ',', '0', [3, 0]],
        'esPE': ['PEN', 'S/.', '-', 2, 12, '.'],
        'arJO': ['JOD', 'د.ا.\u200f', '-', 2, 3, '.', ',', '٠'],
        'enTT': ['TTD', 'TT$', '-', 0, 0, '.', ',', '0', [3, 0]],
        'esAR': ['ARS', '$', '-', 2, 2],
        'arLB': ['LBP', 'ل.ل.\u200f', '-', 2, 3, '.', ',', '٠'],
        'enZW': ['ZWD', 'Z$', '-', 0, 0, '.'],
        'esEC': ['USD', '$', '-', 2, 14],
        'arKW': ['KWD', 'د.ك.\u200f', '-', 2, 3, '.', ',', '٠'],
        'enPH': ['PHP', 'Php', '-', 0, 0, '.'],
        'esCL': ['CLP', '$', '-', 2, 9],
        'arAE': ['AED', 'د.إ.\u200f', '-', 2, 3, '.', ',', '٠'],
        'esUY': ['UYU', '$U', '-', 2, 14],
        'arBH': ['BHD', 'د.ب.\u200f', '-', 2, 3, '.', ',', '٠'],
        'esPY': ['PYG', 'Gs', '-', 2, 14],
        'arQA': ['QAR', 'ر.ق.\u200f', '-', 2, 3, '.', ',', '٠'],
        'esBO': ['BOB', '$b', '-', 2, 14],
        'esSV': ['USD', '$', '-', 0, 0, '.', ',', '0', [3, 0]],
        'esHN': ['HNL', 'L.', '-', 2, 12, '.', ',', '0', [3, 0]],
        'esNI': ['NIO', 'C$', '-', 2, 14, '.', ',', '0', [3, 0]],
        'esPR': ['USD', '$', '-', 2, 14, '.', ',', '0', [3, 0]],
        'amET': ['ETB', 'ETB', '-', 0, 1, '.', ',', '0', [3, 0]],
        'tzmLatnDZ': ['DZD', 'DZD', '-', 3, 8, '.'],
        'iuLatnCA': ['CAD', '$', '-', 0, 0, '.'],
        'smaNO': ['NOK', 'kr', '-', 2, 12, ',', ' '],
        'mnMongCN': ['CNY', '¥', '-', 0, 2, '.', ',', '0', [3, 0]],
        'gdGB': ['GBP', '£', '-', 0, 1, '.'],
        'enMY': ['MYR', 'RM', '-', 0, 0, '.'],
        'prsAF': ['AFN', '؋', '-', 0, 3, '.', ',', '٠'],
        'bnBD': ['BDT', '৳', '-', 2, 12, '.', ',', '০', [3, 2]],
        'woSN': ['XOF', 'XOF', '-', 3, 8, ',', ' '],
        'rwRW': ['RWF', 'RWF', '-', 2, 2, ',', ' '],
        'qutGT': ['GTQ', 'Q', '-', 0, 0, '.'],
        'sahRU': ['RUB', 'с.', '-', 1, 5, ',', ' '],
        'gswFR': ['EUR', '\u20ac', '-', 3, 8, ',', ' '],
        'coFR': ['EUR', '\u20ac', '-', 3, 8, ',', ' '],
        'ocFR': ['EUR', '\u20ac', '-', 3, 8, ',', ' '],
        'miNZ': ['NZD', '$', '-', 0, 1, '.'],
        'gaIE': ['EUR', '\u20ac', '-', 0, 1, '.'],
        'seSE': ['SEK', 'kr'],
        'brFR': ['EUR', '\u20ac', '-', 3, 8, ',', ' '],
        'smnFI': ['EUR', '\u20ac', '-', 3, 8, ',', ' '],
        'mohCA': ['CAD', '$', '-', 0, 0, '.'],
        'arnCL': ['CLP', '$', '-', 2, 9],
        'iiCN': ['CNY', '¥', '-', 0, 2, '.'],
        'dsbDE': ['EUR', '\u20ac'],
        'igNG': ['NIO', 'N', '-', 2, 2, '.'],
        'klGL': ['DKK', 'kr.', '-', 2, 12, ',', '.', '0', [3, 0]],
        'lbLU': ['EUR', '\u20ac', '-', 3, 8, ',', ' '],
        'baRU': ['RUB', 'һ.', '-', 3, 8, ',', ' ', '0', [3, 0]],
        'nsoZA': ['ZAR', 'R', '-', 2, 2, '.'],
        'quzBO': ['BOB', '$b', '-', 2, 14],
        'yoNG': ['NIO', 'N', '-', 2, 2, '.'],
        'haLatnNG': ['NIO', 'N', '-', 2, 2, '.'],
        'filPH': ['PHP', 'PhP', '-', 0, 0, '.'],
        'psAF': ['AFN', '؋', '-', 0, 3, '٫', '٬', '٠'],
        'fyNL': ['EUR', '\u20ac', '-', 2, 12],
        'neNP': ['NPR', 'रु', '-', 0, 1, '.', ',', '०'],
        'seNO': ['NOK', 'kr', '-', 2, 12, ',', ' '],
        'iuCansCA': ['CAD', '$', '-', 0, 0, '.', ',', '0', [3, 0]],
        'srLatnRS': ['RSD', 'Din.'],
        'siLK': ['LKR', 'රු.', '-', 2, 14, '.'],
        'srCyrlRS': ['RSD', 'Дин.'],
        'loLA': ['LAK', '\u20ad', '-', 1, 4, '.', ',', '໐', [3, 0]],
        'kmKH': ['KHR', '\u17db', '-', 1, 5, '.', ',', '០'],
        'cyGB': ['GBP', '£', '-', 0, 1, '.'],
        'boCN': ['CNY', '¥', '-', 0, 2, '.', ',', '0', [3, 0]],
        'smsFI': ['EUR', '\u20ac', '-', 3, 8, ',', ' '],
        'asIN': ['INR', 'ট', '-', 1, 12, '.', ',', '০', [3, 2]],
        'mlIN': ['INR', 'ക', '-', 2, 12, '.', ',', '൦', [3, 2]],
        'enIN': ['INR', 'Rs.', '-', 2, 12, '.', ',', '0', [3, 2]],
        'orIN': ['INR', 'ଟ', '-', 2, 12, '.', ',', '୦', [3, 2]],
        'bnIN': ['INR', 'টা', '-', 2, 12, '.', ',', '০', [3, 2]],
        'tkTM': ['TMT', 'm.', '-', 1, 5, ',', ' '],
        'bsLatnBA': ['BAM', 'KM'],
        'mtMT': ['EUR', '\u20ac', '-', 0, 1, '.'],
        'srCyrlME': ['EUR', '\u20ac'],
        'seFI': ['EUR', '\u20ac', '-', 3, 8, ',', ' '],
        'zuZA': ['ZAR', 'R', '-', 2, 2, '.'],
        'xhZA': ['ZAR', 'R', '-', 2, 2, '.'],
        'tnZA': ['ZAR', 'R', '-', 2, 2, '.'],
        'hsbDE': ['EUR', '\u20ac'],
        'bsCyrlBA': ['BAM', 'КМ'],
        'tgCyrlTJ': ['TJS', 'т.р.', '-', 3, 8, ';', ' ', '0', [3, 0]],
        'srLatnBA': ['BAM', 'KM'],
        'smjNO': ['NOK', 'kr', '-', 2, 12, ',', ' '],
        'rmCH': ['CHF', 'fr.', '-', 2, 2, '.', '\''],
        'smjSE': ['SEK', 'kr'],
        'quzEC': ['USD', '$', '-', 2, 14],
        'quzPE': ['PEN', 'S/.', '-', 2, 12, '.'],
        'hrBA': ['BAM', 'KM'],
        'srLatnME': ['EUR', '\u20ac'],
        'smaSE': ['SEK', 'kr'],
        'enSG': ['SGD', '$', '-', 0, 0, '.'],
        'ugCN': ['CNY', '¥', '-', 0, 2, '.'],
        'srCyrlBA': ['BAM', 'КМ'],
        'esUS': ['USD', '$', '-', 0, 0, '.']
    };

    //#endregion

}