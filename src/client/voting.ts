import {
    Connection,
    Keypair,
    PublicKey,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import fs from 'mz/fs';
import path from 'path';
import { createKeypairFromFile, getDeployedProgramOwner, getRpcUrl } from './utils';



let connection: Connection;

let chairperson: Keypair;

let programId: PublicKey;
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

export async function establishConnection(): Promise<void> {
    const rpcUrl = await getRpcUrl();
    connection = new Connection(rpcUrl, 'confirmed');
    const version = await connection.getVersion();
    console.log('Connection to cluster established:', rpcUrl, version);
}

export async function establishChairperson(): Promise<void> {
    chairperson = await getDeployedProgramOwner();
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
    console.log(`Using program ${programId.toBase58()}`);
}

/**
 * Say hello
 */
export async function setProposals(): Promise<void> {
    const instruction = new TransactionInstruction({
        keys: [],
        programId,
        data: Buffer.alloc(0), // All instructions are hellos
    });
    await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [chairperson],
    );
}