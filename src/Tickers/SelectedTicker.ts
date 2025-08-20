// AppState.ts

class SelectedTickerAppState {
    private static _instance: SelectedTickerAppState;

    static get instance() {
        return (this._instance ??= new SelectedTickerAppState());
    }
    private constructor() { }

    private _selectedTicker?: Ticker;
    private _selectedConversion?: Ticker;

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

    setSelectedTicker(v: Ticker | undefined) { this.selectedTicker = v; }
    getSelectedTicker() { return this.selectedTicker; }
    setSelectedConversionTicker(v: Ticker | undefined) { this._selectedConversion = v; }
    getSelectedConversionTicker() { return this._selectedConversion; }
}

export const SelectedTicker = SelectedTickerAppState.instance;