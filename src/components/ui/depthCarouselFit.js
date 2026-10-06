// Sizing for DepthCarousel, kept out of the component so it can be unit tested.

// How far the card stack reaches from the centre of the front card: either the
// front card's own half width, or the furthest visible card behind it, which
// sits spread*d to the side and depth*d back, shrunk by perspective.
export function stackReach({ cardWidth, spread, depth, perspective, visibleCards }) {
  const half = cardWidth / 2
  let reach = half
  for (let d = 1; d <= visibleCards; d++) {
    const k = perspective / (perspective + depth * d)
    reach = Math.max(reach, (Math.abs(spread) * d + half) * k)
  }
  return reach
}

// The stack is centred on the front card, so it needs twice its reach (plus a
// little air). Upstream reserved cardWidth + 2 * spread + 120 instead, which
// shrank the cards well below what the container could hold.
export function fitScale(width, config) {
  const needed = 2 * stackReach(config) + 24
  return Math.min(Math.max(width / needed, 0.4), 1)
}
