const solve = printers => {
  const sum = 10 ** 6
  const ink = printers.reduce((ink, current) =>
    ink.map((units, color) => Math.min(units, current[color]))
  )

  return ink.reduce((a, b) => a + b) < sum
    ? 'IMPOSSIBLE'
    : ink.reduce(
        ({items, rest}, current) => ({
          items: items.concat(Math.min(rest, current)),
          rest: rest - Math.min(rest, current),
        }),
        {items: [], rest: sum}
      ).items
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
