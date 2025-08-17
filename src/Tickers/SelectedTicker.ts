// AppState.ts

class SelectedTickerAppState {
    private static _instance: SelectedTickerAppState;
    static get instance() {
        return (this._instance ??= new SelectedTickerAppState());
    }
    private constructor() { }

    private _selectedTicker?: Ticker;

    get selectedTicker() {
        return this._selectedTicker;
    }
    set selectedTicker(v: Ticker | undefined) {
        this._selectedTicker = v;
    }

    setSelectedTicker(v: Ticker | undefined) { this.selectedTicker = v; }
    getSelectedTicker() { return this.selectedTicker; }
}

export const SelectedTicker = SelectedTickerAppState.instance;