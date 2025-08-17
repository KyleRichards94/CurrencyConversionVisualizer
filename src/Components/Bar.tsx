
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";

function latLongToSphere(lat: number, long: number, radius: number) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (long + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return { x, y, z };
}

export default function Bar({ lat, long, height, label, sphereRadius }: BarData) {
    const surface = latLongToSphere(lat, long, sphereRadius);
    const normal = new THREE.Vector3(surface.x, surface.y, surface.z).normalize();
    const quat = new THREE.Quaternion()
        .setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

    return (
        <group position={[surface.x, surface.y, surface.z]} quaternion={quat}>
            <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[0.03, height, 0.03]} />
                <meshStandardMaterial color="green" />
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