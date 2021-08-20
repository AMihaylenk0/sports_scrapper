export async function getTennisRankings(page){
  let rowsValues = []
  try {
    const rows = await page.$$('table.table-stripe-with-class tbody tr');
    let array = []
      for (const row of rows) {
        array.push(await row.$$eval('td, img', (options) => options.map( (option, index) => {
          if (option.tagName === 'IMG') {
            let imgSrc = option.getAttribute("src")
            let title = option.getAttribute("title")
            return [title, imgSrc]
          } else {
            return option.textContent.trim()
          }
        })));
      }
      array = array.map(x=>{
        return {
          rank: x[0],
          rankUpdate: x[1],
          playerName: x[2],
          countryName: x[3][0],
          countryImg: x[3][1],
          points: x[4] 
        }
      })
      rowsValues.push(...array)
  } catch (error) {
    console.error(error)
  }
  // let table_headers = [
  //     {
  //       Header: '',
  //       accessor: 'rank',
  //     },
  //     {
  //       Header: '',
  //       accessor: 'rankUpdate',
  //     },
  //     {
  //       Header: 'Страна',
  //       accessor: 'countryName',
  //     },
  //     {
  //       Header: 'Имя',
  //       accessor: 'playerName',
  //     },
  //     {
  //       Header: 'Очки',
  //       accessor: 'points',
  //     }
  // ]
  return {
    // headers: table_headers,
    rows: rowsValues
  }
}
