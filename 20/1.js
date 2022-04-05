const longer = (a, b) => a.length > b.length ? a : b

const solve = words => {
  const splitWords = words.map(it => it.split('*'))
  const left = splitWords.map(it => it[0]).reduce(longer)
  const right = splitWords.map(it => it[it.length - 1]).reduce(longer)
  const result = [].concat(
    left,
    ...splitWords.map(it => it.slice(1, -1)),
    right,
  ).join('')
  return splitWords.every(w =>
    result.startsWith(w[0]) &&
    result.endsWith(w[w.length-1])
  ) ? result : '*'
}

const parse = input => {
  const lines = input.split('\n')
  const readBlocks = lines => {
    const rows = +lines[0]
    return [
      lines.slice(1, 1 + rows)
    ]
    .concat(
      lines.length > 1 + rows ? readBlocks(lines.slice(1 + rows)) : []
    )
  }
  return readBlocks(lines.slice(1))
}

const format = result => result

const collect = stream => new Promise((resolve, reject) => {
  const buffer = []
  stream.setEncoding('utf8')
  stream.on('data', data => buffer.push(data))
  stream.on('end', () => resolve(buffer.join('')))
})

const main = data => {
  const cases = parse(data.trim())
  cases.forEach((data, index) => console.log(
    `Case #${index+1}:`, format(solve(data))
  ))
}

collect(process.stdin).then(main).catch(r => console.log(r))
