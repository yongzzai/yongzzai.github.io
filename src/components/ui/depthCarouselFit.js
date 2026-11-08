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
// shrank the cards well below what the container could hold. Vertically the
// front card is the tallest thing (the rest sit further back), so the height
// only has to hold it.
export function fitScale(width, height, config) {
  const byWidth = width / (2 * stackReach(config) + 24)
  const byHeight = height / (config.cardHeight + 20)
  return Math.min(Math.max(Math.min(byWidth, byHeight), 0.4), 1)
}

// Where to put a card that is d steps behind the front one (negative: already
// past it, fading out as it comes toward the viewer). A card is visible from
// just past the front (opacity 1 + d) to visibleCards behind it. The rest are
// invisible but still laid out every frame, and left at their real offset the
// ones far past the front would keep coming forward until they reach the
// camera (translateZ = perspective), where the browser projects them to tens
// of thousands of pixels and rasterises that. So they are hidden and parked
// just outside the visible range; the visible ones keep their real offset.
export function placeCard(d, { visibleCards }) {
  const visible = d > -1 && d <= visibleCards + 0.5
  return { offset: Math.min(Math.max(d, -1), visibleCards + 1), visible }
}
