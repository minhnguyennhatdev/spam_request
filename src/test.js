async function main() {
  const current = Date.now()
  for(let i = 0; i < 1000000000; i ++) {
    i*i
  }
  console.log('Benchmark: ', Date.now() - current)
}

main()