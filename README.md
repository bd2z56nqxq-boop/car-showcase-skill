# 🚗 Car Showcase Skill — 实时3D汽车颜色切换器

> 基于 Remotion + Three.js 的交互式汽车色彩评审工具。浏览器里点击色块，3D 车模实时换色。

---

## ⚡ Quick Start（小白版，4 步）

### 1. 安装 Node.js

去 [nodejs.org](https://nodejs.org) 下载 LTS 版本，一路 Next 安装。

装完后打开终端（Win+R 输入 `cmd`），验证：

```bash
node -v   # 应显示 v18 或更高
```

### 2. 克隆项目

```bash
git clone https://github.com/bd2z56nqxq-boop/car-showcase-skill.git
cd car-showcase-skill
```

### 3. 安装依赖

```bash
npm install
```

### 4. 启动

```bash
npm run dev
```

浏览器会自动打开 Remotion Studio。左侧选 **CarShowcase**，右下角点色块切换颜色。

> ⚠️ **因版权原因，本项目不提供 3D 车模文件。你需要自行准备一个 FBX 格式的车模。** 放到 `public/models/` 下，详见下方「放入你的模型」。

---

## ✨ 功能

- 🎨 **实时换色** — 车身、轮毂/镀铬装饰、玻璃三通道独立调色
- 🖱️ **点击切换** — 预设6种车漆 + 4种轮毂 + 4种玻璃，加自定义取色器
- 🔄 **3D 旋转观察** — Remotion Studio 中拖拽旋转/缩放，任意角度查看
- 📐 **专业打光** — 暗灰展示环境 + 柔光箱 + 轮廓光 + 网格地面
- 🎬 **可渲染视频** — 一键输出 MP4，直接用于评审汇报
- 🔧 **适配任意车型** — 换你的 FBX 模型，AI 帮你适配零件规则

---

## 🎨 颜色通道

| 通道 | 预设 |
|------|------|
| **车身** | 冠军红 · 珍珠白 · 磁力黑 · Monterey蓝 · 铂金灰 · Chicane黄 |
| **轮毂/装饰** | 银灰 · 亮黑 · 金色 · 枪灰 |
| **玻璃** | 透明 · 浅蓝 · 浅绿 · 深色 |

每个通道末尾的 **+** 按钮可以打开系统取色器，输入任意自定义颜色。

---

## 🔧 放入你的模型

### 准备模型

你需要一个 FBX 格式的 3D 车模文件。**因版权原因，本项目不提供示例模型，请自行准备。**

模型要求：
- 格式：`.fbx`（推荐），也支持 `.glb` / `.gltf`（需改 Loader）
- 面数：10万-50万（性能和质量的平衡点）
- 零件命名：最好有规律（如 `body_ext`, `wheel_front_left` 等），方便自动分类

### 放置文件

```bash
# 复制你的 FBX 到 public/models/
cp /your-car-model.fbx public/models/model.fbx
```

> 如果文件名不是 `model.fbx`，编辑 `src/CarShowcase/CarModel.tsx` 第 21 行，改 `MODEL_PATH`。

### 适配零件规则

打开 `src/CarShowcase/CarModel.tsx`，修改顶部的 `CATEGORIES` 配置：

```ts
const CATEGORIES = {
  body: ['_mm_ext'],        // 车漆件 → 关键词匹配
  glass: ['_mm_windows'],   // 玻璃
  lights: ['_mm_lights'],   // 灯具
  chrome: ['_mm_badges'],   // 镀铬
  wheel: ['_mm_wheel'],     // 轮毂
  tyre: ['_mm_tyre'],       // 轮胎
  rotor: ['_mm_rotor'],     // 刹车盘
  chassis: ['_mm_chassis'], // 底盘
  cab: ['_mm_cab'],         // 驾驶室
  interior: ['intlod'],     // 内饰
};
```

把关键词改成你模型里对应的零件名。匹配规则是 `零件名.toLowerCase().includes(关键词)`，不区分大小写。

详细说明见 [public/models/README.md](public/models/README.md)。

---

## 🤖 让 Claude Code 帮你适配模型

把下面的提示词直接发给 Claude Code，它会自动识别你的模型零件并修改配置：

```
我已经把一个 FBX 车模放到 public/models/model.fbx。

请帮我检查 src/CarShowcase/CarModel.tsx 里的 CATEGORIES 配置，
根据模型零件名称重新识别车漆、玻璃、轮毂、轮胎、灯具、镀铬件。

要求：
1. 车漆件可以响应 bodyColor；
2. 轮毂/镀铬件可以响应 accentColor；
3. 玻璃件可以响应 glassColor；
4. 轮胎保持黑色哑光；
5. 灯具保持透明或发光材质；
6. 修改后确保 npm run dev 可以正常预览。
```

---

## 🐛 常见报错

### 模型不显示（一片空白）

1. 检查 `public/models/model.fbx` 是否存在
2. 检查 `CarModel.tsx` 第 21 行 `MODEL_PATH` 是否与文件名一致
3. 打开浏览器控制台（F12 → Console），查看是否有红色的报错信息
4. 确认 FBX 文件没有损坏——用 Blender 或 FBX Review 打开试试

### 换了颜色，模型没反应

1. 确认你在 Remotion Studio 中选中的是 **CarShowcase** 组合
2. 检查 `CATEGORIES` 配置中的关键词是否匹配到了你的模型零件
3. 在 `CarModel.tsx` 中添加 `console.log(cat, name)` 来调试零件分类结果

### 轮毂变白盘（过曝）

这是因为轮毂金属度太高 + 环境光太强。编辑 `Materials.tsx`：

```ts
// createChromeMaterial 里降低这两项：
metalness: 0.88,         // 试试降到 0.7
roughness: 0.25,         // 试试升到 0.4
envMapIntensity: 0.9,    // 试试降到 0.6
```

### FBX 路径错误

错误信息类似 `Could not load ... /models/model.fbx`：

1. 确认文件在 `public/models/` 下（不是 `src/models/` 或项目根目录）
2. Facebook Remotion 的约定是 `public/` 下的文件通过 `staticFile()` 访问
3. 文件名大小写敏感——`Model.fbx` 和 `model.fbx` 是不同的

### npm install 失败

1. 确认 Node.js 版本 >= 18：`node -v`
2. 尝试删除 `node_modules` 和 `package-lock.json` 后重试：
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. 如果是网络问题，尝试切换 npm 镜像：
   ```bash
   npm config set registry https://registry.npmmirror.com
   ```

### Remotion Studio 打开后卡住

1. 确认没有其他程序占用 3000 端口
2. 尝试清除 Remotion 缓存：
   ```bash
   npx remotion studio --clear-cache
   ```

---

## 🎬 导出

```bash
# 导出一帧图片
npm run still

# 导出完整视频
npm run build
```

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

## 📄 License

MIT — 随意使用、修改、商用。

---

*Built with [Claude Code](https://claude.ai) + [Remotion](https://remotion.dev) + [Three.js](https://threejs.org)*
