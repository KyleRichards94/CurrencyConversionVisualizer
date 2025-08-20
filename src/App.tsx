import { useState } from 'react'
import './App.css'
import TickersSelectList from './Components/TickersSelectList.tsx'
import Visualizer from './Components/Visualizer.tsx'
import { UriProvider } from './UriProvider/UriProvider.ts'
import { SelectedTicker } from "./Tickers/SelectedTicker";
import NavBar from './Components/NavBar.tsx'

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [currencyConversionRates, setCurrencyConversionRates] = useState<CurrencyConversion | undefined>()
  const [conversionAmount, setConversionAmount] = useState<number | undefined>();
  const [conversionFactor, setConversionFactor] = useState<number>();

  function onTickerSelected(ticker: Ticker) {
    fetch(UriProvider.getCurrencyConversion(ticker.tickerName))
      .then(response => response.json())
      .then(data => setCurrencyConversionRates(data))

    SelectedTicker.setSelectedTicker(ticker);
  }

  function onConversionSelected(ticker: Ticker) {
    if (currencyConversionRates) {
      const [_base] = Object.keys(currencyConversionRates).filter(k => k !== "date");
      const _pairs = Object.entries(currencyConversionRates[_base]);
      const _conversionFactor = _pairs.find(([k]) => k === ticker.tickerName)
      SelectedTicker.setSelectedConversionTicker(ticker);
      setConversionFactor(_conversionFactor?.[1])
    }
  }

  function tryConvert(): number {
    if (conversionFactor && conversionAmount)
      return conversionFactor * conversionAmount

    return 0
  }
  return (
    <div className="container justify-content-center align-items-center ">
      <NavBar />
      <div className="row">

        <div className="col-md-3">
          <h3>Convert</h3>
        </div>

        <div className="col-md-9">
          <TickersSelectList onChange={onTickerSelected} />
        </div>

      </div>

      <div className="row">

        <div className="col-md-3">
          <h3>To</h3>
        </div>

        <div className="col-md-9">
          <TickersSelectList onChange={onConversionSelected} />
        </div>

      </div>

      <div className="row">

        <div className="col-md-3">
          <h3>Amount</h3>
        </div>

        <div className="col-md-9">
          <div className="input-group mb-3">
            <input onChange={e => setConversionAmount(Number(e.target.value))} type="number" className="form-control" aria-label="Amount" />
            <div className="input-group-append">
              <span className="input-group-text">{SelectedTicker.getSelectedTicker()?.tickerName ?? "$"}</span>
            </div>
          </div>
        </div>

      </div>

      <h5>Conversion Rate : {conversionFactor}</h5>
      <h5>{tryConvert().toFixed(2)} {SelectedTicker.getSelectedConversionTicker()?.tickerName}</h5>
      <hr></hr>
      <Visualizer currencyConversionRates={currencyConversionRates} />
    </div>
  )
}

export default App
