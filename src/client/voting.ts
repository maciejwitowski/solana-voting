import {
    Connection,
    Keypair,
    PublicKey,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction,
    SystemProgram
} from '@solana/web3.js';
import fs from 'mz/fs';
import path from 'path';
import { createKeypairFromFile, getDeployedProgramOwner, getRpcUrl } from './utils';
import * as borsh from 'borsh';

let connection: Connection;

let chairperson: Keypair;

let programId: PublicKey;

/**
 * The public key of the account which will keep voting data
 */
let votingAccountPubKey: PublicKey

/**
 * Path to program files
 */
const PROGRAM_PATH = path.resolve(__dirname, '../../dist/program');

/**
 * Path to program shared object file which should be deployed on chain.
 * This file is created when running either:
 *   - `npm run build:program-c`
 *   - `npm run build:program-rust`
 */
const PROGRAM_SO_PATH = path.join(PROGRAM_PATH, 'voting.so');

/**
 * Path to the keypair of the deployed program.
 * This file is created when running `solana program deploy dist/program/voting.so`
 */
const PROGRAM_KEYPAIR_PATH = path.join(PROGRAM_PATH, 'voting-keypair.json');

// Modeled with 2 arrays since borsh doesn't support list of structs like Proposal(name, count)
// https://github.com/near/borsh-js/issues/22
class VotingData {
    names: Array<string> = [];
    counts: Array<number> = [];

    constructor(names: Array<string>, counts: Array<number>) {
        this.names = names;
        this.counts = counts;
    }
}

const VotingSchema = new Map([
    [VotingData, {
        kind: 'struct',
        fields: [
            ['names', 'string'],
            ['counts', 'u32']
        ]
    }],
]);

const VOTING_SIZE = borsh.serialize(
    VotingSchema,
    new VotingData(
        ["Ethereum", "Solana", "Cardano"],
        [0, 0, 0]
    )
).length;

export async function establishConnection(): Promise<void> {
    const rpcUrl = await getRpcUrl();
    connection = new Connection(rpcUrl, 'confirmed');
    const version = await connection.getVersion();
    console.log('Connection to cluster established:', rpcUrl, version);
}

export async function establishChairperson(): Promise<void> {
    let fees = 0;
    if (!chairperson) {
        chairperson = await getDeployedProgramOwner();
    }

    let currentBalance = await connection.getBalance(chairperson.publicKey);
    console.log("Current funds: ", currentBalance);

    // const sig = await connection.requestAirdrop(
    //     chairperson.publicKey,
    //     LAMPORTS_PER_SOL*10000,
    //   );
    // await connection.confirmTransaction(sig);
    // let newBalance = await connection.getBalance(chairperson.publicKey);
    // console.log("new balance: ", newBalance);

    console.log("Chairperson: ", chairperson.publicKey.toBase58())
}

/**
 * Check if the voting BPF program has been deployed
 */
export async function checkProgram(): Promise<void> {
    // Read program id from keypair file
    try {
        const programKeypair = await createKeypairFromFile(PROGRAM_KEYPAIR_PATH);
        programId = programKeypair.publicKey;
    } catch (err) {
        const errMsg = (err as Error).message;
        throw new Error(
            `Failed to read program keypair at '${PROGRAM_KEYPAIR_PATH}' due to error: ${errMsg}. Program may need to be deployed with \`solana program deploy dist/program/voting.so\``,
        );
    }

    // Check if the program has been deployed
    const programInfo = await connection.getAccountInfo(programId);
    if (programInfo === null) {
        if (fs.existsSync(PROGRAM_SO_PATH)) {
            throw new Error(
                'Program needs to be deployed with `solana program deploy dist/program/voting.so`',
            );
        } else {
            throw new Error('Program needs to be built and deployed');
        }
    } else if (!programInfo.executable) {
        throw new Error(`Program is not executable`);
    }
    console.log("Using program: ", programId.toBase58());

    const VOTING_SEED = 'voting';
    votingAccountPubKey = await PublicKey.createWithSeed(
        chairperson.publicKey,
        VOTING_SEED,
        programId
    );

    const votingAccount = await connection.getAccountInfo(votingAccountPubKey);
    console.log("Voting account: ", votingAccountPubKey.toBase58());
    if (votingAccount == null) {
        console.log(
            'Creating voting account',
            votingAccountPubKey.toBase58()
        );

        const lamports = await connection.getMinimumBalanceForRentExemption(
            VOTING_SIZE,
        );

        const transaction = new Transaction().add(
            SystemProgram.createAccountWithSeed({
                fromPubkey: chairperson.publicKey,
                basePubkey: chairperson.publicKey,
                seed: VOTING_SEED,
                newAccountPubkey: votingAccountPubKey,
                lamports,
                space: VOTING_SIZE,
                programId,
            }),
        );
        await sendAndConfirmTransaction(connection, transaction, [chairperson]);
    }
}

export async function setProposals(): Promise<void> {
    console.log('Voting size:', VOTING_SIZE);

    const proposals = borsh.serialize(
        VotingSchema,
        new VotingData(
            ["Ethereum", "Solana", "Cardano"],
            [0, 0, 0]
        )
    )
    
    const instruction = new TransactionInstruction({
        keys: [{ pubkey: votingAccountPubKey, isSigner: false, isWritable: true }],
        programId,
        data: Buffer.from('this is my transaction')
        // data: Buffer.from(proposals)
    });
    await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [chairperson],
    );
}