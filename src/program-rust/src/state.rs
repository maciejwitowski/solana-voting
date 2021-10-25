use { 
	solana_program::{
			account_info::{AccountInfo}
	}
};

pub fn write_data(account: &AccountInfo, input: &[u8], offset: usize) {
	let mut account_data = account.data.borrow_mut();
	account_data[offset..offset + input.len()].copy_from_slice(input);
}
