import { useEffect, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { staticFile } from 'remotion';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as THREE from 'three';
import {
	createBodyMaterial,
	createGlassMaterial,
	createDetailsMaterial,
	createTireMaterial,
	createChromeMaterial,
	createLightMaterial,
	createTrimMaterial,
	createInteriorMaterial,
} from './Materials';
import type { CarColors } from './ColorControls';

/**
 * ============================================================
 * 🔧 模型配置 — 修改这里的路径和零件命名规则来适配你的车模
 * ============================================================
 */

/** FBX 模型路径 (放 public/models/ 下) */
const MODEL_PATH = '/models/model.fbx';

/**
 * 零件分类规则 — 根据模型零件命名自动归类
 * key: 分类名 | value: 零件名中需包含的关键词 (小写)
 *
 * 如果你的车模命名不同，改这些关键词即可：
 *   body:    车门/引擎盖/翼子板等车漆件
 *   glass:   车窗/挡风玻璃
 *   lights:  大灯/尾灯/雾灯
 *   chrome:  镀铬装饰/车标
 *   wheel:   轮毂
 *   tyre:    轮胎
 *   rotor:   刹车盘
 *   chassis: 底盘/排气管
 *   cab:     驾驶室
 *   interior:内饰
 */
const CATEGORIES = {
	body: ['_mm_ext'],
	glass: ['_mm_windows'],
	lights: ['_mm_lights'],
	chrome: ['_mm_badges'],
	wheel: ['_mm_wheel'],
	tyre: ['_mm_tyre'],
	rotor: ['_mm_rotor'],
	chassis: ['_mm_chassis'],
	cab: ['_mm_cab'],
	interior: ['intlod'],
} as const;

interface CarModelProps {
	colors: CarColors;
	frame: number;
	isStudio: boolean;
}

function categorize(name: string): string {
	const lower = name.toLowerCase();
	for (const [cat, patterns] of Object.entries(CATEGORIES)) {
		if (patterns.some((p) => lower.includes(p))) return cat;
	}
	return 'misc';
}

/** Copy texture maps from source material to target material */
function copyMaps(target: any, source: any) {
	target.map = source.map ?? null;
	target.normalMap = source.normalMap ?? null;
	target.alphaMap = source.alphaMap ?? null;
	target.emissiveMap = source.emissiveMap ?? null;
	target.roughnessMap = source.roughnessMap ?? null;
	target.metalnessMap = source.metalnessMap ?? null;
	target.bumpMap = source.bumpMap ?? null;
}

export default function CarModel({
	colors,
	frame,
}: CarModelProps) {
	const fbxGroup = useLoader(FBXLoader, staticFile(MODEL_PATH));

	const bodyMat = useMemo(() => createBodyMaterial(colors.body), [colors.body]);
	const glassMat = useMemo(() => createGlassMaterial(colors.glass), [colors.glass]);
	const detailsMat = useMemo(() => createDetailsMaterial(colors.details), [colors.details]);

	const tireMat = useMemo(() => createTireMaterial(), []);
	const chromeMat = useMemo(() => createChromeMaterial(), []);
	const lightMat = useMemo(() => createLightMaterial(), []);
	const trimMat = useMemo(() => createTrimMaterial(), []);
	const interiorMat = useMemo(() => createInteriorMaterial(), []);

	const { wheelPivots } = useMemo(() => {
		const rotatingMeshes: THREE.Mesh[] = [];

		fbxGroup.traverse((child) => {
			// 禁用FBX内嵌灯光
			if (child instanceof THREE.Light) {
				child.intensity = 0;
				child.visible = false;
				return;
			}
			if (!(child as THREE.Mesh).isMesh) return;
			const mesh = child as THREE.Mesh;
			const name = mesh.name;
			const cat = categorize(name);
			const upper = name.toUpperCase();

			// ─── HEADLIGHT LENS: transparent PC outer cover ───
			if (upper.includes('HEADLIGHT_LENS')) {
				const mat = new THREE.MeshPhysicalMaterial({
					color: '#e8ecf2',
					metalness: 0.02,
					roughness: 0.06,
					transparent: true,
					opacity: 0.42,
					depthWrite: false,
					clearcoat: 0.95,
					clearcoatRoughness: 0.04,
					ior: 1.5,
					transmission: 0.08,
					thickness: 0.45,
					envMapIntensity: 1.0,
				});
				mat.depthTest = true;
				mesh.material = mat;
				mesh.renderOrder = 1;
				return;
			}

			// ─── TAILLIGHT LENS: transparent red outer cover ───
			if (upper.includes('TAILLIGHT_LENS')) {
				const orig = mesh.material as THREE.MeshPhongMaterial;
				const mat = new THREE.MeshPhysicalMaterial({
					color: '#d42211',
					metalness: 0.02,
					roughness: 0.08,
					transparent: true,
					opacity: 0.52,
					depthWrite: false,
					clearcoat: 0.85,
					clearcoatRoughness: 0.04,
					ior: 1.5,
					transmission: 0.12,
					envMapIntensity: 1.2,
				});
				copyMaps(mat, orig);
				mat.depthTest = true;
				mesh.material = mat;
				mesh.renderOrder = 1;
				return;
			}

			// ─── HEADLIGHT INTERNAL: 2-slot assembly (housing + reflector) ───
			if (cat === 'lights' && (upper.includes('BODY') || name.includes('002'))) {
				const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
				const orig0 = mats[0] as THREE.MeshPhongMaterial;
				const orig1 = mats[1] as THREE.MeshPhongMaterial;

				const housingMat = new THREE.MeshStandardMaterial({
					color: '#3d4045',
					metalness: 0.12,
					roughness: 0.4,
					envMapIntensity: 0.4,
				});
				copyMaps(housingMat, orig0);

				const reflectorMat = new THREE.MeshStandardMaterial({
					color: '#e2e4f0',
					metalness: 0.85,
					roughness: 0.22,
					emissive: new THREE.Color('#c0d0ff'),
					emissiveIntensity: 0.06,
					envMapIntensity: 1.5,
				});
				copyMaps(reflectorMat, orig1);

				mesh.material = [housingMat, reflectorMat];
				return;
			}

			// ─── HIGH-MOUNT BRAKE LIGHT ───
			if (upper.includes('BRAKES_BOOT')) {
				const orig = mesh.material as THREE.MeshPhongMaterial;
				const mat = new THREE.MeshStandardMaterial({
					color: '#dd1111',
					metalness: 0.02,
					roughness: 0.3,
					emissive: new THREE.Color('#dd0000'),
					emissiveIntensity: 1.0,
					transparent: true,
					opacity: 0.85,
					depthWrite: false,
				});
				copyMaps(mat, orig);
				mesh.material = mat;
				mesh.renderOrder = 2;
				return;
			}

			// ─── TAILLIGHT INTERNAL: C-shape luminous structure ───
			if (upper.includes('BOOT') && cat === 'lights') {
				const orig = mesh.material as THREE.MeshPhongMaterial;
				const mat = new THREE.MeshStandardMaterial({
					color: '#ffffff',
					metalness: 0.04,
					roughness: 0.35,
					emissive: new THREE.Color('#dd0000'),
					emissiveIntensity: 0.12,
					envMapIntensity: 0.2,
				});
				copyMaps(mat, orig);
				if (orig.map) mat.emissiveMap = orig.map;
				mesh.material = mat;
				return;
			}

			// ─── BRAKE LIGHTS LEFT / RIGHT ───
			if (upper.includes('BRAKES_LEFT') || upper.includes('BRAKES_RIGHT')) {
				const orig = mesh.material as THREE.MeshPhongMaterial;
				const mat = new THREE.MeshStandardMaterial({
					color: '#dd1111',
					metalness: 0.02,
					roughness: 0.3,
					emissive: new THREE.Color('#dd0000'),
					emissiveIntensity: 0.12,
					transparent: true,
					opacity: 0.85,
				});
				copyMaps(mat, orig);
				mesh.material = mat;
				return;
			}

			// ─── NON-LIGHT MESHES: original material assignment ───
			switch (cat) {
				case 'body':
					mesh.material = bodyMat;
					break;
				case 'glass':
					mesh.material = glassMat;
					mesh.renderOrder = 1;
					break;
				case 'lights':
					if (upper.includes('CHASSIS') || upper.includes('WHEEL') || upper.includes('EXHAUST')) {
						mesh.material = chromeMat;
					} else {
						mesh.material = lightMat;
					}
					break;
				case 'chrome':
					mesh.material = chromeMat;
					break;
				case 'wheel':
					mesh.material = chromeMat;
					rotatingMeshes.push(mesh);
					break;
				case 'tyre':
					mesh.material = tireMat;
					rotatingMeshes.push(mesh);
					break;
				case 'rotor':
					mesh.material = chromeMat;
					rotatingMeshes.push(mesh);
					break;
				case 'cab':
				case 'interior':
					mesh.material = interiorMat;
					break;
				case 'misc':
					if (upper.includes('BOOT')) {
						mesh.material = trimMat;
					} else {
						mesh.material = detailsMat;
					}
					break;
				case 'chassis':
				default:
					mesh.material = detailsMat;
					break;
			}
		});

		function createWheelPivots(
			root: THREE.Group,
			meshes: THREE.Mesh[],
		): THREE.Group[] {
			if (meshes.length === 0) return [];

			root.updateWorldMatrix(true, true);

			const items = meshes.map((m) => {
				const pos = new THREE.Vector3();
				m.getWorldPosition(pos);
				return { mesh: m, pos };
			});

			items.sort((a, b) => a.pos.z - b.pos.z);
			const half = Math.ceil(items.length / 2);
			const front = items.slice(0, half);
			const rear = items.slice(half);

			const pivots: THREE.Group[] = [];

			[front, rear].forEach((group) => {
				const left: THREE.Mesh[] = [];
				const right: THREE.Mesh[] = [];
				const sum = new THREE.Vector3();

				group.forEach((item) => {
					sum.add(item.pos);
					if (item.pos.x < 0) left.push(item.mesh);
					else right.push(item.mesh);
				});

				const center = sum.clone().divideScalar(group.length);

				const makePivot = (meshes_: THREE.Mesh[]) => {
					const pivot = new THREE.Group();
					pivot.position.copy(center);
					root.add(pivot);
					meshes_.forEach((m) => pivot.attach(m));
					pivots.push(pivot);
				};

				if (left.length > 0) makePivot(left);
				if (right.length > 0) makePivot(right);
			});

			return pivots;
		}

		const wheelPivots = createWheelPivots(fbxGroup, rotatingMeshes);

		return { wheelPivots };
	}, [bodyMat, glassMat, detailsMat]);

	useEffect(() => {
		wheelPivots.forEach((pivot) => {
			pivot.rotation.x += 0.02;
		});
	}, [frame, wheelPivots]);

	return (
		<primitive object={fbxGroup}>
			{wheelPivots.map((pivot, i) => (
				<primitive key={i} object={pivot} />
			))}
		</primitive>
	);
}
