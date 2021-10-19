import { Numberu32 } from './utils';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';

export function createInstruction(
	programId: PublicKey,
	votingAccountPubKey: PublicKey
) : TransactionInstruction {
	const buffers = [
		Buffer.from(Int8Array.from([0])),
		new Numberu32(99).toBuffer()
	];

	const data = Buffer.concat(buffers);

	const keys = [
		{
			pubkey: votingAccountPubKey,
			isSigner: false,
			isWritable: true
		}
	]

	return new TransactionInstruction({
		keys: keys,
		programId: programId,
		data: data
	});
}

export function addProposalInstruction(
	programId: PublicKey,
	votingAccountPubKey: PublicKey,
	proposalName: string
) {
	const buffers = [
		Buffer.from(Int8Array.from([1])),
		new Numberu32(proposalName.length).toBuffer(),
		Buffer.from(proposalName)
	];

	const data = Buffer.concat(buffers);

	const keys = [
		{
			pubkey: votingAccountPubKey,
			isSigner: false,
			isWritable: true
		}
	]

	return new TransactionInstruction({
		keys: keys,
		programId: programId,
		data: data
	});
}

