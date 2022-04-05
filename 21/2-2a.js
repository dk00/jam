const matrygon = {}
const hash = {}
const mem = {}

const prepare = n => {
  const fill = (sides, total, depth) => {
    const key = `${total}-${sides}`
    if (total > n || hash[key] >= depth) {
      return
    }
    hash[key] = depth
    matrygon[total] = Math.max(matrygon[total] || 1, depth)
    for (let j = 2; total + sides * j <= n; j++) {
      fill(sides * j, total + sides * j, depth + 1)
    }
  }

  for (let i = 1; i <= n; i++) {
    fill(i, i, 1)
  }
}

// 1, 2, 8, 16, 48
// 1, 2, 8 |  1, 2, 6

// [8, 11] [6, 9]
// 3, 12, 24

const solve1 = (sides, nested) => {
  const factors = []
    if (nested && sides > 4 && sides % 2 === 0) {
      factors.push(2)
    }
  for (let i = 3; sides / i > 2; i ++) {
    if (sides % i === 0) {
      factors.push(i)
    }
  }
  const result = 1 + Math.max(0, ...factors.map(f => solve1((sides - f) / f, true)))
  if (nested && sides <= 1000) {
    mem[sides] = result
  }
  return result
}
const solve = x => {
  const rec = {
    len: 0
  }
  const searchx = (total, path) => {
    let res = 1
    for (let j = 2; total / j > 2; j++) {
      if (total % j === 0) {
        const cur = searchx(total / j - 1, path.concat([[total, j]])) + 1
        res = Math.max(cur, res)
      }
    }
    if (path.length > rec.len) {
      rec.len = path.length
      rec.path = path
    }
    return res
  }

  let res = 1
  for (let r = 3; r * r <= x; r++) {
    if (x % r === 0) {
      res = Math.max(res, 1 + searchx(x / r - 1, [[x/r -1, r]]), 1 + searchx(r - 1, [r - 1, x/r]))
    }
  }
  return res
}

const parse = input => {
  const lines = input.split('\n')
  return lines.slice(1).map(it => +it)
}

const format = x => x

const main = data => {
  for (let i = 1; i < 15500; i++) {
    const a = [solve(i), solve1(i)]
    if (a[0] != a[1])
      console.log(i, ...a)
  }
  const cases = parse(data.trim())
  cases.forEach((data, index) => console.log(
    `Case #${index+1}:`, format(solve(data))
  ))
}

main(require('fs').readFileSync(0, 'utf-8'))
