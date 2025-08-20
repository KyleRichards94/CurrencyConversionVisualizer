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

            const midPoint = CalculateGeographicMidpoint(startPositionBar, endPositionBar, worldRadius)
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

    function CalculateGeographicMidpoint(
        start: BarData | undefined,
        end: BarData | undefined,
        worldRadius: number,
        riseFactor = 1.6
    ): THREE.Vector3 | undefined {
        if (!start || !end) return;

        const startPhi = (90 - start.lat) * Math.PI / 180;
        const startTheta = (start.long + 180) * Math.PI / 180;
        const endPhi = (90 - end.lat) * Math.PI / 180;
        const endTheta = (end.long + 180) * Math.PI / 180;

        const startVector = new THREE.Vector3(
            -(Math.sin(startPhi) * Math.cos(startTheta)),
            (Math.cos(startPhi)),
            (Math.sin(startPhi) * Math.sin(startTheta))
        ).normalize();

        const endVector = new THREE.Vector3(
            -(Math.sin(endPhi) * Math.cos(endTheta)),
            (Math.cos(endPhi)),
            (Math.sin(endPhi) * Math.sin(endTheta))
        ).normalize();

        const summedDirection = new THREE.Vector3().addVectors(startVector, endVector);
        let midpointDirection: THREE.Vector3;
        if (summedDirection.lengthSq() < 1e-16) {
            const fallbackAxis = new THREE.Vector3(0, 1, 0);
            const greatCircleNormal = new THREE.Vector3().copy(startVector).cross(fallbackAxis);

            if (greatCircleNormal.lengthSq() < 1e-12) {
                greatCircleNormal.copy(startVector).cross(new THREE.Vector3(1, 0, 0));
            }

            midpointDirection = new THREE.Vector3().copy(greatCircleNormal).cross(startVector).normalize();
        } else {
            midpointDirection = summedDirection.normalize();
        }

        const finalRadius = worldRadius * riseFactor;
        return midpointDirection.multiplyScalar(finalRadius);
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