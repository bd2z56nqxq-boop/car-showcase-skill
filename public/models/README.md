# 放置你的3D模型

## 支持的格式

- **FBX** (.fbx) — 推荐，材质和贴图路径保持完整
- **GLB / GLTF** (.glb, .gltf) — 需自行修改 `CarModel.tsx` 中的 Loader

## 快速开始

1. 把你的 `.fbx` 文件放到这个目录下
2. 打开 `src/CarShowcase/CarModel.tsx`，修改第 21 行的路径：

```ts
// 把 'model.fbx' 改成你的文件名
const MODEL_PATH = '/models/your-car.fbx';
```

## 零件命名规则

为了让颜色切换器正确识别车身各部件，你的模型零件需要按以下规则命名（关键词匹配，不区分大小写）：

| 分类 | 关键词 | 说明 |
|------|--------|------|
| **body** (车身) | `_mm_ext` | 车门、引擎盖、翼子板等 — 应用车漆材质 |
| **glass** (玻璃) | `_mm_windows` | 车窗玻璃 — 应用半透明玻璃材质 |
| **lights** (灯具) | `_mm_lights` | 大灯、尾灯 — 应用灯罩材质 |
| **chrome** (镀铬) | `_mm_badges` | 车标、镀铬条 — 应用金属材质 |
| **wheel** (轮毂) | `_mm_wheel` | 轮毂 — 应用合金材质 |
| **tyre** (轮胎) | `_mm_tyre` | 轮胎 — 应用橡胶材质 |
| **rotor** (刹车盘) | `_mm_rotor` | 刹车盘 — 应用金属材质 |
| **chassis** (底盘) | `_mm_chassis` | 底盘、排气管 — 应用深色金属 |
| **cab** (驾驶室) | `_mm_cab` | 驾驶室外壳 — 应用内饰材质 |
| **interior** (内饰) | `intlod` | 内部组件 — 应用内饰材质 |

**特殊零件名（精确匹配，用于灯具细节）：**

- `HEADLIGHT_LENS` → 大灯透明灯罩
- `TAILLIGHT_LENS` → 尾灯红色灯罩
- `HEADLIGHT` + `BODY` / `002` → 大灯内部结构（双材质槽）
- `BRAKES_BOOT` → 高位刹车灯
- `BRAKES_LEFT` / `BRAKES_RIGHT` → 左右刹车灯
- `BOOT` + lights 分类 → 尾灯C形发光结构

## 如果你的模型命名不同

编辑 `CarModel.tsx` 中的 `CATEGORIES` 对象，将关键词改成你的模型实际使用的名称。

## 贴图（可选）

如果你的 FBX 模型自带贴图文件夹（如 `textures/`），请保持与 FBX 同一目录的相对结构。

## 注意

- 模型文件不会被 git 提交（已在 `.gitignore` 中排除）
- 推荐模型面数：10万-50万（性能与质量平衡）
- 测试过：Nissan 370Z (3.3MB FBX, ~40万面)
