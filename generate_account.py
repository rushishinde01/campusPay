from algosdk import account, mnemonic

private_key, address = account.generate_account()
passphrase = mnemonic.from_private_key(private_key)

print(f"NEW_ADDRESS: {address}")
print(f"NEW_MNEMONIC: {passphrase}")
