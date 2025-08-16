const baseCurrencyConversionApiUrl = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

export const UriProvider = {
    getCurrencyConversionBaseUri(): string {
        return `${baseCurrencyConversionApiUrl}.json`;
    },
    getCurrencyConversion(ticker: string): string {
        return `${baseCurrencyConversionApiUrl}/${ticker}.json`
    },
    getCurrencyInfomation(ticker: string): string {
        return `https://restcountries.com/v3.1/currency/${ticker}`
    }
};
