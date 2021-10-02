/**
 * Voting program on Solana
 */

import {
  establishConnection,
  establishChairperson,
  checkProgram,
  setProposals
} from './voting';

async function main() {
  console.log('Client started');

  // Establish connection to the cluster
  await establishConnection();

  // Establish voting chariperson
  await establishChairperson();

  // Verify if the voting program has been deployeds
  await checkProgram();

  await setProposals();
}

main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  },
);
