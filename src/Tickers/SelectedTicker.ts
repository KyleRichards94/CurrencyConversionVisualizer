// AppState.ts

class AppState {
    private static _instance: AppState;
    static get instance() {
        return (this._instance ??= new AppState());
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

export const SelectedTicker = AppState.instance;