const oppsite = {
  u: 'd',
  r: 'l',
  d: 'u',
  l: 'r'
}

const directions = 'urdl'.split('')

const add = (a, b) => a + b

const getElminated = (positions, {values, neighbor}) =>
  positions.filter(p => {
    const levels = directions.map(d => values[neighbor[`${d}${p}`]]).filter(Boolean)
    return levels.length > 0 && values[p] * levels.length < levels.reduce(add, 0)
  })

const updateNeighbor = (neighbor, {values, position, direction}) => {
  const key = `${direction}${position}`
  const next = neighbor[key]
  if (!next || values[next] > 0) return next
  return neighbor[key] = updateNeighbor(neighbor, {values, position: next, direction})
}

const solve = floor => {
  const height = floor.length
  const width = floor[0].length
  const up = (i, j) =>
    i > 0 ? `${i-1}.${j}` : ''
  const right = (i, j) =>
    j + 1 < width ? `${i}.${j+1}` : ''
  const down = (i, j) =>
    i + 1 < height ? `${i+1}.${j}` : ''
  const left = (i, j) =>
    j > 0 ? `${i}.${j-1}` : ''

  let floorSum = floor.map(row => row.reduce(add)).reduce(add)
  let interestLevel = BigInt(floorSum)
  const values = {}
  const neighbor = {}

  floor.forEach((row, i) => {
    row.forEach((cell, j) => {
      values[`${i}.${j}`] = cell
      neighbor[`u${i}.${j}`] = up(i, j)
      neighbor[`r${i}.${j}`] = right(i, j)
      neighbor[`d${i}.${j}`] = down(i, j)
      neighbor[`l${i}.${j}`] = left(i, j)
    })
  })

  const positions = [].concat(
    ...floor.map((row, i) =>  row.map((cell, j) => `${i}.${j}`))
  )

  let eliminated = getElminated(positions, {values, neighbor})

  while (eliminated.length > 0) {
    const next = {}
    eliminated.forEach(p =>{
      floorSum -= values[p]
      values[p] = 0
    })
    interestLevel += BigInt(floorSum)
    eliminated.forEach(p =>
      directions.forEach(d => {
        updateNeighbor(neighbor, {values, position: neighbor[`${d}${p}`], direction: oppsite[d]})
      })
    )

    eliminated.forEach(p =>
      directions.forEach(d => {
        const q = neighbor[`${d}${p}`]
        q && values[q] > 0 && (next[q] = 1)
      })
    )

    eliminated = getElminated(Object.keys(next), {values, neighbor})
  }

  return interestLevel
}

const parse = input => {
  const lines = input.split('\n')
  const readBlocks = lines => {
    const rows = +lines[0].split(' ')[0]
    return [].concat(
      [lines.slice(1, 1 + rows).map(row => row.split(' ').map(v => +v))],
      lines.length > 1 + rows ? readBlocks(lines.slice(1 + rows)): []
    )
  }
  return readBlocks(lines.slice(1))
}

const format = result => result.toString()

const collect = stream => new Promise((resolve, reject) => {
  const buffer = []
  stream.setEncoding('utf8')
  stream.on('data', data => buffer.push(data))
  stream.on('end', () => resolve(buffer.join('')))
})

const main = data => {
  const cases = parse(data.trim())
  cases.forEach((data, index) => console.log(
    `Case #${index+1}:`, format(solve(data))
  ))
}

collect(process.stdin).then(main).catch(r => console.log(r))
