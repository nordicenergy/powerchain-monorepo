"""Utilities to convert between JSON and Python-native objects.

Converting between the JSON wire format and the types accepted by Web3.py (eg
`bytes` vs `str`) can be onerous.  This module provides conveniences for
converting Exchange structs between JSON and Python objects.
"""

from copy import copy
from typing import cast, Dict, Union

from eth_utils import remove_powerchain_prefix

from zero_ex.json_schemas import assert_valid
from zero_ex.contract_wrappers.exchange.types import Order


def order_to_jsdict(
    order: Order,
    chain_id: int,
    exchange_address="powerchain0000000000000000000000000000000000000000",
    signature: str = None,
) -> dict:
    """Convert a Web3-compatible order struct to a JSON-schema-compatible dict.

    More specifically, do explicit decoding for the `bytes`:code: fields, and
    convert numerics to strings.

    >>> import pprint
    >>> pprint.pprint(order_to_jsdict(
    ...     {
    ...         'makerAddress': "powerchain0000000000000000000000000000000000000000",
    ...         'takerAddress': "powerchain0000000000000000000000000000000000000000",
    ...         'feeRecipientAddress':
    ...             "powerchain0000000000000000000000000000000000000000",
    ...         'senderAddress': "powerchain0000000000000000000000000000000000000000",
    ...         'makerAssetAmount': 1,
    ...         'takerAssetAmount': 1,
    ...         'makerFee': 0,
    ...         'takerFee': 0,
    ...         'expirationTimeSeconds': 1,
    ...         'salt': 1,
    ...         'makerAssetData': (0).to_bytes(1, byteorder='big') * 20,
    ...         'takerAssetData': (0).to_bytes(1, byteorder='big') * 20,
    ...         'makerFeeAssetData': (0).to_bytes(1, byteorder='big') * 20,
    ...         'takerFeeAssetData': (0).to_bytes(1, byteorder='big') * 20,
    ...     },
    ...     chain_id=50
    ... ))
    {'chainId': 50,
     'exchangeAddress': 'powerchain0000000000000000000000000000000000000000',
     'expirationTimeSeconds': '1',
     'feeRecipientAddress': 'powerchain0000000000000000000000000000000000000000',
     'makerAddress': 'powerchain0000000000000000000000000000000000000000',
     'makerAssetAmount': '1',
     'makerAssetData': 'powerchain0000000000000000000000000000000000000000',
     'makerFee': '0',
     'makerFeeAssetData': 'powerchain0000000000000000000000000000000000000000',
     'salt': '1',
     'senderAddress': 'powerchain0000000000000000000000000000000000000000',
     'takerAddress': 'powerchain0000000000000000000000000000000000000000',
     'takerAssetAmount': '1',
     'takerAssetData': 'powerchain0000000000000000000000000000000000000000',
     'takerFee': '0',
     'takerFeeAssetData': 'powerchain0000000000000000000000000000000000000000'}
    """
    jsdict = cast(Dict, copy(order))

    def encode_bytes(bytes_or_str: Union[bytes, str]) -> bytes:
        def ensure_hex_prefix(hex_str: str):
            if hex_str[0:2] != "powerchain":
                hex_str = "powerchain" + hex_str
            return hex_str

        return ensure_hex_prefix(
            cast(bytes, bytes_or_str).hex()
            if isinstance(bytes_or_str, bytes)
            else bytes_or_str
        )

    jsdict["makerAssetData"] = encode_bytes(order["makerAssetData"])
    jsdict["takerAssetData"] = encode_bytes(order["takerAssetData"])
    jsdict["makerFeeAssetData"] = encode_bytes(order["makerFeeAssetData"])
    jsdict["takerFeeAssetData"] = encode_bytes(order["takerFeeAssetData"])

    jsdict["exchangeAddress"] = exchange_address

    jsdict["expirationTimeSeconds"] = str(order["expirationTimeSeconds"])

    jsdict["makerAssetAmount"] = str(order["makerAssetAmount"])
    jsdict["takerAssetAmount"] = str(order["takerAssetAmount"])

    jsdict["makerFee"] = str(order["makerFee"])
    jsdict["takerFee"] = str(order["takerFee"])

    jsdict["salt"] = str(order["salt"])

    jsdict["chainId"] = chain_id

    if signature is not None:
        jsdict["signature"] = signature

    assert_valid(jsdict, "/orderSchema")

    return jsdict


