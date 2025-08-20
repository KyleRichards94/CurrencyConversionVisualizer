import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import FiatList from "../Tickers/FiatTickers";
import fiatGeolocations from '../assets/fiat_geolocations.json'
import WorldScene from "./WorldScene";


function Visualizer(props: { currencyConversionRates: CurrencyConversion | undefined }) {
    const [bars, setBars] = useState<BarData[]>([])
    const sphereRadius = 3;

    function latLongToSphere(lat: number, long: number) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (long + 180) * (Math.PI / 180);

        const x = -(sphereRadius * Math.sin(phi) * Math.cos(theta));
        const y = sphereRadius * Math.cos(phi);
        const z = sphereRadius * Math.sin(phi) * Math.sin(theta);

        return { x, y, z };
    }

    useEffect(() => {
        if (props.currencyConversionRates) {
            const [firstBase] = Object.keys(props.currencyConversionRates).filter(k => k !== "date");
            const rates = props.currencyConversionRates[firstBase] as CurrencyRates;

            const fiatKeys = Object.keys(FiatList());
            const fiatGeoLocations = fiatGeolocations

            const geoIndex = new Map(
                fiatGeoLocations.map(g => [
                    (g.ticker ?? '').toLowerCase(),
                    { lat: g.lat, long: g.long }
                ])
            );

            const pairs = Object.entries(rates)
                .filter(([tickerName]) => fiatKeys.includes(tickerName))
                .map(([tickerName, value]) => ({
                    tickerName,
                    value,
                }));

            const geoPairs = pairs.map(p => {
                const hit = geoIndex.get(p.tickerName.toLowerCase());
                return {
                    tickerName: p.tickerName,
                    value: p.value,
                    lat: hit?.lat ?? NaN,
                    long: hit?.long ?? NaN,
                };
            });

            const bars: BarData[] = geoPairs
                .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.long))
                .map(p => ({
                    lat: p.lat,
                    long: p.long,
                    height: Math.max(0.05, Math.log10(p.value + 1) * 0.6),
                    label: p.tickerName,
                    sphereRadius,
                    position: latLongToSphere(p.lat, p.long)
                }));


            setBars(bars);
        }

    }, [props.currencyConversionRates])

    return (
        <div className="scene">
            <Canvas camera={{ position: [8, 8, 8], fov: 60 }}>
                <WorldScene bars={bars} sphereRadius={sphereRadius} />

                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={sphereRadius + 2}
                    maxDistance={20}
                />
            </Canvas>
        </div>
    );
}

export default Visualizer;