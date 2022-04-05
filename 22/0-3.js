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

const solve = modules => {
  const pointed = modules.reduce((map, m, index) => {
    map[m.chain] = map[m.chain] || []
    map[m.chain].push(index)
    return map
  }, {})
  modules[-1] = {fun: 0}

  const find = asc(function* (index) {
    const sources = pointed[index]
      ? yield Promise.all(
          pointed[index].map(source =>
            Promise.resolve().then(() => find(source))
          )
        )
      : []
    const sum = sources.reduce(
      (current, source) => current + source.min + source.rest,
      0
    )
    const childMin =
      sum > 0 ? Math.min(...sources.map(source => source.min)) : 0
    const min = Math.max(modules[index].fun, childMin)
    return {min, rest: sum - childMin}
  })

  return find(-1).then(result => result.min + result.rest)
}

const groupLines = (lines, size) =>
  Array.from({length: lines.length / size}, (_, i) =>
    lines.slice(i * size, i * size + size)
  )

const parseLine = (line, fn) => line.split(' ').map(fn)

const parse = input =>
  groupLines(input.split('\n').slice(1), 3).map(rows => {
    const fun = parseLine(rows[1], v => +v)
    const chain = parseLine(rows[2], v => v - 1)

    return fun.map((value, i) => ({
      fun: value,
      chain: chain[i],
    }))
  })

const format = result => result

const main = asc(function* (data) {
  const cases = parse(data.trim())
  for (let i = 0; i < cases.length; i++) {
    console.log(`Case #${i + 1}:`, format(yield solve(cases[i])))
  }
})

main(require('fs').readFileSync(0, 'utf-8'))
