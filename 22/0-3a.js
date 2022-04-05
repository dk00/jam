const solve = modules => {
    const pointed = modules.reduce((map, m) => {
      map[m.chain] = (map[m.chain] || 0) + 1
      return map
    }, {})
    const initiators = Array.from({length: modules.length}, (_, i) => i).filter(
      index => !pointed[index]
    )
    initiators.sort((a, b) => modules[a].fun < modules[b].fun)
  
    const state = modules.map(m => ({
      collected: 0,
      min: Infinity,
    }))
    let maxFun = 0
    while (initiators.length > 0) {
      const index = initiators.shift()
      if (state[index].collected > 0) {
        maxFun += state[index].collected - state[index].min
      }
      const {chain} = modules[index]
      const fun = Math.max(
        state[index].collected > 0 ? state[index].min : 0,
        modules[index].fun
      )
      if (chain < 0) {
        maxFun += fun
      } else {
        state[chain].collected += fun
        state[chain].min = Math.min(fun, state[chain].min)
        pointed[chain] -= 1
        if (pointed[chain] <= 0) {
          initiators.push(chain)
        }
      }
    }
  
    return maxFun
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
  
  const main = data => {
    const cases = parse(data.trim())
    cases.forEach((data, index) =>
      console.log(`Case #${index + 1}:`, format(solve(data)))
    )
  }
  
  main(require('fs').readFileSync(0, 'utf-8'))
  