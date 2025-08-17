declare global {

    type CurrencyConversion = {
        date: string;
        [baseCurrency: string]: CurrencyRates | string;
    }

    type CurrencyRates = {
        [tickerName: string]: number;
    };

    type BarData = {
        lat: number;
        long: number;
        height: number;
        label: string;
        sphereRadius: number;
    };
}