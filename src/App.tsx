import { useState } from 'react'
import './App.css'
import TickersSelectList from './Components/TickersSelectList.tsx'
import Visualizer from './Components/Visualizer.tsx'
import { UriProvider } from './UriProvider/UriProvider.ts'

function App() {
  const [selectedTicker, setSelectedTicker] = useState<Ticker>()
  const [currencyConversionRates, setCurrencyConversionRates] = useState<CurrencyConversion>()

  function onTickerSelected(ticker: Ticker) {
    fetch(UriProvider.getCurrencyConversion(ticker.tickerName))
      .then(response => response.json())
      .then(data => setCurrencyConversionRates(data))

    setSelectedTicker(ticker);
  }

  return (
    <>
      <div>
        <h3>Select a currency</h3>
        <TickersSelectList onChange={onTickerSelected} />
        <pre>{JSON.stringify(selectedTicker)}</pre>
        <Visualizer currencyConversionRates={currencyConversionRates} />
      </div>
    </>
  )
}

export default App
