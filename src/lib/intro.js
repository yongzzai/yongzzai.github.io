// The opening sequence (components/Intro.jsx): a prompt bar types this, sends
// it, and the site appears as the answer.
export const INTRO_PROMPT = 'Who is Yongjae Lee?'

const SEEN_KEY = 'intro-seen'

// Only a plain first visit to the home page in this browser session gets it;
// deep links and visitors who prefer reduced motion go straight to the site.
export function shouldShowIntro({ pathname, hash, seen, reducedMotion }) {
  return pathname === '/' && !hash && !seen && !reducedMotion
}

export function introSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    // Storage blocked: the intro just plays again on the next visit.
  }
}
