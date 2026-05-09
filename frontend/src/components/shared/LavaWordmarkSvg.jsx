/**
 * Inline SVG recreation of the Lava Lava wordmark.
 * Uses Dancing Script (loaded via Google Fonts in index.html).
 * No background, fully scalable, crisp at any size.
 */
export default function LavaWordmarkSvg({ height = 50, style = {}, animate = false }) {
  const aspectRatio = 460 / 108
  const width = height * aspectRatio

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 460 108"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'block',
        animation: animate ? 'float 6s ease-in-out infinite' : 'none',
        ...style
      }}
    >
      <defs>
        {/* Warm peach-orange for left "Lava" */}
        <linearGradient id="ll-warm" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#F8D898" />
          <stop offset="100%" stopColor="#F0A868" />
        </linearGradient>

        {/* Purple-violet for right "Lava" */}
        <linearGradient id="ll-cool" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#8B58CC" />
          <stop offset="100%" stopColor="#C0A0F0" />
        </linearGradient>

        {/* Purple underline gradient */}
        <linearGradient id="ll-line-purple" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#9B6FCC" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#9B6FCC" stopOpacity="0.3" />
        </linearGradient>

        {/* Peach underline gradient */}
        <linearGradient id="ll-line-peach" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#F0A868" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F0A868" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* ── Left "Lava" — warm peach/orange ── */}
      <text
        x="4"
        y="78"
        fontFamily="'Dancing Script', cursive"
        fontSize="76"
        fontWeight="600"
        fill="url(#ll-warm)"
      >
        Lava
      </text>

      {/* ── Right "Lava" — purple/violet ── */}
      <text
        x="228"
        y="78"
        fontFamily="'Dancing Script', cursive"
        fontSize="76"
        fontWeight="600"
        fill="url(#ll-cool)"
      >
        Lava
      </text>

      {/* ── Underline: purple sweep (left word → right) ── */}
      <path
        d="M 8,88 Q 80,106 175,89 Q 255,74 345,89"
        stroke="url(#ll-line-purple)"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Underline: peach sweep (right word, slightly higher) ── */}
      <path
        d="M 55,94 Q 160,110 285,94 Q 340,88 390,93"
        stroke="url(#ll-line-peach)"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Dashed extension to button ── */}
      <line
        x1="390" y1="93"
        x2="424" y2="93"
        stroke="#C8C8C8"
        strokeWidth="1"
        strokeDasharray="3 3"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* ── Sewing button icon ── */}
      {/* Outer circle */}
      <circle cx="436" cy="94" r="13" stroke="#C0C0C0" strokeWidth="1.3" fill="none" opacity="0.85" />
      {/* Inner ring */}
      <circle cx="436" cy="94" r="8.5" stroke="#D8D8D8" strokeWidth="0.8" fill="none" opacity="0.6" />
      {/* Four holes */}
      <circle cx="432.5" cy="90.5" r="2"   fill="#C8C8C8" opacity="0.9" />
      <circle cx="439.5" cy="90.5" r="2"   fill="#C8C8C8" opacity="0.9" />
      <circle cx="432.5" cy="97.5" r="2"   fill="#C8C8C8" opacity="0.9" />
      <circle cx="439.5" cy="97.5" r="2"   fill="#C8C8C8" opacity="0.9" />
      {/* Thread cross */}
      <line x1="432.5" y1="90.5" x2="439.5" y2="97.5" stroke="#B0B0B0" strokeWidth="0.7" opacity="0.5" />
      <line x1="439.5" y1="90.5" x2="432.5" y2="97.5" stroke="#B0B0B0" strokeWidth="0.7" opacity="0.5" />
    </svg>
  )
}
