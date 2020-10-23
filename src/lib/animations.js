
function moreToCome (loc) {
  return { loc, more: true }
}

function endOfAnimation (loc) {
  return { loc, more: false }
}

export class Animation {
  tween (elaspedTime, from, to, index, count) { }

  _derive (impl) {
    const derived = Object.create(this)
    return Object.assign(derived, impl)
  }

  staggered (perIndex) {
    return this._derive({
      tween: (e, f, t, i, c) => this.tween(e - (i * perIndex), f, t, i, c)
    })
  }

  yieldTo (animation, from = 0, endingBefore = Infinity) {
    return this._derive({
      tween: (e, f, t, i, c) => {
        if (i >= from && i < endingBefore) {
          return animation.tween(e, f, t, i, c)
        }
        return this.tween(e, f, t, i, t)
      }
    })
  }

  transformIndex (xform) {
    return this._derive({
      tween: (e, f, t, i, c) => this.tween(e, f, t, xform(i), c)
    })
  }

  translate (dx, dy) {
    return this._derive({
      tween: (e, [sx, sy], [ex, ey], i, c) => this.tween(e, [sx + dx, sy + dy], [ex + dx, ey + dy], i, c)
    })
  }
}

export class LinearAnimation extends Animation {
  constructor (speed) {
    super()
    this._speed = speed
  }

  tween (elapsedTime, from, to) {
    const [sx, sy] = from
    const [ex, ey] = to
    if (ex === sx && ey === sy) {
      return endOfAnimation([sx, sy])
    }
    const dx = ex - sx
    const dy = ey - sy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const duration = dist / this._speed
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
