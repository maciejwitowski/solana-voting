use solana_program::{
    msg,
    account_info::{next_account_info, AccountInfo},
    entrypoint::{ProgramResult, MAX_PERMITTED_DATA_INCREASE},
    program_error::ProgramError,
    pubkey::Pubkey,
};

use borsh::{BorshDeserialize, BorshSerialize};

pub struct Processor;

pub trait Serdes: Sized + BorshSerialize + BorshDeserialize {
    fn pack(&self, dst: &mut[u8]) {
        let encoded = self.try_to_vec().unwrap();
        msg!("Encoded length: {:?}", encoded.len());
        msg!("dst length: {:?}", dst.len());
        dst[..encoded.len()].copy_from_slice(&encoded);
    }

    fn unpack(src: &[u8]) -> Result<Self, ProgramError> {
        Self::try_from_slice(src).map_err(|_| ProgramError::InvalidAccountData)
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Message {
    txt: String     
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct GreetingAccount {
    /// number of greetings
    pub counter: u32,
}

impl Serdes for Message {}

impl Processor {
    pub fn process(
        program_id: &Pubkey, 
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        msg!("Voting Rust program entrypoint");

        let account_iter = &mut accounts.iter();
        let account = next_account_info(account_iter)?;

        msg!("Account: {:?}", account);

        // if account.data_is_empty() {
        //     msg!("Empty account. Reallocating...");
        //     account.realloc(MAX_PERMITTED_DATA_INCREASE, true);
        //     msg!("New account data size: {:?}", account.data_len());
        // }

        let mut greeting_account = GreetingAccount::try_from_slice(&account.data.borrow())?;
        greeting_account.counter += 1;
        greeting_account.serialize(&mut &mut account.data.borrow_mut()[..])?;
    
        msg!("Greeted {} time(s)!", greeting_account.counter);

        // let mut message = Message::try_from_slice(&account.data.borrow())?;


        // let mut data = account.try_borrow_mut_data()?;

        // let mut unpacked = Message::unpack(&data).expect("Failed to read data");

        // msg!("Unpacked: {:?}", unpacked);
        // let new_message = Message { txt: String::from("Hello world")};

        // let message_vec = new_message.try_to_vec()?;
        

        // unpacked = new_message;
        
        // let message = Message { txt: String::from("Hello, world!") };
        // println!("Message: {:?}", message);

        // let encoded = new_message.pack(&mut data);

        // let decoded = Message::try_from_slice(encoded);
    
        // msg!("Decoded: {}", message);

        // msg!("Program ID: {}", program_id);
    
        Ok(())
    }
}