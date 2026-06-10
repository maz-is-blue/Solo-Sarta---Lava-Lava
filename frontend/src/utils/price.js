export const formatPrice = (priceUsd, priceEgp = null) => {
  const usd = Number(priceUsd).toLocaleString()
  if (!priceEgp) return `$${usd}`
  const egp = Number(priceEgp).toLocaleString()
  return `$${usd} / ${egp} جنيه`
}
