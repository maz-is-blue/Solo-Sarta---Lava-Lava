export default function LavaWordmark({ size = 32, animate = false, style = {}, dark = false }) {
  const width = size * 2.73
  return (
    <img
      src={`${import.meta.env.BASE_URL}assets/lava-wordmark.png`}
      alt="Lava Lava"
      style={{
        width,
        height: 'auto',
        display: 'block',
        /* multiply removes white background on light/coloured backgrounds */
        mixBlendMode: dark ? 'normal' : 'multiply',
        filter: dark
          ? 'drop-shadow(0 0 10px rgba(139,111,184,0.5)) brightness(0) invert(1)'
          : 'none',
        animation: animate ? 'float 6s ease-in-out infinite' : 'none',
        ...style
      }}
    />
  )
}
