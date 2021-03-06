use {
    crate::error::VotingError::InvalidInstruction,
    borsh::{BorshDeserialize, BorshSerialize}
};

#[derive(Clone, Debug, BorshSerialize, BorshDeserialize, PartialEq)]
pub enum VotingInstruction {
    AddProposal {
        name: Vec<u8>
    },
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