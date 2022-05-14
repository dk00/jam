const solve = str =>
  str
    .split('')
    .reduce(
      (result, letter, i) =>
        result +
        letter +
        (letter + str.slice(i + 1) < str.slice(i + 1) ? letter : '')
    , '')

const parse = input => {
  const lines = input.split('\n')

  return lines.slice(1)
}

const format = result => [].concat(result).join(' ')

const main = data => {
  const cases = parse(data.trim())
  cases.forEach((data, index) =>
    console.log(`Case #${index + 1}:`, format(solve(data)))
  )
}

main(require('fs').readFileSync(0, 'utf-8'))