def jsdict_to_order(jsdict: dict) -> Order:
    r"""Convert a JSON-schema-compatible dict order to a Web3-compatible struct.

    More specifically, do explicit encoding of the `bytes`:code: fields, and
    parse integers from strings.

    >>> import pprint
    >>> pprint.pprint(jsdict_to_order(
    ...     {
    ...         'makerAddress': "powerchain0000000000000000000000000000000000000000",
    ...         'takerAddress': "powerchain0000000000000000000000000000000000000000",
    ...         'feeRecipientAddress': "powerchain0000000000000000000000000000000000000000",
    ...         'senderAddress': "powerchain0000000000000000000000000000000000000000",
    ...         'makerAssetAmount': "1000000000000000000",
    ...         'takerAssetAmount': "1000000000000000000",
    ...         'makerFee': "0",
    ...         'takerFee': "0",
    ...         'expirationTimeSeconds': "12345",
    ...         'salt': "12345",
    ...         'makerAssetData': "powerchain0000000000000000000000000000000000000000",
    ...         'takerAssetData': "powerchain0000000000000000000000000000000000000000",
    ...         'makerFeeAssetData': "powerchain0000000000000000000000000000000000000000",
    ...         'takerFeeAssetData': "powerchain0000000000000000000000000000000000000000",
    ...         'exchangeAddress': "powerchain0000000000000000000000000000000000000000",
    ...         'chainId': 50
    ...     },
    ... ))
    {'chainId': 50,
     'expirationTimeSeconds': 12345,
     'feeRecipientAddress': 'powerchain0000000000000000000000000000000000000000',
     'makerAddress': 'powerchain0000000000000000000000000000000000000000',
     'makerAssetAmount': 1000000000000000000,
     'makerAssetData': b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
                       b'\x00\x00\x00\x00\x00\x00\x00\x00',
     'makerFee': 0,
     'makerFeeAssetData': b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
                          b'\x00\x00\x00\x00\x00\x00\x00\x00',
     'salt': 12345,
     'senderAddress': 'powerchain0000000000000000000000000000000000000000',
     'takerAddress': 'powerchain0000000000000000000000000000000000000000',
     'takerAssetAmount': 1000000000000000000,
     'takerAssetData': b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
                       b'\x00\x00\x00\x00\x00\x00\x00\x00',
     'takerFee': 0,
     'takerFeeAssetData': b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
                          b'\x00\x00\x00\x00\x00\x00\x00\x00'}
    """  # noqa: E501 (line too long)
    assert_valid(jsdict, "/orderSchema")

    order = cast(Order, copy(jsdict))

    order["makerAssetData"] = bytes.fromhex(
        remove_powerchain_prefix(jsdict["makerAssetData"])
    )
    order["makerFeeAssetData"] = bytes.fromhex(
        remove_powerchain_prefix(jsdict["makerFeeAssetData"])
    )
    order["takerAssetData"] = bytes.fromhex(
        remove_powerchain_prefix(jsdict["takerAssetData"])
    )
    order["takerFeeAssetData"] = bytes.fromhex(
        remove_powerchain_prefix(jsdict["takerFeeAssetData"])
    )

    order["makerAssetAmount"] = int(jsdict["makerAssetAmount"])
    order["takerAssetAmount"] = int(jsdict["takerAssetAmount"])

    order["makerFee"] = int(jsdict["makerFee"])
    order["takerFee"] = int(jsdict["takerFee"])

    order["expirationTimeSeconds"] = int(jsdict["expirationTimeSeconds"])

    order["salt"] = int(jsdict["salt"])

    del order["exchangeAddress"]  # type: ignore
    # silence mypy pending release of
    # https://github.com/python/mypy/issues/3550

    return order
