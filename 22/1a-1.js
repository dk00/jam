const max = 1000000000
const maxComposite = (1 << 30) - 1
const feed = n =>
  [].concat(
    Array.from({length: 30}, (_, i) => 1 << i),
    Array.from({length: n - 30}, (_, i) => max - i)
  )

const solve = numbers => {
  const halfSum = numbers.reduce((sum, number) => sum + number) / 2
  numbers.sort((a, b) => b - a)
  const powers = feed(30)
  const reserved = powers.reduce((r, number) => {
    r[number] = true
    return r
  }, {})
  const {rest, items} = numbers.reduce(
    ({rest, items}, number) => {
      if (rest > maxComposite && number > rest) {
        console.error('!None')
        maxComposite.t()
      }
      return rest > maxComposite && !reserved[number]
        ? {
            rest: rest - number,
            items: items.concat(number),
          }
        : {rest, items}
    },
    {rest: halfSum, items: []}
  )

  return items.concat(powers.filter(number => rest & number))
}

const numberStream = stream => {
  const numbers = []
  const requests = []
  let buffer = ''
  stream.setEncoding('utf8')
  stream.on('data', data => {
    if (/[0-9]/.test(data.slice(-1)[0])) {
      buffer = buffer + data
    } else {
      ;(buffer + data)
        .trim()
        .split(/\s+/)
        .forEach(number => {
          if (requests.length > 0) {
            requests.shift()(number)
          } else {
            numbers.push(number)
          }
        })
    }
  })
  return () =>
    numbers.length > 0
      ? Promise.resolve(numbers.shift())
      : new Promise(resolve => requests.push(resolve))
}

const response = (...args) => {
  console.log(...args)
}

const main = async () => {
  console.error('start')
  const requestNumber = numberStream(process.stdin)
  const t = await requestNumber()

  for (let i = 0; i < t; i++) {
    console.error('Case #', i)
    const n = await requestNumber()
    const numbers = feed(n)
    response(numbers.join(' '))
    for (let j = 0; j < n; j++) {
      numbers.push(+await requestNumber())
    }
    const result = solve(numbers)
    const check = result.reduce((q, v) => {
      q[v] = (q[v] || 0) + 1 
      return q
    }, {})
    console.error(Object.entries(check).filter(([a, b]) => b  > 1))
    response(result.join(' '))
  }
  process.exit(0)
}

main()
