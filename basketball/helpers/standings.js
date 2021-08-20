export async function getStandings(page, standingsId){
  let table_headers
  let rowsValues = []
  // get headers
  try {
    let cols = await page.$$eval(
      `table#${standingsId} thead tr.over_header th[data-stat]`,
      (options) => options.map((option) => option.textContent)
    )
    // let subCols = await page.$$eval(
    //   `table#${standingsId} thead tr:not([class="over_header"]) th:not([data-stat="team"])`,
    //   (options) => options.map((option) => option.textContent)
    // )

    // let headers = []
    // for (let i of cols) {
    //   let arr = {
    //         Header: i,
    //         columns: []
    //       }
    //   let subColslength = subCols.length
    //   for (let j = 0; j < subColslength; j++) {
    //     if(subCols[0] === '&nbsp;' || subCols[0] === ' ') {
    //       subCols.shift(subCols[j])
    //       break
    //     }
    //     let value = subCols.shift(subCols[j])
    //     let obj = {
    //       Header: value,
    //       accessor: value
    //     }
    //     arr.columns.push(obj)
    //   }
    //   headers.push(arr)
    // }

    table_headers = mapHeaders(cols, standingsId)
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
      // let newarr = array.map(x=> {
      //   return Object.fromEntries(
      //     x.map(item => {
      //       return Object.entries(item).flat()
      //     })
      //     )
      // }).map(x=> {
      //   return {
      //     ...x,
      //     team: formatString(x.team),
      //   }
      // })
      let newarr = array.flatMap((x,i)=>{
        return Object.assign({}, ...x)
      })
      newarr = newarr.map(x=> {
        return {
          ...x,
          team: formatString(x.team)
        }
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

function formatString(str){
  if(str && str.endsWith(' *')){
    return str.slice(0, str.length -2)
  } else {
    return str.trimLeft()
  }
}
function mapHeaders(cols, standingsId){
  cols.unshift(' ');
  if (standingsId === 'chn_standings' || standingsId === 'spa_standings' || standingsId === 'fra_standings' || standingsId === 'ita_standings') {
    return cols.map(x => {
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
            },
            {
              Header: 'ПП',
              accessor: 'win_loss_pct|Regular Season',
            },
            {
              Header: 'ИГП',
              accessor: 'gb|Regular Season',
            },
            {
              Header: 'ОН',
              accessor: 'pts_per_g|Regular Season',
            },
            {
              Header: 'ОП',
              accessor: 'opp_pts_per_g|Regular Season',
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
      }
    })
  } else {
  return cols.map(x => {
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
    } else if(x === 'Last 16') {
      return {
        Header: x,
        columns: [
          {
            Header: 'В',
            accessor: 'wins|Last 16',
          },
          {
            Header: 'П',
            accessor: 'losses|Last 16',
          }
        ]
      }
    } else if(x === 'Quarterfinals') {
      return {
        Header: x,
        columns: [
          {
            Header: 'В',
            accessor: 'wins|Quarterfinals',
          },
          {
            Header: 'П',
            accessor: 'losses|Quarterfinals',
          }
        ]
      }
    }
  })
}
}