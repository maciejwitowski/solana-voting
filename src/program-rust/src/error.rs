// inside error.rs
use thiserror::Error;

#[derive(Error, Debug, Copy, Clone)]
pub enum VotingError {
    /// Invalid instruction
    #[error("Invalid Instruction")]
    InvalidInstruction,
}