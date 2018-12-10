import PropsModel from 'props-model'
import EventEmitter from 'events'

function calculateUnitLocations ([columns, rows]) {
  const count = columns * rows
  const positions = new Array(count)
  let i = 0
  let c, r
  for (r = 0; r < rows; r++) {
    for (c = 0; c < columns; c++) {
      positions[i] = [c, r]
      i++
    }
  }
  return positions
}

export default function createRectangularGroup (columns, rows) {
  const props = new PropsModel(new EventEmitter())
    .defineProp('dimensions', [columns, rows])
    .defineDerivedProp('unitLocations', ['dimensions'], calculateUnitLocations)

  return props.getStandardPublicApi()
}
