import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Image, Text, Float, OrbitControls, MeshDistortMaterial, Shadow, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const ActorCard = ({ person, position }) => {
    const mesh = useRef();
    const imageUrl = person.profile_path
        ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
        : 'https://images.tmdb.org/t/p/w500/wwemzKWzjKYJFfCeiB57q3r4Bcm.png';

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <group position={position}>
                {/* Visual Frame / Border */}
                <mesh position={[0, 0, -0.05]}>
                    <planeGeometry args={[2.1, 2.6]} />
                    <meshBasicMaterial color="#ff0033" transparent opacity={0.1} />
                </mesh>

                {/* Main Image */}
                <Suspense fallback={<mesh><planeGeometry args={[2, 2.5]} /><meshBasicMaterial color="#111" /></mesh>}>
                    <Image
                        url={imageUrl}
                        scale={[2, 2.5]}
                        radius={0.05}
                        toneMapped={false}
                        side={THREE.DoubleSide}
                    />
                </Suspense>

                {/* Info Backdrop */}
                <mesh position={[0, -1.6, 0.05]}>
                    <planeGeometry args={[2, 0.6]} />
                    <meshBasicMaterial color="black" transparent opacity={0.5} />
                </mesh>

                {/* Actor Name */}
                <Text
                    position={[0, -1.5, 0.1]}
                    fontSize={0.14}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                >
                    {person.name.toUpperCase()}
                </Text>

                {/* Character Name */}
                <Text
                    position={[0, -1.75, 0.1]}
                    fontSize={0.09}
                    color="#ff0033" // Neon Red
                    anchorX="center"
                    anchorY="middle"
                    opacity={0.8}
                >
                    {person.character}
                </Text>
            </group>
        </Float>
    );
};

const Carousel = ({ cast }) => {
    const groupRef = useRef();
    const actors = useMemo(() => cast.slice(0, 10), [cast]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.003; // Smooth auto-rotation
        }
    });

    return (
        <group ref={groupRef}>
            {actors.map((person, i) => {
                const angle = (i / actors.length) * Math.PI * 2;
                const radius = 7;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;

                return (
                    <ActorCard
                        key={person.id}
                        person={person}
                        position={[x, 0, z]}
                    />
                );
            })}
        </group>
    );
};

const Cast3D = ({ cast }) => {
    if (!cast || cast.length === 0) return null;

    return (
        <div className="w-full h-[600px] relative bg-gradient-to-b from-black/0 via-white/5 to-black/0 rounded-[50px] border border-white/5 overflow-hidden group">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neonRed/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neonPurple/20 blur-[120px] rounded-full" />
            </div>

            <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-neonRed" />
                </div>
            }>
                <Canvas camera={{ position: [0, 2, 18], fov: 40 }} dpr={[1, 2]}>
                    <ambientLight intensity={0.7} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    <spotLight position={[-10, 20, 10]} angle={0.2} penumbra={1} intensity={2} />

                    <Carousel cast={cast} />

                    <ContactShadows
                        position={[0, -4, 0]}
                        opacity={0.4}
                        scale={20}
                        blur={2}
                        far={4.5}
                    />

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        minPolarAngle={Math.PI / 2.5}
                        maxPolarAngle={Math.PI / 1.8}
                        autoRotate={false}
                    />
                </Canvas>
            </Suspense>

            {/* Premium Overlay Elements */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="px-4 py-1 bg-neonRed/10 border border-neonRed/20 rounded-full mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neonRed">Interactive Experience</span>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">Drag to Orbit • Hover to Focus</p>
            </div>
        </div>
    );
};

export default Cast3D;
