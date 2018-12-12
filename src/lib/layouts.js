function findBoundingBox (from, endBefore, locationSupplier) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (let i = from; i < endBefore; i++) {
    let [x, y] = locationSupplier(i)
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
  }
  return [[minX, minY], [maxX, maxY]]
}

export class Layout {
  getUnitLocation (index) { }

  getBoundingBox (from, endBefore) {
    return findBoundingBox(from, endBefore, index => this.getUnitLocation(index))
  }

  _derive (impl) {
    const derived = Object.create(this)
    return Object.assign(derived, impl)
  }

  translate (dx, dy) {
    return this._derive({
      getUnitLocation: index => {
        const [x, y] = this.getUnitLocation(index)
        return [x + dx, y + dy]
      },

      getBoundingBox: (...args) => {
        const [[minX, minY], [maxX, maxY]] = this.getBoundingBox(...args)
        return [[minX + dx, minY + dy], [maxX + dx, maxY + dy]]
      }
    })
  }

  transformIndex (xform) {
    const getUnitLocation = index => this.getUnitLocation(xform(index))
    return this._derive({
      getUnitLocation,
      getBoundingBox: (from, endBefore) => findBoundingBox(from, endBefore, getUnitLocation)
    })
  }

  yieldTo (layout, from = 0, endingBefore = Infinity) {
    const getUnitLocation = index => {
      if (index >= from && index < endingBefore) {
        return layout.getUnitLocation(index)
      }
      return this.getUnitLocation(index)
    }
    return this._derive({
      getUnitLocation,
      getBoundingBox: (from, endBefore) => findBoundingBox(from, endBefore, getUnitLocation)
    })
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
