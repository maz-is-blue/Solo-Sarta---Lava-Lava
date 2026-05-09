export default function LavaGlass({ children, style = {}, className = '', ...props }) {
  return (
    <div
      className={className}
      style={{
        background: 'rgba(255,255,255,0.10)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 24,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  )
}
