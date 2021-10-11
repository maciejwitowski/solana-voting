pub enum VotingInstruction {
    AddProposals {
        amount: u64
    }
}

// impl VotingInstruction {
//     pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {

//     }
// }