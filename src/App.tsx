import { useState } from 'react'
import './App.css'
import TickersSelectList from './Components/TickersSelectList.tsx'
import Visualizer from './Components/Visualizer.tsx'
import { UriProvider } from './UriProvider/UriProvider.ts'
import { SelectedTicker } from "./Tickers/SelectedTicker";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Select } from '@react-three/drei'

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

  return (
    <>
      <div class="row">

        <div class="col-md-3">
          <h3>Convert</h3>
        </div>

        <div class="col-md-9">
          <TickersSelectList onChange={onTickerSelected} />
        </div>

      </div>

      <div class="row">

        <div class="col-md-3">
          <h3>To</h3>
        </div>

        <div class="col-md-9">
          <TickersSelectList onChange={onConversionSelected} />
        </div>

      </div>

      <div class="row">

        <div class="col-md-3">
          <h3>Amount</h3>
        </div>

        <div class="col-md-9">
          <div class="input-group mb-3">
            <input onChange={e => setConversionAmount(Number(e.target.value))} type="number" class="form-control" aria-label="Amount" />
            <div class="input-group-append">
              <span class="input-group-text">{SelectedTicker.getSelectedTicker()?.tickerName ?? "$"}</span>
            </div>
          </div>
        </div>

      </div>

      <h5>Conversion Rate : {conversionFactor}</h5>
      <h5>{(conversionFactor * conversionAmount) ? (conversionFactor * conversionAmount).toFixed(2) : 0} {SelectedTicker.getSelectedConversionTicker()?.tickerName}</h5>
      <hr></hr>
      <Visualizer currencyConversionRates={currencyConversionRates} />
    </>
  )
}

export default App
