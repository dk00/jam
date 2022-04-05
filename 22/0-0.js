const comment = (...messages) => console.log(...messages)

const repeatPattern = (elements, length) =>
  [].concat(...Array.from({length}, () => elements), elements[0])

const solve = ([r, c]) => {
  const lines = repeatPattern(
    [
      repeatPattern(['+', '-'], c).join(''),
      repeatPattern(['|', '.'], c).join(''),
    ],
    r
  )

  return ['..' + lines[0].slice(0, -2), '..' + lines[1].slice(0, -2)].concat(
    lines.slice(2)
  )
}

const parseLine = (line, fn) => line.split(' ').map(fn)

const parse = input => {
  const lines = input.split('\n')
  return lines.slice(1).map(line => parseLine(line, v => +v))
}

const format = result => '\n' + [].concat(result).join('\n')

const main = data => {
  const cases = parse(data.trim())
  cases.forEach((data, index) =>
    console.log(`Case #${index + 1}:`, format(solve(data)))
  )
}

main(require('fs').readFileSync(0, 'utf-8'))
