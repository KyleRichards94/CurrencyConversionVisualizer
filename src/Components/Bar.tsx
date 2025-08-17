
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function latLongToSphere(lat: number, long: number, radius: number) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (long + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return { x, y, z };
}

function useBillboard(cameraRef: React.RefObject<THREE.Camera | null>) {
    const textRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (textRef.current && cameraRef.current) {
            textRef.current.lookAt(cameraRef.current.position);
        }
    });

    return textRef;
}

export default function Bar({ lat, long, height, label, sphereRadius, cameraRef }: BarData & { cameraRef: React.RefObject<THREE.Camera | null> }) {
    const surface = latLongToSphere(lat, long, sphereRadius);
    const normal = new THREE.Vector3(surface.x, surface.y, surface.z).normalize();
    const quat = new THREE.Quaternion()
        .setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

    const textRef = useBillboard(cameraRef);

    return (
        <group position={[surface.x, surface.y, surface.z]} quaternion={quat}>
            <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[0.1, height, 0.1]} />
                <meshStandardMaterial color="green" />
            </mesh>

            <group ref={textRef} position={[0, height + 0.1, 0]}>
                <Text
                    fontSize={0.1}
                    color="black"
                    anchorX="center"
                    anchorY="bottom"
                >
                    {label}
                </Text>
            </group>
        </group>
    );
}