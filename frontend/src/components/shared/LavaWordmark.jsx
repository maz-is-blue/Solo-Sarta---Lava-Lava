export default function LavaWordmark({ size = 32, animate = false, style = {} }) {
  const width = size * 2.73
  return (
    <img
      src={`${import.meta.env.BASE_URL}assets/lava-logo-final.png`}
      alt="Lava Lava"
      style={{
        width,
        height: 'auto',
        display: 'block',
        objectFit: 'contain',
        animation: animate ? 'float 6s ease-in-out infinite' : 'none',
        ...style
      }}
    />
  )
}
