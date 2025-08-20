import { useLoader } from "@react-three/fiber";
import { Billboard, Sphere, Text } from "@react-three/drei";
import Bar from "./Bar";
import earth from './../assets/2k_earth_daymap.jpg'
import * as THREE from "three";
import { AppState } from "../Infrustructure/AppState";
import { Line } from '@react-three/drei';

export default function WorldScene({ bars, sphereRadius: worldRadius }: { bars: BarData[], sphereRadius: number }) {
    let midPointVec;

    const texture = useLoader(THREE.TextureLoader, earth) as THREE.Texture;
    texture.anisotropy = 8;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1, 1);

    function getlinePoints(): THREE.Vector3[] {
        if (bars && AppState.getSelectedTicker() && AppState.getSelectedConversionTicker()) {
            const startPositionBar = bars.find(b => b.label == AppState.getSelectedTicker()?.tickerName);
            const startPoint = new THREE.Vector3(startPositionBar?.position?.x, startPositionBar?.position?.y, startPositionBar?.position?.z);

            const endPositionBar = bars.find(b => b.label == AppState.getSelectedConversionTicker()?.tickerName)
            const endPoint = new THREE.Vector3(endPositionBar?.position.x, endPositionBar?.position.y, endPositionBar?.position.z);

            const midPoint = CalculateGeoGraphicMidPoint(startPositionBar, endPositionBar)
            const midPointVector = new THREE.Vector3(midPoint?.x, midPoint?.y, midPoint?.z);

            midPointVec = midPointVector;

            const P = new THREE.Vector3()
                .copy(midPointVector).multiplyScalar(2.5)
                .addScaledVector(startPoint, -0.5)
                .addScaledVector(midPointVector, -0.5);

            const curve = new THREE.QuadraticBezierCurve3(startPoint, P, endPoint);
            return curve.getPoints(20);
        }
        return [new THREE.Vector3(0, 0, 0)]
    }

    function CalculateGeoGraphicMidPoint(start: BarData | undefined, end: BarData | undefined) {
        if (start && end) {
            const dist = Math.sqrt(Math.pow((start.lat - end.lat), 2) + Math.pow((start.long - end.long), 2))

            const midpoint_lat = (start.lat + end.lat) / 2;
            const midpoint_lon = (start.long + end.long) / 2
            const phi = (90 - (midpoint_lat)) * (Math.PI / 180);
            const theta = ((midpoint_lon) + 180) * (Math.PI / 180);
            let x = 0;
            let y = 0;
            let z = 0;

            if ((dist) < 180) {
                x = -((worldRadius * 1.6) * Math.sin(phi) * Math.cos(theta));
                y = worldRadius * 1.6 * Math.cos(phi);
                z = worldRadius * 1.6 * Math.sin(phi) * Math.sin(theta);
            }
            else {
                x = -((worldRadius * 1.6) * Math.sin(phi) * Math.cos(theta));
                y = -worldRadius * 1.6 * Math.cos(phi);
                z = -worldRadius * 1.6 * Math.sin(phi) * Math.sin(theta);
            }

            return { x, y, z };
        }
    }

    return (
        <>
            <ambientLight intensity={5} />

            <Sphere args={[worldRadius, 32, 32]} position={[0, 0, 0]}>

                <meshStandardMaterial
                    map={texture} metalness={2} roughness={0.1}
                />

                {texture &&
                    <meshPhongMaterial attach="material" map={texture} />
                }

            </Sphere>

            {bars.map((bar, i) => (
                <Bar key={i} {...bar} />
            ))}

            <Line points={getlinePoints()} color="blue" lineWidth={2} />

            {midPointVec && (
                <Billboard position={midPointVec}>
                    <Text fontSize={0.4} color="black" anchorX="center" anchorY="bottom">
                        {AppState.getConversionValue().toFixed(2)} {AppState.getSelectedConversionTicker()?.tickerName}
                    </Text>
                </Billboard>
            )}

        </>
    );
}