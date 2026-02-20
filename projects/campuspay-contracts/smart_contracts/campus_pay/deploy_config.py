import logging
import algokit_utils

logger = logging.getLogger(__name__)

def deploy() -> None:
    from smart_contracts.artifacts.campus_pay.campus_pay_client import (
        CampusPayFactory,
        CreateEscrowArgs,
    )

    algorand = algokit_utils.AlgorandClient.from_environment()
    deployer = algorand.account.from_environment("DEPLOYER")

    factory = algorand.client.get_typed_app_factory(
        CampusPayFactory,
        default_sender=deployer.address,
    )

    app_client, result = factory.deploy(
        on_update=algokit_utils.OnUpdate.AppendApp,
        on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
    )

    # IMPORTANT: receiver must be DIFFERENT from deployer.address
    import os
    receiver = os.environ.get("RECEIVER_ADDRESS", "PASTE_ADDR_RECEIVER_HERE")

    amount_microalgos = 200_000

    # app_client.send.create_escrow(
    #     args=CreateEscrowArgs(
    #         receiver=receiver,
    #         amount=amount_microalgos,
    #     )
    # )

    logger.info(f"Escrow created successfully. App ID: {app_client.app_id}")
    print(f"App ID: {app_client.app_id}")