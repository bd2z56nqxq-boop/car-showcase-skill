import { useMemo } from 'react';
import { CanvasTexture, RepeatWrapping } from 'three';

/**
 * 深灰网格地面 — 对标 Three.js webgl_materials_car
 * 明确但克制的网格，提供空间透视感
 */
function createGridTexture(): CanvasTexture {
	const size = 512;
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d')!;

	// 深灰底色
	ctx.fillStyle = '#2e3033';
	ctx.fillRect(0, 0, size, size);

	// 次网格线 — 每 1m（32px），克制但可见
	ctx.strokeStyle = '#585d65';
	ctx.lineWidth = 2;
	const minorGrid = 32;
	for (let i = 0; i <= size; i += minorGrid) {
		ctx.beginPath();
		ctx.moveTo(i + 0.5, 0);
		ctx.lineTo(i + 0.5, size);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, i + 0.5);
		ctx.lineTo(size, i + 0.5);
		ctx.stroke();
	}

	// 主网格线 — 每 2m（64px），明确但克制
	ctx.strokeStyle = '#757980';
	ctx.lineWidth = 2.5;
	const mainGrid = 64;
	for (let i = 0; i <= size; i += mainGrid) {
		ctx.beginPath();
		ctx.moveTo(i + 0.5, 0);
		ctx.lineTo(i + 0.5, size);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, i + 0.5);
		ctx.lineTo(size, i + 0.5);
		ctx.stroke();
	}

	const tex = new CanvasTexture(canvas);
	tex.wrapS = RepeatWrapping;
	tex.wrapT = RepeatWrapping;
	tex.repeat.set(6, 6);
	tex.colorSpace = 'srgb' as any;
	tex.minFilter = 1006 as any; // LinearMipmapLinearFilter
	tex.magFilter = 1006 as any;
	return tex;
}

export function Ground() {
	const gridTex = useMemo(() => createGridTexture(), []);

	return (
		<mesh
			rotation={[-Math.PI / 2, 0, 0]}
			position={[0, -0.02, 0]}
			receiveShadow
		>
			<planeGeometry args={[40, 40]} />
			<meshStandardMaterial
				map={gridTex}
				color="#2e3033"
				metalness={0}
				roughness={0.5}
			/>
		</mesh>
	);
}

/**
 * 柔和接地阴影 — 四轮下方 + 车底中央
 */
export function ShadowReceiver() {
	const shadowTexture = useMemo(() => {
		const canvas = document.createElement('canvas');
		canvas.width = 512;
		canvas.height = 512;
		const ctx = canvas.getContext('2d')!;

		const gradient = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
		gradient.addColorStop(0, 'rgba(0,0,0,0.85)');
		gradient.addColorStop(0.2, 'rgba(0,0,0,0.5)');
		gradient.addColorStop(0.45, 'rgba(0,0,0,0.2)');
		gradient.addColorStop(0.7, 'rgba(0,0,0,0.05)');
		gradient.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 512, 512);

		const texture = new CanvasTexture(canvas);
		return texture;
	}, []);

	return (
		<mesh
			rotation={[-Math.PI / 2, 0, 0]}
			position={[0, 0.005, 0]}
			renderOrder={2}
		>
			<planeGeometry args={[5, 8]} />
			<meshBasicMaterial
				map={shadowTexture}
				blending={2}
				depthWrite={false}
				transparent
				opacity={0.4}
				toneMapped={false}
			/>
		</mesh>
	);
}
