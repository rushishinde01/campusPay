from algopy import ARC4Contract, UInt64, String, GlobalState, Txn, Account, Bytes
from algopy.arc4 import abimethod


class CampusPay(ARC4Contract):

    def __init__(self) -> None:
        # initialize global state keys
        # storing addresses as bytes (32 bytes)
        self.payer = GlobalState(Bytes())
        self.receiver = GlobalState(Bytes())
        self.amount = GlobalState(UInt64(0))
        self.is_active = GlobalState(UInt64(0))
        self.is_claimed = GlobalState(UInt64(0))

    @abimethod()
    def create_escrow(self, receiver: Account, amount: UInt64) -> None:
        assert self.is_active.value == UInt64(0)
        assert amount > UInt64(0)
        
        # Payer is the transaction sender
        payer = Txn.sender
        assert payer != receiver

        self.payer.value = payer.bytes
        self.receiver.value = receiver.bytes
        self.amount.value = amount
        self.is_active.value = UInt64(1)
        self.is_claimed.value = UInt64(0)

    @abimethod()
    def claim_escrow(self) -> None:
        assert self.is_active.value == UInt64(1)
        assert self.is_claimed.value == UInt64(0)
        
        # Only the designated receiver can claim
        assert Txn.sender.bytes == self.receiver.value

        self.is_claimed.value = UInt64(1)
        self.is_active.value = UInt64(0)
        
    @abimethod()
    def cancel_escrow(self) -> None:
        assert self.is_active.value == UInt64(1)
        assert self.is_claimed.value == UInt64(0)
        
        # Only the original payer can cancel
        assert Txn.sender.bytes == self.payer.value

        self.is_active.value = UInt64(0)