declare global {

    type CurrencyConversion = {
        date: string;
        [baseCurrency: string]: CurrencyRates | string;
    }

    type CurrencyRates = {
        [tickerName: string]: number;
    };

    type BarData = {
        x: number;
        y: number;
        height: number;
        label: string;
    };
}