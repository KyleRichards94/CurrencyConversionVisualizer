import { useEffect, useState } from "react"
import Select from 'react-select'
import { UriProvider } from "../UriProvider/UriProvider";

function TickersSelectList(props: { onChange: (selection: Ticker) => void }) {
    const [tickers, setTickers] = useState<Ticker[]>([]);

    useEffect(() => {
        fetch(UriProvider.getCurrencyConversionBaseUri())
            .then(response => response.json())
            .then(data => {
                const listTickers: Ticker[] = Object.entries(data).map(([tickerName, name]) => ({
                    tickerName,
                    name: name as string,
                    lat: 0,
                    long: 0,
                }));
                setTickers(listTickers)
            })
    }, [])

    function setSelection(option: { label: string, value: string } | null) {
        if (option) {
            const ticker = tickers.find(t => t.tickerName === option.value);
            if (ticker) {
                props.onChange(ticker);
            }
        }
    }

    if (tickers) {
        return (
            <Select options={tickers.map((option: Ticker) => ({ label: `${option.name} (${option.tickerName})`, value: option.tickerName }))}
                onChange={setSelection} />
        )
    }
}

export default TickersSelectList