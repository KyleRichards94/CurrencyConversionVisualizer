import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import FiatList from "../Tickers/FiatTickers";
import fiatGeolocations from '../assets/fiat_geolocations.json'
import WorldScene from "./WorldScene";


function Visualizer(props: { currencyConversionRates: CurrencyConversion | undefined }) {
    const [bars, setBars] = useState<BarData[]>([])
    const worldRadius = 3;

    function latLongToSphere(lat: number, long: number) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (long + 180) * (Math.PI / 180);

        const x = -(worldRadius * Math.sin(phi) * Math.cos(theta));
        const y = worldRadius * Math.cos(phi);
        const z = worldRadius * Math.sin(phi) * Math.sin(theta);

        return { x, y, z };
    }

    useEffect(() => {
        if (props.currencyConversionRates) {
            const [conversionRatesBase] = Object.keys(props.currencyConversionRates).filter(k => k !== "date");
            const geoIndex = new Map(
                fiatGeolocations.map(g => [
                    (g.ticker ?? '').toLowerCase(),
                    { lat: g.lat, long: g.long }
                ])
            );

            const pairs = Object.entries(props.currencyConversionRates[conversionRatesBase])
                .filter(([tickerName]) => Object.keys(FiatList()).includes(tickerName))
                .map(([tickerName, value]) => ({
                    tickerName,
                    value,
                }));

            const geoPairs = pairs.map(p => {
                const ticker = geoIndex.get(p.tickerName.toLowerCase());
                return {
                    tickerName: p.tickerName,
                    value: p.value,
                    lat: ticker?.lat ?? NaN,
                    long: ticker?.long ?? NaN,
                };
            });

            const bars: BarData[] = geoPairs
                .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.long))
                .map(p => ({
                    lat: p.lat,
                    long: p.long,
                    height: Math.max(0.05, Math.log10(p.value + 1) * 0.6),
                    label: p.tickerName,
                    sphereRadius: worldRadius,
                    position: latLongToSphere(p.lat, p.long)
                }));


            setBars(bars);
        }

    }, [props.currencyConversionRates])

    return (
        <div className="scene">

            <Canvas camera={{ position: [8, 8, 8], fov: 60 }}>

                <WorldScene bars={bars} sphereRadius={worldRadius} />
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={worldRadius + 2}
                    maxDistance={20}
                />
                
            </Canvas>

        </div>
    );
}

export default Visualizer;