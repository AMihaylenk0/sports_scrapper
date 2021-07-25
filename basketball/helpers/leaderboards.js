export async function getLeaderboards(page, standingsId){
  let items
  // get rows
  try {
    // await page.waitForXPath("//button[contains(., 'Expand all Leaderboards')]")
    // const button = await page.$x("//button[contains(., 'Expand all Leaderboards')][1]");
    // const button = await page.$x("//div[@class='leaderboard_wrapper']//ul/li[1]");
    // if (button) {
    //   await button[0].click();
    // }
    // await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4427.0 Safari/537.36');
    let buttonSelector = 'div.leaderboard_wrapper ul > li:nth-child(2) > button'
    await waitAndClick( buttonSelector, page )
    items = await page.evaluate(() => {
        let cardsArr = []
        // iterate through categories
        for (const card of [...document.querySelectorAll('div.leaderboard_wrapper div.data_grid_box.show_all')]) {
          let arr = []
          for (const row of [...card.querySelectorAll('table tbody tr')]) {
            let fields = [...row.querySelectorAll('td')].map(x=>x.textContent)
            arr.push(fields)
          }
          let title = card.querySelector('caption').textContent
          // restructure values
          let mappeedArray = arr.map((x,i)=>{
            return {
              id: ++i,
              playerName: x[1].split(' • ')[0],
              teamName: x[1].split(' • ')[1],
              value: x[2].trim()
            }
          })
          let result = {
            title,
            items: mappeedArray
          }
          cardsArr.push(result)
        }
        return cardsArr
      });
  } catch (error) {
    console.error(error)
  }
  return {
    rows: items
  }
}
async function waitAndClick(selector, page) {
  await page.waitForFunction(
    `document.querySelector('${selector}') && document.querySelector('${selector}').clientHeight != 0`,
    { visible: true },
  );
  await page.evaluate((selector) => {
    document.querySelector(selector).click();
  }, selector);
}