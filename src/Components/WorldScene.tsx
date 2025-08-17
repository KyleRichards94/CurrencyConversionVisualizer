import { useThree } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { useEffect, useRef } from "react";
import Bar from "./Bar";

export default function WorldScene({ bars, sphereRadius }: { bars: BarData[], sphereRadius: number }) {
    const { camera } = useThree();
    const cameraRef = useRef(camera);

    useEffect(() => {
        cameraRef.current = camera;
    }, [camera]);

    return (
        <>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />

            <Sphere args={[sphereRadius, 32, 32]} position={[0, 0, 0]}>
                <meshStandardMaterial
                    color="#e0e0e0"
                    transparent
                    opacity={0.3}
                    wireframe={true}
                />
            </Sphere>

            {bars.map((bar, i) => (
                <Bar key={i} {...bar} cameraRef={cameraRef} />
            ))}
        </>
    );
}