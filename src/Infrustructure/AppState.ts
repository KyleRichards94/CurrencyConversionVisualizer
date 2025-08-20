// AppState.ts

class App {
    private static _instance: App;

    static get instance() {
        return (this._instance ??= new App());
    }
    private constructor() { }

    private _selectedTicker?: Ticker;
    private _selectedConversion?: Ticker;
    private _conversionValue: number = 0;

    get selectedTicker() {
        return this._selectedTicker;
    }
    set selectedTicker(v: Ticker | undefined) {
        this._selectedTicker = v;
    }
    get selectedConversionTicker() {
        return this._selectedConversion;
    }
    set selectedConversionTicker(v: Ticker | undefined) {
        this._selectedConversion = v;
    }

    get selectedConversionValue() {
        return this._conversionValue;
    }
    set selectedConversionValue(v: number) {
        this._conversionValue = v;
    }

    setSelectedTicker(v: Ticker | undefined) { this.selectedTicker = v; }
    getSelectedTicker() { return this.selectedTicker; }
    setSelectedConversionTicker(v: Ticker | undefined) { this._selectedConversion = v; }
    getSelectedConversionTicker() { return this._selectedConversion; }
    setConversionValue(v: number) { this._conversionValue = v; }
    getConversionValue() { return this._conversionValue; }
}

export const AppState = App.instance;