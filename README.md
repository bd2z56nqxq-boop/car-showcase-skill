# 🚗 Car Showcase Skill — 实时3D汽车颜色切换器

> 一个基于 Remotion + Three.js 的交互式汽车色彩评审工具。在浏览器里实时切换车漆颜色、轮毂饰面、玻璃色调，3D 预览效果立即呈现。

![Car Showcase Screenshot](https://via.placeholder.com/1920x1080/2f3032/c42828?text=Car+Showcase+Skill)

## 🎯 这是什么？

汽车色彩设计师在平面软件里调好一个颜色，喷到实车上常常完全不是那个感觉。

**车漆不是平面颜色**——它有金属颗粒、清漆层、曲面高光。你没法拿一张色卡判断"这个颜色上车好不好看"。

这个工具解决了这个问题：**放上你的3D车模，点几下颜色，一秒判断行不行。**

---

## ✨ 功能

- 🎨 **实时换色** — 车身、轮毂/镀铬装饰、玻璃三通道独立调色
- 🖱️ **点击切换** — 预设6种车漆 + 4种轮毂 + 4种玻璃，加自定义取色器
- 🔄 **3D 旋转观察** — Remotion Studio 中拖拽旋转/缩放，任意角度查看
- 📐 **专业打光** — 暗灰展示环境 + 柔光箱 + 轮廓光 + 网格地面
- 🎬 **可渲染视频** — 一键输出 MP4，直接用于评审汇报
- 🔧 **适配任意车型** — 换你的 FBX 模型，改个零件命名规则就能用

---

## 🚀 一键启动

### 前提

- [Node.js](https://nodejs.org/) 18+
- 一个 FBX 格式的3D车模

### 安装

```bash
git clone https://github.com/YOUR_USERNAME/car-showcase-skill.git
cd car-showcase-skill
npm install
```

### 放入你的模型

```bash
# 把你的 .fbx 文件复制到 public/models/
cp /path/to/your-car.fbx public/models/model.fbx
```

> 如果文件名不是 `model.fbx`，编辑 `src/CarShowcase/CarModel.tsx` 第21行改路径。

### 启动

```bash
npm run dev
```

浏览器打开 Remotion Studio → 选左侧 **CarShowcase** 组合 → 右下角点色块切换颜色 → 拖拽鼠标旋转观察。

### 导出图片/视频

```bash
# 导出一帧
npm run still

# 导出视频
npm run build
```

---

## 🎨 颜色通道

| 通道 | 预设 |
|------|------|
| **车身** | 冠军红 · 珍珠白 · 磁力黑 · Monterey蓝 · 铂金灰 · Chicane黄 |
| **轮毂/装饰** | 银灰 · 亮黑 · 金色 · 枪灰 |
| **玻璃** | 透明 · 浅蓝 · 浅绿 · 深色 |

每个通道末尾的 **+** 按钮可以打开系统取色器，输入任意自定义颜色。

---

## 🔧 适配你的车型

打开 `src/CarShowcase/CarModel.tsx`，你会看到顶部的 `CATEGORIES` 配置：

```ts
const CATEGORIES = {
  body: ['_mm_ext'],        // 车漆件
  glass: ['_mm_windows'],   // 玻璃
  lights: ['_mm_lights'],   // 灯具
  chrome: ['_mm_badges'],   // 镀铬
  wheel: ['_mm_wheel'],     // 轮毂
  tyre: ['_mm_tyre'],       // 轮胎
  // ...
};
```

把关键词改成你模型里对应的零件名即可。详细说明见 [public/models/README.md](public/models/README.md)。

---

## 📁 项目结构

```
car-showcase-skill/
├── src/
│   ├── index.ts                   # Remotion 入口
│   ├── Root.tsx                   # 注册 Composition
│   └── CarShowcase/
│       ├── index.ts               # 导出
│       ├── Scene.tsx              # 主场景：背景、环境贴图、相机
│       ├── CarModel.tsx           # 🔧 模型加载 + 零件分类 + 材质分配
│       ├── Ground.tsx             # 深灰网格地面 + 接地阴影
│       ├── Lighting.tsx           # 影棚打光（半球光+方向光+射灯）
│       ├── Materials.tsx          # 材质工厂（车漆/玻璃/镀铬/轮胎…）
│       └── ColorControls.tsx      # 颜色选择器 UI 覆盖层
├── public/
│   └── models/
│       └── README.md              # 模型准备指南
├── package.json
├── tsconfig.json
└── remotion.config.ts
```

---

## 🛠 技术栈

| 技术 | 用途 |
|------|------|
| [Remotion](https://remotion.dev) | React 视频框架，提供 Studio 预览 + 渲染管线 |
| [Three.js](https://threejs.org) | 3D 渲染引擎 |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | Three.js 的 React 声明式封装 |
| [@remotion/three](https://remotion.dev/docs/three) | Remotion 与 Three.js 的桥接 |
| [@react-three/drei](https://github.com/pmndrs/drei) | R3F 工具集（OrbitControls 等） |

---

## 🎬 构建历程

这个项目由 [Claude Code](https://claude.ai) 驱动开发。完整迭代过程：

1. **模型加载** — FBX 导入 + 零件自动分类 + 材质模板
2. **颜色控制** — React state 驱动的三通道实时换色
3. **灯光 v1** — 基础三点光，太暗
4. **灯光 v2** — 提亮环境光，但轮毂过曝变白盘
5. **灯光 v3** — 去雾恢复对比度，车漆通透感回来
6. **展示环境 v4** — 从浅灰影棚转为暗灰展示环境（对标 Three.js webgl_materials_car）
7. **精修 v5** — 网格可见性、fog 过渡、接地阴影、曝光微调

整个开发过程是"设计师说需求 → Claude Code 写代码 → 出图 → 设计师反馈 → 迭代"的闭环。**没有任何手动建模或调材质，全部通过代码驱动。**

---

## 📄 License

MIT — 随意使用、修改、商用。

---

## 🙋 FAQ

**Q: 只能用 FBX 吗？**
A: 当前默认 FBX。如果要 GLB/GLTF，改 `CarModel.tsx` 里的 Loader 即可（`useLoader(GLTFLoader, ...)`）。

**Q: 我的模型零件命名和示例不一样怎么办？**
A: 改 `CATEGORIES` 配置。匹配规则是 `零件名.toLowerCase().includes(关键词)`，非常灵活。

**Q: 能加更多颜色通道吗？**
A: 在 `ColorControls.tsx` 和 `Scene.tsx` 的 `CarColors` 类型里加新字段，在 `CarModel.tsx` 里加对应的 useMemo 材质即可。

**Q: 怎么改相机角度？**
A: `Scene.tsx` 里 `camera.position` 改默认视角，或者在 Studio 里拖拽旋转后截图记录参数。

---

*Built with [Claude Code](https://claude.ai) + [Remotion](https://remotion.dev) + [Three.js](https://threejs.org)*
