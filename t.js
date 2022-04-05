const comment = (...messages) => console.log(...messages)

const solve = data => {
  return
}

const groupLines = (lines, size) =>
  Array.from({length: lines.length / size}, (_, i) =>
    lines.slice(i * size, i * size + size)
  )

const parseLine = (line, fn) => line.split(' ').map(fn)

const parse = input => {
  const lines = input.split('\n')

  return groupLines(lines.slice(1), 3).map(rows =>
    rows.map(row => parseLine(row, v => +v))
  )
}

const format = result => [].concat(result).join(' ')

const main = data => {
  const cases = parse(data.trim())
  cases.forEach((data, index) =>
    console.log(`Case #${index + 1}:`, format(solve(data)))
  )
}

main(require('fs').readFileSync(0, 'utf-8'))
