export default function ProductSilhouette({ type = 'slip', palette = ['#FF5A2C','#F08A8B','#EFA0BA'], width = 120, height = 180 }) {
  const id = `grad-${type}-${palette[0].replace('#','')}`
  const glow = `glow-${type}-${palette[0].replace('#','')}`

  const getPath = () => {
    const w = width, h = height, cx = w / 2
    switch (type) {
      case 'slip':
        return `M${cx-20},20 Q${cx-18},10 ${cx},8 Q${cx+18},10 ${cx+20},20 L${cx+28},${h-10} Q${cx},${h} ${cx-28},${h-10} Z`
      case 'minislip':
        return `M${cx-20},20 Q${cx-18},10 ${cx},8 Q${cx+18},10 ${cx+20},20 L${cx+24},${h*0.65} Q${cx},${h*0.72} ${cx-24},${h*0.65} Z`
      case 'maxi':
        return `M${cx-18},15 Q${cx-16},8 ${cx},6 Q${cx+16},8 ${cx+18},15 L${cx+32},${h-5} Q${cx},${h+2} ${cx-32},${h-5} Z`
      case 'crop':
        return `M${cx-30},10 L${cx+30},10 L${cx+28},${h*0.45} Q${cx},${h*0.5} ${cx-28},${h*0.45} Z`
      case 'offshoulder':
        return `M${cx-40},8 Q${cx},20 ${cx+40},8 L${cx+30},${h*0.42} Q${cx},${h*0.48} ${cx-30},${h*0.42} Z`
      case 'bodysuit':
        return `M${cx-22},8 Q${cx-20},4 ${cx},2 Q${cx+20},4 ${cx+22},8 L${cx+20},${h*0.55} Q${cx+16},${h*0.6} ${cx+12},${h*0.65} L${cx+12},${h*0.7} Q${cx},${h*0.72} ${cx-12},${h*0.7} L${cx-12},${h*0.65} Q${cx-16},${h*0.6} ${cx-20},${h*0.55} Z`
      case 'jacket':
        return `M${cx-10},5 L${cx-28},15 L${cx-30},${h*0.55} Q${cx},${h*0.58} ${cx+30},${h*0.55} L${cx+28},15 L${cx+10},5 Q${cx},10 ${cx-10},5 Z`
      case 'bomber':
        return `M${cx-8},5 L${cx-32},12 L${cx-32},${h*0.5} Q${cx},${h*0.55} ${cx+32},${h*0.5} L${cx+32},12 L${cx+8},5 Q${cx},8 ${cx-8},5 Z`
      case 'blazer':
        return `M${cx-10},5 L${cx-28},18 L${cx-26},${h*0.75} Q${cx},${h*0.78} ${cx+26},${h*0.75} L${cx+28},18 L${cx+10},5 Q${cx},10 ${cx-10},5 Z`
      case 'longcoat':
        return `M${cx-10},5 L${cx-30},20 L${cx-28},${h-8} Q${cx},${h-2} ${cx+28},${h-8} L${cx+30},20 L${cx+10},5 Q${cx},10 ${cx-10},5 Z`
      case 'set':
        return `M${cx-28},8 L${cx+28},8 L${cx+26},${h*0.38} Q${cx},${h*0.42} ${cx-26},${h*0.38} Z M${cx-24},${h*0.44} L${cx+24},${h*0.44} L${cx+28},${h*0.72} Q${cx},${h*0.76} ${cx-28},${h*0.72} Z`
      case 'skirtset':
        return `M${cx-26},8 L${cx+26},8 L${cx+24},${h*0.36} Q${cx},${h*0.40} ${cx-24},${h*0.36} Z M${cx-18},${h*0.42} L${cx+18},${h*0.42} L${cx+30},${h-8} Q${cx},${h-2} ${cx-30},${h-8} Z`
      default:
        return `M${cx-20},20 Q${cx},8 ${cx+20},20 L${cx+28},${h-10} Q${cx},${h} ${cx-28},${h-10} Z`
    }
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette[0]} stopOpacity="0.9" />
          <stop offset="50%" stopColor={palette[1]} stopOpacity="0.85" />
          <stop offset="100%" stopColor={palette[2]} stopOpacity="0.8" />
        </linearGradient>
        <filter id={glow}>
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d={getPath()} fill={`url(#${id})`} opacity="0.9" filter={`url(#${glow})`} />
      {[...Array(5)].map((_, i) => (
        <circle
          key={i}
          cx={20 + i * (width / 5)}
          cy={30 + (i % 3) * 40}
          r={1.5}
          fill="white"
          opacity={0.4 + i * 0.1}
          style={{ animation: `sparkle ${1.5 + i * 0.3}s ${i * 0.2}s ease-in-out infinite` }}
        />
      ))}
    </svg>
  )
}
