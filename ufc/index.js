import {parseUFCLeadersAndAtheletes} from "./parsers/leaderboards.js"
import { saveUFCData } from '../db/utils/UFC/index.js'

async function run(){
  let {leaders, athletes} = await parseUFCLeadersAndAtheletes()
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

  await saveUFCData(UFCLeaders, UFCAthletes)
}
run()