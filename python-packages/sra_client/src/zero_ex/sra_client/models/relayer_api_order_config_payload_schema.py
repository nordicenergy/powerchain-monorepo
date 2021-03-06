# coding: utf-8


import pprint
import re  # noqa: F401

import six


class RelayerApiOrderConfigPayloadSchema(object):
    """
    Attributes:
      openapi_types (dict): The key is attribute name
                            and the value is attribute type.
      attribute_map (dict): The key is attribute name
                            and the value is json key in definition.
    """
    openapi_types = {
        "maker_address": "str",
        "taker_address": "str",
        "maker_asset_amount": "str",
        "taker_asset_amount": "str",
        "maker_asset_data": "str",
        "taker_asset_data": "str",
        "exchange_address": "str",
        "expiration_time_seconds": "str",
    }

    attribute_map = {
        "maker_address": "makerAddress",
        "taker_address": "takerAddress",
        "maker_asset_amount": "makerAssetAmount",
        "taker_asset_amount": "takerAssetAmount",
        "maker_asset_data": "makerAssetData",
        "taker_asset_data": "takerAssetData",
        "exchange_address": "exchangeAddress",
        "expiration_time_seconds": "expirationTimeSeconds",
    }

    def __init__(
        self,
        maker_address=None,
        taker_address=None,
        maker_asset_amount=None,
        taker_asset_amount=None,
        maker_asset_data=None,
        taker_asset_data=None,
        exchange_address=None,
        expiration_time_seconds=None,
    ):  # noqa: E501
        """RelayerApiOrderConfigPayloadSchema - a model defined in OpenAPI"""  # noqa: E501

        self._maker_address = None
        self._taker_address = None
        self._maker_asset_amount = None
        self._taker_asset_amount = None
        self._maker_asset_data = None
        self._taker_asset_data = None
        self._exchange_address = None
        self._expiration_time_seconds = None
        self.discriminator = None

        self.maker_address = maker_address
        self.taker_address = taker_address
        self.maker_asset_amount = maker_asset_amount
        self.taker_asset_amount = taker_asset_amount
        self.maker_asset_data = maker_asset_data
        self.taker_asset_data = taker_asset_data
        self.exchange_address = exchange_address
        self.expiration_time_seconds = expiration_time_seconds

    @property
    def maker_address(self):
        """Gets the maker_address of this RelayerApiOrderConfigPayloadSchema.


        :return: The maker_address of this RelayerApiOrderConfigPayloadSchema.
        :rtype: str
        """
        return self._maker_address

    @maker_address.setter
    def maker_address(self, maker_address):
        """Sets the maker_address of this RelayerApiOrderConfigPayloadSchema.


        :param maker_address: The maker_address of this RelayerApiOrderConfigPayloadSchema.
        :type: str
        """
        if maker_address is None:
            raise ValueError(
                "Invalid value for `maker_address`, must not be `None`"
            )  # noqa: E501
        if maker_address is not None and not re.search(
            r"^powerchain[0-9a-f]{40}$", maker_address
        ):  # noqa: E501
            raise ValueError(
                r"Invalid value for `maker_address`, must be a follow pattern or equal to `/^powerchain[0-9a-f]{40}$/`"
            )  # noqa: E501

        self._maker_address = maker_address

    @property
    def taker_address(self):
        """Gets the taker_address of this RelayerApiOrderConfigPayloadSchema.


        :return: The taker_address of this RelayerApiOrderConfigPayloadSchema.
        :rtype: str
        """
        return self._taker_address

    @taker_address.setter
    def taker_address(self, taker_address):
        """Sets the taker_address of this RelayerApiOrderConfigPayloadSchema.


        :param taker_address: The taker_address of this RelayerApiOrderConfigPayloadSchema.
        :type: str
        """
        if taker_address is None:
            raise ValueError(
                "Invalid value for `taker_address`, must not be `None`"
            )  # noqa: E501
        if taker_address is not None and not re.search(
            r"^powerchain[0-9a-f]{40}$", taker_address
        ):  # noqa: E501
            raise ValueError(
                r"Invalid value for `taker_address`, must be a follow pattern or equal to `/^powerchain[0-9a-f]{40}$/`"
            )  # noqa: E501

        self._taker_address = taker_address

    @property
    def maker_asset_amount(self):
        """Gets the maker_asset_amount of this RelayerApiOrderConfigPayloadSchema.


        :return: The maker_asset_amount of this RelayerApiOrderConfigPayloadSchema.
        :rtype: str
        """
        return self._maker_asset_amount

    @maker_asset_amount.setter
    def maker_asset_amount(self, maker_asset_amount):
        """Sets the maker_asset_amount of this RelayerApiOrderConfigPayloadSchema.


        :param maker_asset_amount: The maker_asset_amount of this RelayerApiOrderConfigPayloadSchema.
        :type: str
        """
        if maker_asset_amount is None:
            raise ValueError(
                "Invalid value for `maker_asset_amount`, must not be `None`"
            )  # noqa: E501
        if maker_asset_amount is not None and not re.search(
            r"^\d+$", maker_asset_amount
        ):  # noqa: E501
            raise ValueError(
                r"Invalid value for `maker_asset_amount`, must be a follow pattern or equal to `/^\d+$/`"
            )  # noqa: E501

        self._maker_asset_amount = maker_asset_amount

    @property
    def taker_asset_amount(self):
        """Gets the taker_asset_amount of this RelayerApiOrderConfigPayloadSchema.


        :return: The taker_asset_amount of this RelayerApiOrderConfigPayloadSchema.
        :rtype: str
        """
        return self._taker_asset_amount

    @taker_asset_amount.setter
    def taker_asset_amount(self, taker_asset_amount):
        """Sets the taker_asset_amount of this RelayerApiOrderConfigPayloadSchema.


        :param taker_asset_amount: The taker_asset_amount of this RelayerApiOrderConfigPayloadSchema.
        :type: str
        """
        if taker_asset_amount is None:
            raise ValueError(
                "Invalid value for `taker_asset_amount`, must not be `None`"
            )  # noqa: E501
        if taker_asset_amount is not None and not re.search(
            r"^\d+$", taker_asset_amount
        ):  # noqa: E501
            raise ValueError(
                r"Invalid value for `taker_asset_amount`, must be a follow pattern or equal to `/^\d+$/`"
            )  # noqa: E501

        self._taker_asset_amount = taker_asset_amount

    @property
    def maker_asset_data(self):
        """Gets the maker_asset_data of this RelayerApiOrderConfigPayloadSchema.


        :return: The maker_asset_data of this RelayerApiOrderConfigPayloadSchema.
        :rtype: str
        """
        return self._maker_asset_data

    @maker_asset_data.setter
    def maker_asset_data(self, maker_asset_data):
        """Sets the maker_asset_data of this RelayerApiOrderConfigPayloadSchema.


        :param maker_asset_data: The maker_asset_data of this RelayerApiOrderConfigPayloadSchema.
        :type: str
        """
        if maker_asset_data is None:
            raise ValueError(
                "Invalid value for `maker_asset_data`, must not be `None`"
            )  # noqa: E501
        if maker_asset_data is not None and not re.search(
            r"^powerchain(([0-9a-f][0-9a-f])+)?$", maker_asset_data
        ):  # noqa: E501
            raise ValueError(
                r"Invalid value for `maker_asset_data`, must be a follow pattern or equal to `/^powerchain(([0-9a-f][0-9a-f])+)?$/`"
            )  # noqa: E501

        self._maker_asset_data = maker_asset_data

    @property
    def taker_asset_data(self):
        """Gets the taker_asset_data of this RelayerApiOrderConfigPayloadSchema.


        :return: The taker_asset_data of this RelayerApiOrderConfigPayloadSchema.
        :rtype: str
        """
        return self._taker_asset_data

    @taker_asset_data.setter
    def taker_asset_data(self, taker_asset_data):
        """Sets the taker_asset_data of this RelayerApiOrderConfigPayloadSchema.


        :param taker_asset_data: The taker_asset_data of this RelayerApiOrderConfigPayloadSchema.
        :type: str
        """
        if taker_asset_data is None:
            raise ValueError(
                "Invalid value for `taker_asset_data`, must not be `None`"
            )  # noqa: E501
        if taker_asset_data is not None and not re.search(
            r"^powerchain(([0-9a-f][0-9a-f])+)?$", taker_asset_data
        ):  # noqa: E501
            raise ValueError(
                r"Invalid value for `taker_asset_data`, must be a follow pattern or equal to `/^powerchain(([0-9a-f][0-9a-f])+)?$/`"
            )  # noqa: E501

        self._taker_asset_data = taker_asset_data

    @property
    def exchange_address(self):
        """Gets the exchange_address of this RelayerApiOrderConfigPayloadSchema.


        :return: The exchange_address of this RelayerApiOrderConfigPayloadSchema.
        :rtype: str
        """
        return self._exchange_address

    @exchange_address.setter
    def exchange_address(self, exchange_address):
        """Sets the exchange_address of this RelayerApiOrderConfigPayloadSchema.


        :param exchange_address: The exchange_address of this RelayerApiOrderConfigPayloadSchema.
        :type: str
        """
        if exchange_address is None:
            raise ValueError(
                "Invalid value for `exchange_address`, must not be `None`"
            )  # noqa: E501
        if exchange_address is not None and not re.search(
            r"^powerchain[0-9a-f]{40}$", exchange_address
        ):  # noqa: E501
            raise ValueError(
                r"Invalid value for `exchange_address`, must be a follow pattern or equal to `/^powerchain[0-9a-f]{40}$/`"
            )  # noqa: E501

        self._exchange_address = exchange_address

    @property
    def expiration_time_seconds(self):
        """Gets the expiration_time_seconds of this RelayerApiOrderConfigPayloadSchema.


        :return: The expiration_time_seconds of this RelayerApiOrderConfigPayloadSchema.
        :rtype: str
        """
        return self._expiration_time_seconds

    @expiration_time_seconds.setter
    def expiration_time_seconds(self, expiration_time_seconds):
        """Sets the expiration_time_seconds of this RelayerApiOrderConfigPayloadSchema.


        :param expiration_time_seconds: The expiration_time_seconds of this RelayerApiOrderConfigPayloadSchema.
        :type: str
        """
        if expiration_time_seconds is None:
            raise ValueError(
                "Invalid value for `expiration_time_seconds`, must not be `None`"
            )  # noqa: E501
        if expiration_time_seconds is not None and not re.search(
            r"^\d+$", expiration_time_seconds
        ):  # noqa: E501
            raise ValueError(
                r"Invalid value for `expiration_time_seconds`, must be a follow pattern or equal to `/^\d+$/`"
            )  # noqa: E501

        self._expiration_time_seconds = expiration_time_seconds

    def to_dict(self):
        """Returns the model properties as a dict"""
        result = {}

        for attr, _ in six.iteritems(self.openapi_types):
            value = getattr(self, attr)
            if isinstance(value, list):
                result[attr] = list(
                    map(
                        lambda x: x.to_dict() if hasattr(x, "to_dict") else x,
                        value,
                    )
                )
            elif hasattr(value, "to_dict"):
                result[attr] = value.to_dict()
            elif isinstance(value, dict):
                result[attr] = dict(
                    map(
                        lambda item: (item[0], item[1].to_dict())
                        if hasattr(item[1], "to_dict")
                        else item,
                        value.items(),
                    )
                )
            else:
                result[attr] = value

        return result

    def to_str(self):
        """Returns the string representation of the model"""
        return pprint.pformat(self.to_dict())

    def __repr__(self):
        """For `print` and `pprint`"""
        return self.to_str()

    def __eq__(self, other):
        """Returns true if both objects are equal"""
        if not isinstance(other, RelayerApiOrderConfigPayloadSchema):
            return False

        return self.__dict__ == other.__dict__

    def __ne__(self, other):
        """Returns true if both objects are not equal"""
        return not self == other
