export async function getStandings(page, standingsId){
  let table_headers
  let rowsValues = []
  // get headers
  try {
    let cols = await page.$$eval(
      `table#${standingsId} thead tr.over_header th[data-stat]`,
      (options) => options.map((option) => option.textContent)
    )
    cols.unshift(' ');
    table_headers = cols.map(x => {
      if(x === ' '){
        return {
          Header: ' ',
          columns: [
            {
              Header: 'Команда',
              accessor: 'team',
            }
          ]
        }
      } else if(x === 'Regular Season') {
        return {
          Header: x,
          columns: [
            {
              Header: 'В',
              accessor: 'wins|Regular Season',
            },
            {
              Header: 'П',
              accessor: 'losses|Regular Season',
            }
          ]
        }
      } else if(x === 'Playoffs') {
        return {
          Header: x,
          columns: [
            {
              Header: 'В',
              accessor: 'wins|Playoffs',
            },
            {
              Header: 'П',
              accessor: 'losses|Playoffs',
            }
          ]
        }
      } else if(x === 'Semifinals') {
        return {
          Header: x,
          columns: [
            {
              Header: 'В',
              accessor: 'wins|Semifinals',
            },
            {
              Header: 'П',
              accessor: 'losses|Semifinals',
            }
          ]
        }
      }
    })
  } catch (error) {
    console.error(error)
  }
  // get rows
  try {
    const rows = await page.$$(`table#${standingsId} tbody tr`);
    let array = []
      for (const row of rows) {
        array.push(await row.$$eval('th, td', (options) => options.map( (option, index) => {
          if (option.textContent) {
            let dataStat = option.getAttribute("data-stat")
            return  {
              [dataStat] : option.textContent
            }
          }
        }).filter(Boolean)));
      }
      // flat an array
      let newarr = array.map(x=> {
        return Object.fromEntries(
          x.map(item => {
            return Object.entries(item).flat()
          })
          )
      })
      rowsValues.push(...newarr)
  } catch (error) {
    console.error(error)
  }
  return {
    headers: table_headers,
    rows: rowsValues
  }
}