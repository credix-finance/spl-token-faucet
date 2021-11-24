use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

declare_id!("4sN8PnN2ki2W4TFXAfzR645FWs8nimmsYeNtxM8RBK6A");

#[program]
pub mod spl_token_faucet {
    use super::*;

    pub fn airdrop(ctx: Context<Airdrop>, mint_bump: u8, amount: u64) -> ProgramResult {
        anchor_spl::token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.destination.to_account_info(),
                    authority: ctx.accounts.mint.to_account_info(),
                },
                &[&[&"faucet-mint".as_bytes(), &[mint_bump]]],
            ),
            amount,
        )?;
        Ok(())
    }
}


#[derive(Accounts)]
#[instruction(mint_bump: u8, amount: u64)]
pub struct Airdrop<'info> {
    #[account(
        init_if_needed,
        payer = payer,
        seeds = [b"faucet-mint".as_ref()],
        bump = mint_bump,
        mint::decimals = 6,
        mint::authority = mint
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer
    )]
    pub destination: Account<'info, TokenAccount>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

