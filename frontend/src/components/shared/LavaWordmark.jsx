import LavaWordmarkSvg from './LavaWordmarkSvg'

export default function LavaWordmark({ size = 32, animate = false, style = {} }) {
  return <LavaWordmarkSvg height={size} animate={animate} style={style} />
}
