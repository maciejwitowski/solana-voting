use { 
    crate::{
        instruction::VotingInstruction,
        state::write_data
    },
    solana_program::{
        msg,
        account_info::{next_account_info, AccountInfo},
        entrypoint::{ProgramResult, MAX_PERMITTED_DATA_INCREASE},
        program_error::ProgramError,
        pubkey::Pubkey
    },
    borsh::{BorshDeserialize, BorshSerialize}
};

use std::str::from_utf8;

pub struct Processor;

impl Processor {
    pub fn process(
        program_id: &Pubkey, 
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        msg!("Voting Rust program entrypoint");
        
        msg!("Instruction data size: {:?}", instruction_data.len());

        let instruction = VotingInstruction::try_from_slice(instruction_data)
            .map_err(|_| ProgramError::InvalidInstructionData)?;

        match instruction {
            VotingInstruction::AddProposal {
                name
            } => {
                msg!("Instruction: AddProposal {:?}", name);
                Processor::processAddProposal(program_id, accounts, name)
            }
            VotingInstruction::InitializeVoting {
                proposals,
                counts
            } => {
                msg!("Instruction: InitializeVoting");
            }
        }

        Ok(())
    }

    fn processAddProposal(
        program_id: &Pubkey, 
        accounts: &[AccountInfo],
        name: Vec<u8>
    ) {
        msg!("processAddProposal {:?}", std::str::from_utf8(&name));
        
        let accounts_iter = &mut accounts.iter();
        let voting_account = next_account_info(accounts_iter).ok().unwrap();

        let dataLen = voting_account.data.borrow().len();

        msg!("Voting account: {:?}, length: {:?}", voting_account.key, dataLen);

        msg!("Content {:?}", std::str::from_utf8(&voting_account.data.borrow()));
        write_data(voting_account, &name, 0);
    }
}