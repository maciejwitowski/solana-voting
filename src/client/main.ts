/**
 * Voting program on Solana
 */

async function main() {
  console.log('Client started');
}

main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  },
);
