/**
 * 预设颜色方案
 */
export const BODY_COLORS = [
  { label: '冠军红', value: '#c42828' },
  { label: '珍珠白', value: '#f0ead6' },
  { label: '磁力黑', value: '#1a1a1a' },
  { label: ' Monterey 蓝', value: '#2a4a7f' },
  { label: '铂金灰', value: '#7a7a7a' },
  { label: ' Chicane 黄', value: '#e8c840' },
];

export const DETAILS_COLORS = [
  { label: '银灰', value: '#cccccc' },
  { label: '亮黑', value: '#222222' },
  { label: '金色', value: '#d4a840' },
  { label: '枪灰', value: '#555555' },
];

export const GLASS_COLORS = [
  { label: '透明', value: '#ffffff' },
  { label: '浅蓝', value: '#88bbdd' },
  { label: '浅绿', value: '#88cc99' },
  { label: '深色', value: '#333333' },
];

export type CarColors = {
  body: string;
  details: string;
  glass: string;
};

interface ColorControlsProps {
  colors: CarColors;
  onColorsChange: (colors: CarColors) => void;
}

/**
 * 颜色选择器 UI
 * 作为 HTML 覆盖层显示在 Three.js 场景之上
 * 在 Remotion Studio 中交互式调整颜色
 */
export function ColorControls({ colors, onColorsChange }: ColorControlsProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 30,
        alignItems: 'flex-start',
        fontFamily: 'system-ui, sans-serif',
        color: '#fff',
        zIndex: 10,
      }}
    >
      {/* 车身颜色 */}
      <ColorGroup
        label="车身"
        colors={BODY_COLORS}
        selected={colors.body}
        onChange={(val) => onColorsChange({ ...colors, body: val })}
      />

      {/* 轮毂/装饰 */}
      <ColorGroup
        label="轮毂/装饰"
        colors={DETAILS_COLORS}
        selected={colors.details}
        onChange={(val) => onColorsChange({ ...colors, details: val })}
      />

      {/* 玻璃 */}
      <ColorGroup
        label="玻璃"
        colors={GLASS_COLORS}
        selected={colors.glass}
        onChange={(val) => onColorsChange({ ...colors, glass: val })}
      />
    </div>
  );
}

function ColorGroup({
  label,
  colors,
  selected,
  onChange,
}: {
  label: string;
  colors: { label: string; value: string }[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: 13,
          marginBottom: 8,
          opacity: 0.7,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {colors.map((c) => (
          <button
            key={c.value}
            title={c.label}
            onClick={() => onChange(c.value)}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: selected === c.value ? '2px solid #fff' : '2px solid rgba(255,255,255,0.2)',
              backgroundColor: c.value,
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.15s',
              boxShadow:
                selected === c.value
                  ? '0 0 12px rgba(255,255,255,0.3)'
                  : 'none',
            }}
          />
        ))}
        {/* Native color picker for custom color */}
        <label
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '2px dashed rgba(255,255,255,0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            color: 'rgba(255,255,255,0.5)',
            position: 'relative',
            overflow: 'hidden',
          }}
          title="自定义颜色"
        >
          +
          <input
            type="color"
            value={selected}
            onChange={(e) => onChange(e.target.value)}
            style={{
              position: 'absolute',
              width: 40,
              height: 40,
              opacity: 0,
              cursor: 'pointer',
              top: -6,
              left: -6,
            }}
          />
        </label>
      </div>
    </div>
  );
}
