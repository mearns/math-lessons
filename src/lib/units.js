import ExtrinsicPromise from 'extrinsic-promises'

export class UnitGroup {
  constructor (layout) {
    this._unitCount = 0
    this._targetLayout = null
    this._elapsedAnimationTime = 0
    this._animation = null
    this._transitionPromise = null
    this._unitLocations = []
    this._layout = layout
    this._dirty = false
  }

  transitionToLayout (newLayout, animation) {
    this._targetLayout = newLayout
    this._animation = animation
    this._elapsedAnimationTime = 0
    this._dirty = true
    this._transitionPromise = new ExtrinsicPromise()
    return this._transitionPromise.hide()
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
        this._transitionPromise.fulfill(this)
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
