const solve = async ({n, k, start, walk, teleport}) => {
  const highSamples = {}
  const flatSamples = []
  const list = Array.from({length: n}, (_, i) => i)
  Array.from({length: n * 3}).forEach(() => {
    const i = Math.floor(Math.random() * n)
    const j = Math.floor(Math.random() * n)
    ;[list[i], list[j]] = [list[j], list[i]]
  })
  while (k > 0) {
    k -= 1
    const another = await walk()
    highSamples[another.room] = +another.passages
    if (k > 0 && list.length > 0) {
      next = list.shift()
      k -= 1
      const current = await teleport(next)
      flatSamples.push(+current.passages)
    }
  }
  while (k > 0) {
    k--
    await walk()
  }
  const flatMax = Math.max(...flatSamples)
  const out = Object.values(highSamples).filter(passages => passages >= flatMax * 1.1)
  const highSum = out.reduce((a, b) => a + b, - out.length) 
  const sum = flatSamples.reduce((a, b) => a + b) - (out.some(v => flatMax * 1.1 > v) ? flatMax : 0)
  const lower = Math.floor((Math.ceil(n / 2) / 3) * 4)
  const upper = Math.ceil((((n - 1) * n) / 2 / 3) * 2)
  console.error({sum, out, flatSamples: flatSamples.sort((a, b) => b - a)})
  
  return Math.max(
    lower,
    Math.min(
      Math.round((sum / 2 / flatSamples.length) * (n - out.length) + highSum / 2),
      upper
    )
  )
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
  const requestNumber = numberStream(process.stdin)
  const t = await requestNumber()
  const readStatus = async () => {
    const [room, passages] = [await requestNumber(), await requestNumber()]
    return {room: room - 1, passages}
  }
  for (let i = 0; i < t; i++) {
    const [n, k] = [await requestNumber(), await requestNumber()]
    const estimate = await solve({
      n,
      k,
      start: await readStatus(),
      walk: () => {
        response('W')
        return readStatus()
      },
      teleport: s => {
        response(`T ${s + 1}`)
        return readStatus()
      },
    })
    response(`E ${estimate}`)
  }
  process.exit(0)
}

main()
