const solve = (sides, nested) => {
  const factors = []
    if (nested && sides > 4 && sides % 2 === 0) {
      factors.push(2)
    }
  for (let i = 3; sides / i > 2; i ++) {
    if (sides % i === 0) {
      factors.push(i)
    }
  }
  const result = 1 + Math.max(0, ...factors.map(f => solve(sides / f - 1, true)))
  return result
}

const parse = input => {
  const lines = input.split('\n')

  return lines.slice(1).map(v => +v)
}

const format = result => [].concat(result).join(' ')

const main = data => {
  const cases = parse(data.trim())
  cases.forEach((data, index) =>
    console.log(`Case #${index + 1}:`, format(solve(data)))
  )
}

main(require('fs').readFileSync(0, 'utf-8'))
