export async function getKHLPlayersStats(page, league){
  page.setDefaultTimeout(0)
  let goaliesStats = await getGoaliesStats(page)
  let defendersStats = await getDefendersStats(page)
  let forwardsStats = await getForwardsStats(page)
  return {
    league,
    goaliesStats,
    defendersStats,
    forwardsStats
  }
}

async function getGoaliesStats(page) {
  let table_headers = []
  let rowsValues = []
  try {
    let expandBtn = ".m-top_panel .b-wide_block a#goalies_loadall";
    await page.waitForSelector(expandBtn);
    await page.evaluate((expandBtn) => document.querySelector(expandBtn).click(), expandBtn);
    await parseData()
    async function parseData(){
      table_headers = await page.$$eval(
        ".m-top_panel .b-wide_block #goalies_dataTable_wrapper table thead tr th:not([class*='control'])",
        (options) => options.map((option) => option.textContent)
      )
      const rows = await page.$$('.m-top_panel .b-wide_block #goalies_dataTable_wrapper table tbody tr');
      let array = []
      for (const row of rows) {
        array.push(await row.$$eval('th, td:not([class*="control"])', (options, table_headers) => options.map( (option, index) => {
          if (index === 0) {
            let player = {}
            for (let i = 0; i < option.children.length; i++) {
              if (option.children[i].tagName === 'IMG') {
                player.imgSrc = `https://www.khl.ru${option.children[i].getAttribute("src")}` /* add base url to path (src = /images/teamplayers/12474/40152.jpg) */
              } else {
                player.name = option.children[i].textContent.trim()
              }
            }
            return {[table_headers[index]] : player}
          } else {
            return {[table_headers[index]] : option.textContent.trim()}
          }
          }), table_headers));
        }
      let newarr = array.flatMap((x,i)=>{
        return Object.assign({}, ...x)
      })
      // newarr = newarr.map(x=> {
      //   return {
      //     ...x,
      //     'Игрок': formatString(x['Игрок'])
      //   }
      // })
      rowsValues.push(...newarr)
    }

    table_headers = table_headers.map(x=> {
      return {
        Header: x,
        accessor: x,
      }
    })
    return {
      headers: table_headers,
      rows: rowsValues
    }
  } catch (error) {
    console.error(error)
  }
}
async function getDefendersStats(page) {
  let table_headers = []
  let rowsValues = []
  try {
    let expandBtn = ".m-top_panel .b-wide_block a#defenses_loadall";
    await page.waitForSelector(expandBtn);
    await page.evaluate((expandBtn) => document.querySelector(expandBtn).click(), expandBtn);
    await parseData()
    async function parseData(){
      table_headers = await page.$$eval(
        ".m-top_panel .b-wide_block #defenses_dataTable_wrapper table thead tr th:not([class*='control'])",
        (options) => options.map((option) => option.textContent)
      )
      const rows = await page.$$('.m-top_panel .b-wide_block #defenses_dataTable_wrapper table tbody tr');
      let array = []
      for (const row of rows) {
        array.push(await row.$$eval('th, td:not([class*="control"])', (options, table_headers) => options.map( (option, index) => {
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
      //     'Игрок': formatString(x['Игрок'])
      //   }
      // })
      rowsValues.push(...newarr)
    }

    table_headers = table_headers.map(x=> {
      return {
        Header: x,
        accessor: x,
      }
    })
    return {
      headers: table_headers,
      rows: rowsValues
    }
  } catch (error) {
    console.error(error)
  }
}
async function getForwardsStats(page) {
  let table_headers = []
  let rowsValues = []
  try {
    let expandBtn = ".m-top_panel .b-wide_block a#forwards_loadall";
    await page.waitForSelector(expandBtn);
    await page.evaluate((expandBtn) => document.querySelector(expandBtn).click(), expandBtn);
    await parseData()
    async function parseData(){
      table_headers = await page.$$eval(
        ".m-top_panel .b-wide_block #forwards_dataTable_wrapper table thead tr th:not([class*='control'])",
        (options) => options.map((option) => option.textContent)
      )
      const rows = await page.$$('.m-top_panel .b-wide_block #forwards_dataTable_wrapper table tbody tr');
      let array = []
      for (const row of rows) {
        array.push(await row.$$eval('th, td:not([class*="control"])', (options, table_headers) => options.map( (option, index) => {
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
      //     'Игрок': formatString(x['Игрок'])
      //   }
      // })
      rowsValues.push(...newarr)
    }

    table_headers = table_headers.map(x=> {
      return {
        Header: x,
        accessor: x,
      }
    })
    return {
      headers: table_headers,
      rows: rowsValues
    }
  } catch (error) {
    console.error(error)
  }
}
function formatString(str){
  let newarr = str.shift().split(/(\d+)/).filter(Boolean)
  return [...newarr, ...str]
}