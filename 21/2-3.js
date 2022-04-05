const comment = (...messages) => console.log(...messages)

const bits = 18
const M = 1000000007n

const mul = (...values) => {
  return values.reduce((product, value) => (product * value) % M, 1n)
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

const asc = gen => (...args) => {
  const it = gen(...args)

  return new Promise(resolve => {
    const feed = last => {
      const {value, done} = it.next(last)
      if (done) {
        resolve(value)
      } else {
        value.then(resolved => feed(resolved))
      }
    }
    feed()
  })
}

const solve = visible => {
  const rangeMin = {}
  const smaller = (a, b = a) => (visible[a] <= visible[b] ? a : b)
  visible.forEach((_, i) =>
    Array.from({length: bits}, (_, rank) => {
      const key = `${(i >> rank) << rank}-${1 << rank}`
      rangeMin[key] = smaller(i, rangeMin[key])
    })
  )
  const getOrders = asc(function* (start, end) {
    if (end - start < 2) {
      return Promise.resolve(1n)
    }
    const left = Array.from({length: bits}).reduce(
      (current, _, rank) => {
        const next = current.index + (1 << rank)
        if (next < end && current.index & (1 << rank)) {
          return {
            index: next,
            largest: smaller(
              rangeMin[`${current.index}-${1 << rank}`],
              current.largest
            ),
          }
        }
        return current
      },
      {index: start, largest: start}
    )
    const res = Array.from({length: bits}).reduce((current, _, rank) => {
      const key = `${current.index}-${1 << (17 - rank)}`
      const next = current.index + (1 << (17 - rank))
      if (key in rangeMin && next <= end + 1) {
        return {
          index: next,
          largest: smaller(rangeMin[key], current.largest),
        }
      }
      return current
    }, left)

    const {largest} = res
    if (end % 5000 === 0) {
      console.log(end)
    }
    return mul(
      comb(end - start, largest - start),
      yield Promise.resolve().then(() => getOrders(start, largest - 1)),
      yield Promise.resolve().then(() => getOrders(largest + 1, end))
    )
  })
  return getOrders(0, visible.length - 1)
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

const main = asc(function* (data) {
  console.log(comb(100000, 50000))
  const cases = parse(data.trim())
  for (let index = 0; index < cases.length; index++) {
    console.log(`Case #${index + 1}:`, format(yield solve(cases[index])))
  }
  console.log(
    `Case #${9}:`,
    format(
      yield solve(
        Array.from({length: 100000}, (_, i) => Math.floor(1 + i / 99900))
      )
    )
  )
})
/*

 a
 *         * 
 *    *    *    *
 * *  * *  a *  * *
 **** **** *a** ****
             q

 9-9 9
 8-9 9
 0-7 9

 2 8
 4 8
 8 0
*/
main(require('fs').readFileSync(0, 'utf-8'))
