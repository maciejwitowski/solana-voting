use solana_program::{
    instruction::{Instruction},
    program_error::ProgramError
};

use crate::error::VotingError::InvalidInstruction;
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum VotingInstruction {
    Create {
        number: u32
    }
    /// Accounts expected by this instruction:
    ///
    /// 0. `[writable]` Chairperson account, which creating initial voting state
    InitializeVoting {
        proposals: Vec<String>,
        counts: Vec<u32>
    }
}

impl VotingInstruction {
    // pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        // let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;

        // let instruction = match tag {
        //     0 => Self::SetProposals::try_from_slice(&input).unwrap(),
        //     _ => return Err(InvalidInstruction.into())
        // };

        // Ok(instruction)
    // }
}