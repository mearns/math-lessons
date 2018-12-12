export class Layout {
  getUnitLocation (index) { }
}

export class TranslatedLayout extends Layout {
  constructor (layout, dx, dy) {
    super()
    this._layout = layout
    this._dx = dx
    this._dy = dy
  }

  getUnitLocation (index) {
    const [x, y] = this._layout.getUnitLocation(index)
    return [x + this._dx, y + this._dy]
  }
}

export class ParitionedLayout extends Layout {
  constructor (firstLayout, secondLayout, startingAtIndex) {
    super()
    this._firstLayout = firstLayout
    this._secondLayout = secondLayout
    this._startingAtIndex = startingAtIndex
  }

  getUnitLocation (index) {
    if (index >= this._startingAtIndex) {
      return this._secondLayout.getUnitLocation(index - this._startingAtIndex)
    }
    return this._firstLayout.getUnitLocation(index)
  }
}

export class FixedColumnRectangularLayout extends Layout {
  constructor (columns) {
    super()
    this._columns = columns
  }

  getUnitLocation (index) {
    const row = Math.floor(index / this._columns)
    const col = index - (row * this._columns)
    return [col, row]
  }
}

export class UnitGroup {
  constructor (layout) {
    this._unitCount = 0
    this._targetLayout = null
    this._elapsedAnimationTime = 0
    this._animation = null
    this._unitLocations = []
    this._layout = layout
    this._dirty = false
  }

  transitionToLayout (newLayout, animation) {
    this._targetLayout = newLayout
    this._animation = animation
    this._elapsedAnimationTime = 0
    this._dirty = true
  }

  isStable () {
    return this._animation === null
  }

  tick (timeDelta) {
    if (!this.isStable()) {
      this._elapsedAnimationTime += timeDelta
      this._dirty = true
    }
  }

  getUnitLocations () {
    if (this._dirty) {
      this._update()
    }
    return this._unitLocations
  }

  _update () {
    this._unitLocations = new Array(this._unitCount)
    if (this._animation) {
      let more = false
      for (let i = 0; i < this._unitCount; i++) {
        const start = this._layout.getUnitLocation(i)
        const end = this._targetLayout.getUnitLocation(i)
        const res = this._animation(this._elapsedAnimationTime, start, end)
        this._unitLocations[i] = res.loc
        more = more || res.more
      }
      if (!more) {
        this._layout = this._targetLayout
        this._animation = null
        this._targetLayout = null
      }
    } else {
      for (let i = 0; i < this._unitCount; i++) {
        this._unitLocations[i] = this._layout.getUnitLocation(i)
      }
    }
    this._dirty = false
  }

  addUnits (count) {
    this._unitCount += count
    this._dirty = true
  }

  removeUnits (count) {
    if (count > this._unitCount) {
      throw new Error(`Cannot remove ${count} units from a group with only ${this._unitCount} units`)
    }
    this._unitCount -= count
    this._dirty = true
  }
}
