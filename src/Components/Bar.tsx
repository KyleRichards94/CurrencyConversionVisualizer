
import { Billboard, Text } from "@react-three/drei";
import { AppState } from "../Infrustructure/AppState";

import * as THREE from "three";

function getColour(ticker: string): string {
    const appticker = AppState.getSelectedTicker();
    const appconversion = AppState.getSelectedConversionTicker();
    if (appticker) {
        if (appconversion) {
            return appconversion.tickerName === ticker ? "blue"
                : appticker.tickerName === ticker ? "red" : "green"
        }
        return appticker.tickerName === ticker ? "red" : "green"
    }
    return "green"
}

export default function Bar({ height, label, position }: BarData) {

    const normal = new THREE.Vector3(position.x, position.y, position.z).normalize();
    const quat = new THREE.Quaternion()
        .setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

    return (
        <group position={[position.x, position.y, position.z]} quaternion={quat}>
            <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[0.03, height, 0.03]} />
                <meshStandardMaterial color={getColour(label)} />
            </mesh>

            <Billboard position={[0, height + 0.1, 0]}>
                <Text
                    fontSize={0.1}
                    color="black"
                    anchorX="center"
                    anchorY="bottom"
                >
                    {label}
                </Text>
            </Billboard>

        </group>
    );
}