
function createLinearAnimation (from, to, speed) {
  const [sx, sy] = from
  const [ex, ey] = to
  const dx = ex - sx
  const dy = ey - sy
  const dist = Math.sqrt(dx * dx + dy * dy)
  const time = dist / speed
  const animation = (elapsedTime) => {
    const pctComplete = elapsedTime / time
    if (pctComplete >= 1.0) {
      animation.location = to
      return true
    } else {
      animation.location = [sx + dx * pctComplete, sy + dy * pctComplete]
      return false
    }
  }
  return animation
}

function findRectangularLocation (columns, rows, idx) {
  const r = Math.floor(idx / columns)
  const c = idx - (r * columns)
  return [c, r]
}

export function createRectangularGroupAnimation (from, to, speed) {
  const area = from[0] * from[1]
  if (to[0] * to[1] !== area) {
    throw new Error('Invalid rectangle transformation')
  }
  const unitAnimations = new Array(area)
  const unitLocations = new Array(area)
  for (let i = 0; i < area; i++) {
    const start = findRectangularLocation(...from, i)
    const [ey, ex] = findRectangularLocation(to[1], to[0], i)
    const end = [ex, ey]
    unitLocations[i] = start
    unitAnimations[i] = createLinearAnimation(start, end, speed)
  }
  const animation = (elapsedTime) => {
    let notDone = false
    for (let i = 0; i < area; i++) {
      const unitDone = unitAnimations[i](elapsedTime)
      notDone = notDone || !unitDone
      animation.unitLocations[i] = unitAnimations[i].location
    }
    return !notDone
  }
  animation.unitLocations = unitLocations
  return animation
}
