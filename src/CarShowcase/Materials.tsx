import * as THREE from 'three';

export type MaterialRefs = {
	body: THREE.MeshPhysicalMaterial;
	glass: THREE.MeshPhysicalMaterial;
	details: THREE.MeshStandardMaterial;
};

export function createBodyMaterial(color = '#c42828'): THREE.MeshPhysicalMaterial {
	return new THREE.MeshPhysicalMaterial({
		color: new THREE.Color(color),
		metalness: 0.7,
		roughness: 0.24,
		clearcoat: 1.0,
		clearcoatRoughness: 0.06,
		envMapIntensity: 1.3,
	});
}

export function createGlassMaterial(color = '#ffffff'): THREE.MeshPhysicalMaterial {
	return new THREE.MeshPhysicalMaterial({
		color: new THREE.Color(color),
		metalness: 0.15,
		roughness: 0.05,
		transmission: 0.35,
		thickness: 0.6,
		ior: 1.5,
		envMapIntensity: 1.0,
		transparent: true,
		opacity: 0.45,
		depthWrite: false,
	});
}

export function createChromeMaterial(): THREE.MeshStandardMaterial {
	return new THREE.MeshStandardMaterial({
		color: '#a0a4ac',
		metalness: 0.88,
		roughness: 0.25,
		envMapIntensity: 0.9,
	});
}

export function createDetailsMaterial(color = '#cccccc'): THREE.MeshStandardMaterial {
	return new THREE.MeshStandardMaterial({
		color: new THREE.Color(color),
		metalness: 0.9,
		roughness: 0.5,
		envMapIntensity: 1.0,
	});
}

export function createTireMaterial(): THREE.MeshStandardMaterial {
	return new THREE.MeshStandardMaterial({
		color: '#080808',
		roughness: 1.0,
		metalness: 0,
		envMapIntensity: 0,
	});
}

export function createLightMaterial(): THREE.MeshPhysicalMaterial {
	return new THREE.MeshPhysicalMaterial({
		color: '#fafafa',
		metalness: 0.1,
		roughness: 0.05,
		transmission: 0.2,
		ior: 1.45,
		clearcoat: 0.3,
		clearcoatRoughness: 0.1,
	});
}

export function createTrimMaterial(): THREE.MeshStandardMaterial {
	return new THREE.MeshStandardMaterial({
		color: '#1a1a1a',
		roughness: 0.25,
		metalness: 0.1,
		envMapIntensity: 0.8,
	});
}

export function createInteriorMaterial(baseColor = '#2a2a2a'): THREE.MeshStandardMaterial {
	return new THREE.MeshStandardMaterial({
		color: baseColor,
		roughness: 0.8,
		metalness: 0,
	});
}
