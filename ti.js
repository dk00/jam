const solve = async ({}) => {
  return
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
          console.error('>', number)
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
  const n = await requestNumber()
  const k = await requestNumber()

  for (let i = 0; i < t; i++) {
    console.error('Case #', i)
    const result = await solve({

    })
    response(result.join(' '))
    const result = await requestNumber()
    if (result < 0) {
      process.exit(0)
    }
  }
  process.exit(0)
}

main()
