use { 
    crate::{
        instruction::VotingInstruction
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

        let account_iter = &mut accounts.iter();
        let account = next_account_info(account_iter)?;

        msg!("Account: {:?}", account);

        Ok(())
    }
}