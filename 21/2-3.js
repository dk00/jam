const one = 1n
const M = 1000000007n

const mul = (...values) => {
  return values.reduce((product, value) => (product * value) % M, one)
}
const prepare = () => {
  const primes = [2]
  const isPrime = n => primes.every(p => n % p !== 0)
  for (i = 3; i <= 320; i += 2) {
    if (isPrime(i)) primes.push(i)
  }
  const addFactors = (factors, n, r = 1) => {
    for (i = 0; primes[i] <= n; i++) {
      while (n % primes[i] === 0) {
        factors[primes[i]] = (factors[primes[i]] || 0) + r
        n /= primes[i]
      }
    }
    factors[n] = factors[n] || 0 + r
  }

  return (n, k) => {
    const b = Math.min(k, n - k)
    const factors = {}
    Array.from({length: b}, (_, i) => {
      addFactors(factors, n - i)
      addFactors(factors, 1 + i, -1)
    })
    return mul(
      ...[].concat(
        ...Object.entries(factors).map(([f, c]) =>
          Array.from({length: c}, () => BigInt(f))
        )
      )
    )
  }
}

const comb = prepare()

const solve = visible => {
  if (visible.some((current, i) => current > visible[i - 1] + 1)) {
    return 0
  }
  const split = visible.map(() => ({}))
  visible.reduce((stack, current, i) => {
    while (stack.length > 0 && current <= visible[stack[0]]) {
      stack.shift()
    }
    split[i].left = (stack[0] >= 0 ? stack[0] : -1) + 1
    stack.unshift(i)
    return stack
  }, [])
  visible.reduceRight((stack, current, i) => {
    while (stack.length > 0 && current < visible[stack[0]]) {
      stack.shift()
    }
    split[i].right = (stack[0] || visible.length) - 1
    stack.unshift(i)
    return stack
  }, [])
  return split.reduce(
    (product, {left, right}, i) => mul(product, comb(right - left, right - i)),
    one
  )
}

const groupLines = (lines, size) =>
  Array.from({length: lines.length / size}, (_, i) =>
    lines.slice(i * size, i * size + size)
  )

const parseLine = (line, fn) => line.split(' ').map(fn)

const parse = input => {
  const lines = input.split('\n')

  return groupLines(lines.slice(1), 2).map(rows => parseLine(rows[1], v => +v))
}

const format = result => [].concat(result).join(' ')

const main = data => {
  const cases = parse(data.trim())
  for (let index = 0; index < cases.length; index++) {
    console.log(`Case #${index + 1}:`, format(solve(cases[index])))
  }
}

main(require('fs').readFileSync(0, 'utf-8'))
process.exit(0)