use solana_program::{
    msg,
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
};

pub struct Processor;

impl Processor {
    pub fn process(
        program_id: &Pubkey, 
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        msg!("Voting Rust program entrypoint");
    
        msg!("Program ID: {}", program_id);
    
        Ok(())
    }
}