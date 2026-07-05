import { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * 明亮自然影棚灯光 — 控制环境光不过量，保持材质对比
 */
export function SceneLights() {
	const leftSpotRef = useRef<THREE.SpotLight>(null);
	const rightSpotRef = useRef<THREE.SpotLight>(null);

	useEffect(() => {
		if (leftSpotRef.current) {
			leftSpotRef.current.target.position.set(-0.6, -0.3, 4.5);
		}
		if (rightSpotRef.current) {
			rightSpotRef.current.target.position.set(0.6, -0.3, 4.5);
		}
	}, []);

	return (
		<>
			{/* 半球光 — 降低强度，避免全局发白 */}
			<hemisphereLight
				args={['#d0d6e0', '#8890a0', 0.5]}
			/>

			{/* 微弱环境光 — 仅为消除绝对死黑 */}
			<ambientLight
				args={['#ffffff', 0.1]}
			/>

			{/* 主光 — 左前上方，保持对比 */}
			<directionalLight
				position={[-2, 4, 3]}
				intensity={2.5}
				color="#ffffff"
			/>

			{/* 右侧辅光 — 平衡暗面 */}
			<directionalLight
				position={[2.5, 2, 4]}
				intensity={0.7}
				color="#ffffff"
			/>

			{/* 后方轮廓光 */}
			<directionalLight
				position={[0, 2.5, -3.5]}
				intensity={0.5}
				color="#aabbdd"
			/>

			{/* 左大灯投射 */}
			<spotLight
				ref={leftSpotRef}
				position={[-0.6, 0.45, 2.0]}
				intensity={1.5}
				color="#e8f0ff"
				distance={3.0}
				angle={0.8}
				penumbra={0.8}
				decay={2}
			/>

			{/* 右大灯投射 */}
			<spotLight
				ref={rightSpotRef}
				position={[0.6, 0.45, 2.0]}
				intensity={1.5}
				color="#e8f0ff"
				distance={3.0}
				angle={0.8}
				penumbra={0.8}
				decay={2}
			/>
		</>
	);
}
