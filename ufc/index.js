import {parseUFCLeadersAndAtheletes} from "./parsers/leaderboards.js"
import {parseUFCScedule} from "./parsers/scedule.js"
import { saveUFCData } from '../db/utils/UFC/index.js'

async function run(){
  let {leaders, athletes} = await parseUFCLeadersAndAtheletes()
  let {scedule, events} = await parseUFCScedule()
  
  let UFCLeaders = {
      season: 2021,
      items: leaders
  }

  const duplicates = new Set();
  let UFCAthletes = athletes.filter(el => {
    const isDuplicate = duplicates.has(el.athleteId);
    duplicates.add(el.athleteId);
    return !isDuplicate;
  });
  let UFCScedule = {
    season: 2021,
    items: scedule
  }

  await saveUFCData(UFCLeaders, UFCAthletes, UFCScedule, events)
}
run()