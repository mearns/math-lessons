
function moreToCome (loc) {
  return { loc, more: true }
}

function endOfAnimation (loc) {
  return { loc, more: false }
}

export function createLinearAnimation (speed) {
  return (elapsedTime, from, to) => {
    const [sx, sy] = from
    const [ex, ey] = to
    if (ex === sx && ey === sy) {
      return endOfAnimation([sx, sy])
    }
    const dx = ex - sx
    const dy = ey - sy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const duration = dist / speed
    const pctComplete = elapsedTime / duration
    if (pctComplete >= 1.0) {
      return endOfAnimation([ex, ey])
    } else if (pctComplete <= 0.0) {
      return moreToCome([sx, sy])
    } else {
      return moreToCome([sx + dx * pctComplete, sy + dy * pctComplete])
    }
  }
}
