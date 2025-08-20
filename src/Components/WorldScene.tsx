import { useLoader } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import Bar from "./Bar";
import earth from './../assets/2k_earth_daymap.jpg'
import * as THREE from "three";

export default function WorldScene({ bars, sphereRadius }: { bars: BarData[], sphereRadius: number }) {
    const texture = useLoader(THREE.TextureLoader, earth) as THREE.Texture;
    texture.anisotropy = 8;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1, 1);

    return (
        <>
            <ambientLight intensity={5} />

            <Sphere args={[sphereRadius, 32, 32]} position={[0, 0, 0]}>
                <meshStandardMaterial
                    map={texture} metalness={2} roughness={0.1}
                />
                {texture && <meshPhongMaterial attach="material" map={texture} />}
            </Sphere>

            {bars.map((bar, i) => (
                <Bar key={i} {...bar} />
            ))}

        </>
    );
}