import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useEffect, useState } from "react";


function Bar({ x, y, height, label }: BarData) {
    return (
        <group position={[x, y, height / 2]}>
            <mesh>
                <boxGeometry args={[0.2, 0.2, height]} />
                <meshStandardMaterial color="orange" />
            </mesh>

            <Text
                position={[0, 0, height / 2 + 0.3]}
                fontSize={0.3}
                color="black"
                anchorX="center"
                anchorY="bottom"
            >
                {label}
            </Text>
        </group>
    );
}

function Visualizer(props: { currencyConversionRates: CurrencyConversion | undefined }) {
    const [bars, setBars] = useState<BarData[]>([])

    useEffect(() => {
        if (props.currencyConversionRates) {
            const [firstBase] = Object.keys(props.currencyConversionRates).filter(k => k !== "date");
            const rates = props.currencyConversionRates[firstBase] as CurrencyRates;
            const pairs = Object.entries(rates).map(([tickerName, value]) => ({
                tickerName,
                value,
            }))

            const n = Math.ceil(Math.sqrt(pairs.length));

            const _bars: BarData[] = pairs.map((pair, i) => {
                const x = i % n;
                const y = Math.floor(i / n);
                if (pair.value < 10) {

                    return {
                        x,
                        y,
                        height: pair.value,
                        label: pair.tickerName,
                    };
                } else {

                    return {
                        x,
                        y,
                        height: pair.value / 10000,
                        label: pair.tickerName,
                    }
                }
            });

            setBars(_bars);
        }

    }, [props.currencyConversionRates])

    return (
        <div style={{ width: "500px", height: "500px" }}>
            <Canvas camera={{ position: [6, 6, 6] }}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />

                <mesh rotation={[0, 0, 0]}>
                    <meshStandardMaterial color="#e0e0e0" />
                </mesh>

                {bars.map((bar, i) => (
                    <Bar key={i} {...bar} />
                ))}

                <OrbitControls />
            </Canvas>
        </div>
    );
}

export default Visualizer;