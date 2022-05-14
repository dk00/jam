const solve = ({exercises}) => {
  const baseInfo = {}
  Array.from({length: exercises.length}, (_, start) => {
    let base = exercises[start]
    exercises.slice(start + 1).forEach((set, index) => {
      base = base.map((count, i) => Math.min(count, set[i]))
      baseInfo[`${start}-${start + 1 + index}`] = base.reduce((a, b) => a + b)
    })
  })
  const memo = {}

  const maxShared = (start, end) => {
    if (memo[`${start},${end}`]) {
      return memo[`${start},${end}`]
    }
    if (start === end) {
      memo[`${start},${end}`] = 0
      return memo[`${start},${end}`]
    }
    memo[`${start},${end}`] =
      baseInfo[`${start}-${end}`] +
      Math.max(
        ...Array.from(
          {length: end - start},
          (_, index) =>
            maxShared(start, start + index) + maxShared(start + index + 1, end)
        )
      )
    return memo[`${start},${end}`]
  }
  const ans =
    2 *
    ([].concat(...exercises).reduce((a, b) => a + b) -
      maxShared(0, exercises.length - 1))
  return ans
}

const parseLine = (line, fn) => line.split(' ').map(fn)

const parse = input => {
  const lines = input.split('\n')

  const readCases = lines => {
    if (lines.length < 1) {
      return []
    }
    const [e] = parseLine(lines[0], v => +v)
    return [
      {
        exercises: lines.slice(1, 1 + e).map(line => parseLine(line, v => +v)),
      },
    ].concat(readCases(lines.slice(1 + e)))
  }
  return readCases(lines.slice(1))
}

const format = result => result

const main = data => {
  const cases = parse(data.trim())
  cases.forEach((data, index) =>
    console.log(`Case #${index + 1}:`, format(solve(data)))
  )
}

main(require('fs').readFileSync(0, 'utf-8'))
