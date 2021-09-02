export async function getKHLTeamsStats(page, league){
  page.setDefaultTimeout(0)
  let table_headers
  let rowsValues = []

  try {
    table_headers = await page.$$eval(
      "#teams_dataTable_wrapper table thead tr th",
      (options) => options.map((option) => option.textContent)
    )
  } catch (error) {
    console.error(error)
  }
  try {
    const rows = await page.$$('#teams_dataTable_wrapper table tbody tr');
    let array = []
      for (const row of rows) {
        array.push(await row.$$eval('td', (options, table_headers) => options.map( (option, index) => {
          return {
            [table_headers[index]] : option.textContent.trim()
          }
        }), table_headers));
      }
      let newarr = array.flatMap((x,i)=>{
        return Object.assign({}, ...x)
      })
      // newarr = newarr.map(x=> {
      //   return {
      //     ...x,
      //     'Команда': formatString(x['Команда'])
      //   }
      // })
      rowsValues.push(...newarr)
  } catch (error) {
    console.error(error)
  }
   // map headers
   table_headers = table_headers.map(x=> {
    return {
      Header: x,
      accessor: x,
    }
  })
  return {
    league,
    teamsStats:{
      headers: table_headers,
      rows: rowsValues
    }
  }
}
