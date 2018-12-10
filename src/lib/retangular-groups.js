
function createLinearAnimation (from, to, speed) {
  const [sx, sy] = from
  const [ex, ey] = to
  const dx = ex - sx
  const dy = ey - sy
  const dist = Math.sqrt(dx * dx + dy * dy)
  const time = dist / speed
  const animation = {
    location: to,
    animate: elapsedTime => {
      const pctComplete = elapsedTime / time
      if (pctComplete >= 1.0) {
        animation.location = to
        return true
      } else {
        animation.location = [sx + dx * pctComplete, sy + dy * pctComplete]
        return false
      }
    }
  }
  return animation
}

function findRectangularLocation (columns, rows, idx) {
  const r = Math.floor(idx / columns)
  const c = idx - (r * columns)
  return [c, r]
}

export class RectangularGroup {
  constructor (columns, rows) {
    this.columns = columns
    this.rows = rows
    this.area = columns * rows
    this.unitLocations = new Array(this.area)
    for (let i = 0; i < this.area; i++) {
      this.unitLocations[i] = findRectangularLocation(columns, rows, i)
    }
    this.animation = null
  }

  animate (elapsedTime) {
    if (this.animation) {
      const done = this.animation(elapsedTime)
      if (done) {
        this.animation = null
        return true
      }
      return false
    }
    return true
  }

  animateShape (cols, rows, speed) {
    if (cols * rows !== this.area) {
      throw new Error(`Invalid rectangle transformation: (${this.columns}x${this.rows}) => (${cols}x${rows}) changes the area`)
    }
    const unitAnimations = new Array(this.area)
    for (let i = 0; i < this.area; i++) {
      const [ey, ex] = findRectangularLocation(rows, cols, i)
      const end = [ex, ey]
      unitAnimations[i] = createLinearAnimation(this.unitLocations[i], end, speed)
    }
    this.animation = (elapsedTime) => {
      let notDone = false
      for (let i = 0; i < this.area; i++) {
        const unitDone = unitAnimations[i].animate(elapsedTime)
        notDone = notDone || !unitDone
        this.unitLocations[i] = unitAnimations[i].location
      }
      return !notDone
    }
  }
}
