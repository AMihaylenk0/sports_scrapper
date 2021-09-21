export const pAllSettled = async (queue, concurrency) => {
  let index = 0;
  const results = [];

  // Run a pseudo-thread
  const execThread = async () => {
    while (index < queue.length) {
      const curIndex = index++;
      // Use of `curIndex` is important because `index` may change after await is resolved
      results[curIndex] = await queue[curIndex]();
    }
  };
  
  // Start threads
  const threads = [];
  for (let thread = 0; thread < concurrency; thread++) {
    threads.push(execThread());
  }
  await Promise.allSettled(threads);
  // console.log(results, 'results')
  return results;
};