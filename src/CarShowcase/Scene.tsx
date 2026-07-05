import { useState } from 'react';
import { useCurrentFrame, useRemotionEnvironment } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import CarModel from './CarModel';
import { SceneLights } from './Lighting';
import { Ground, ShadowReceiver } from './Ground';
import { ColorControls, type CarColors } from './ColorControls';

/**
 * 深灰展示环境贴图
 * 暗环境 + 天花板柔光箱，地面与背景色调统一
 */
function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
	const pmremGenerator = new THREE.PMREMGenerator(renderer);

	const envScene = new THREE.Scene();
	envScene.background = new THREE.Color('#2f3032');

	// 天花板柔光箱 — 提供车身顶部反射
	const softboxMat = new THREE.MeshBasicMaterial({ color: '#f0ece6' });
	const makeSoftbox = (x: number, z: number, w: number, d: number) => {
		const box = new THREE.Mesh(new THREE.PlaneGeometry(w, d), softboxMat);
		box.rotation.x = -Math.PI / 2;
		box.position.set(x, 5.5, z);
		envScene.add(box);
	};
	makeSoftbox(-1.5, 0, 1.4, 4);
	makeSoftbox(1.5, 0, 1.4, 4);
	makeSoftbox(0, 0, 5, 5);

	// 侧面柔光 — 勾勒车身腰线
	const sideGradTex = (() => {
		const size = 256;
		const canvas = document.createElement('canvas');
		canvas.width = 1;
		canvas.height = size;
		const ctx = canvas.getContext('2d')!;
		const g = ctx.createLinearGradient(0, 0, 0, size);
		g.addColorStop(0, '#1a1c22');
		g.addColorStop(0.3, '#505660');
		g.addColorStop(0.5, '#9098a8');
		g.addColorStop(0.7, '#505660');
		g.addColorStop(1, '#1a1c22');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, 1, size);
		const tex = new THREE.CanvasTexture(canvas);
		tex.minFilter = THREE.LinearFilter;
		tex.magFilter = THREE.LinearFilter;
		return tex;
	})();

	const sidePanelMat = new THREE.MeshBasicMaterial({ map: sideGradTex });
	const makeSide = (x: number, ry: number) => {
		const p = new THREE.Mesh(new THREE.PlaneGeometry(3, 4.5), sidePanelMat);
		p.position.set(x, 2.25, 0);
		p.rotation.y = ry;
		envScene.add(p);
	};
	makeSide(-5.5, Math.PI / 2);
	makeSide(5.5, -Math.PI / 2);

	// 后墙 — 上亮下暗，与地面同色系
	const backGradTex = (() => {
		const size = 256;
		const canvas = document.createElement('canvas');
		canvas.width = 1;
		canvas.height = size;
		const ctx = canvas.getContext('2d')!;
		const g = ctx.createLinearGradient(0, 0, 0, size);
		g.addColorStop(0, '#40444a');
		g.addColorStop(0.5, '#585c64');
		g.addColorStop(1, '#2b2d30');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, 1, size);
		const tex = new THREE.CanvasTexture(canvas);
		tex.minFilter = THREE.LinearFilter;
		tex.magFilter = THREE.LinearFilter;
		return tex;
	})();
	const backWall = new THREE.Mesh(
		new THREE.PlaneGeometry(10, 5),
		new THREE.MeshBasicMaterial({ map: backGradTex }),
	);
	backWall.position.set(0, 2.5, 5.5);
	envScene.add(backWall);

	// 前墙 — 深灰
	const frontWall = new THREE.Mesh(
		new THREE.PlaneGeometry(10, 5),
		new THREE.MeshBasicMaterial({ color: '#303234' }),
	);
	frontWall.position.set(0, 2.5, -5.5);
	envScene.add(frontWall);

	// 地板 — 与地面统一深灰
	const floor = new THREE.Mesh(
		new THREE.PlaneGeometry(12, 12),
		new THREE.MeshBasicMaterial({ color: '#2b2d30' }),
	);
	floor.rotation.x = Math.PI / 2;
	floor.position.y = -0.1;
	envScene.add(floor);

	const envMap = pmremGenerator.fromScene(envScene, 0.03).texture;
	pmremGenerator.dispose();

	return envMap;
}

export default function Scene() {
	const frame = useCurrentFrame();
	const env = useRemotionEnvironment();

	const [colors, setColors] = useState<CarColors>({
		body: '#c42828',
		details: '#cccccc',
		glass: '#ffffff',
	});

	const isStudio = env.isStudio;

	return (
		<div style={{ position: 'relative', width: '100%', height: '100%' }}>
			<ThreeCanvas
				width={1920}
				height={1080}
				style={{ backgroundColor: '#2f3032' }}
				gl={{
					antialias: true,
					toneMapping: THREE.ACESFilmicToneMapping,
					toneMappingExposure: 1.2,
					outputColorSpace: THREE.SRGBColorSpace,
				}}
				camera={{
					position: [4.5, 2.5, 4.5],
					fov: 40,
					near: 0.1,
					far: 100,
				}}
				onCreated={({ scene, gl }) => {
					scene.background = new THREE.Color('#2f3032');
					scene.fog = new THREE.Fog('#2f3032', 5, 18);
					scene.environment = createStudioEnvironment(gl);
				}}
			>
				<SceneLights />
				<Ground />
				<ShadowReceiver />
				<CarModel colors={colors} frame={frame} isStudio={isStudio} />
				{isStudio && (
					<OrbitControls
						target={[0, 0.45, 0]}
						maxPolarAngle={Math.PI / 2.2}
						maxDistance={10}
						minDistance={2}
						enablePan={false}
					/>
				)}
			</ThreeCanvas>
			{isStudio && (
				<ColorControls colors={colors} onColorsChange={setColors} />
			)}
		</div>
	);
}
