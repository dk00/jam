const solve = dices =>
  dices
    .sort((a, b) => a - b)
    .reduce((len, current) => (current > len ? len + 1 : len), 0)

const groupLines = (lines, size) =>
  Array.from({length: lines.length / size}, (_, i) =>
    lines.slice(i * size, i * size + size)
  )

const parseLine = (line, fn) => line.split(' ').map(fn)

const parse = input =>
  groupLines(input.split('\n').slice(1), 2).map(rows =>
    parseLine(rows[1], v => +v)
  )

const format = result => result

const main = data => {
  const cases = parse(data.trim())
  cases.forEach((data, index) =>
    console.log(`Case #${index + 1}:`, format(solve(data)))
  )
}

main(require('fs').readFileSync(0, 'utf-8'))
