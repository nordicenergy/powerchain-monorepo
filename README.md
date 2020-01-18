
<img src="https://github.com/nordicenergy/powerchain/docs/branding/powerchain-Logo.png" width="150px">


# PowerChain Protocol Development-kit

#### PowerChain protocol reposity - includes our smart contracts and many developer tools
---

[powerchain][website-url] is an open protocol that facilitates trustless, low friction exchange of Ethereum-based assets. For more information on how it works, check out the [powerchain protocol specification](https://github.com/powerchainProject/powerchain-protocol-specification/blob/master/v2/v2-specification.md).

This repository is a monorepo including the powerchain protocol smart contracts and numerous developer tools. Each public sub-package is independently published to NPM.

[website-url]: https://powerchain.nordicenergy.io/protocol/

[![CircleCI](https://circleci.com/gh/powerchainProject/powerchain-monorepo.svg?style=svg&circle-token=61bf7cd8c9b4e11b132089dfcffdd1be277d1e0c)](https://circleci.com/gh/powerchainProject/powerchain-monorepo)
[![Coverage Status](https://coveralls.io/repos/github/powerchainProject/powerchain-monorepo/badge.svg?branch=development)](https://coveralls.io/github/powerchainProject/powerchain-monorepo?branch=development)
[![Discord](https://img.shields.io/badge/chat-discord.chat-yellow.svg?style=flat)](https://discordapp.com/invite/d3FTX3M)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Packages

Visit our [developer portal](https://powerchain.org/docs/tools/order-utils) for a comprehensive list of core & community maintained packages. All packages maintained with this monorepo are listed below.

### Python Packages

| Package                                                        | Version                                                                                                             | Description                                                                                       |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [`powerchain-contract-addresses`](/python-packages/contract_addresses) | [![PyPI](https://img.shields.io/pypi/v/powerchain-contract-addresses.svg)](https://pypi.org/project/powerchain-contract-addresses/) | A tiny utility library for getting known deployed contract addresses for a particular network     |
| [`powerchain-contract-artifacts`](/python-packages/contract_artifacts) | [![PyPI](https://img.shields.io/pypi/v/powerchain-contract-artifacts.svg)](https://pypi.org/project/powerchain-contract-artifacts/) | powerchain smart contract compilation artifacts                                                           |
| [`powerchain-contract-wrappers`](/python-packages/contract_wrappers)   | [![PyPI](https://img.shields.io/pypi/v/powerchain-contract-wrappers.svg)](https://pypi.org/project/powerchain-contract-wrappers/)   | powerchain smart contract wrappers                                                                        |
| [`powerchain-json-schemas`](/python-packages/json_schemas)             | [![PyPI](https://img.shields.io/pypi/v/powerchain-json-schemas.svg)](https://pypi.org/project/powerchain-json-schemas/)             | powerchain-related JSON schemas                                                                           |
| [`powerchain-order-utils`](/python-packages/order_utils)               | [![PyPI](https://img.shields.io/pypi/v/powerchain-order-utils.svg)](https://pypi.org/project/powerchain-order-utils/)               | A set of utilities for generating, parsing, signing and validating powerchain orders                      |
| [`powerchain-sra-client`](/python-packages/sra_client)                 | [![PyPI](https://img.shields.io/pypi/v/powerchain-sra-client.svg)](https://pypi.org/project/powerchain-sra-client/)                 | A Python client for interacting with servers conforming to the Standard Relayer API specification |

### Solidity Packages

These packages are all under development. See [/contracts/README.md](/contracts/README.md) for a list of deployed packages.

| Package                                                             | Version                                                                                                                                     | Description                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@powerchain/contracts-asset-proxy`](/contracts/asset-proxy)               | [![npm](https://img.shields.io/npm/v/@powerchain/contracts-asset-proxy.svg)](https://www.npmjs.com/package/@powerchain/contracts-asset-proxy)               | [`AssetProxy`](https://github.com/powerchainProject/powerchain-protocol-specification/blob/master/v2/v2-specification.md#assetproxy) contracts used within the protocol                                                                                               |
| [`@powerchain/contracts-erc20`](/contracts/erc20)                           | [![npm](https://img.shields.io/npm/v/@powerchain/contracts-erc20.svg)](https://www.npmjs.com/package/@powerchain/contracts-erc20)                           | Implementations of various ERC20 tokens                                                                                                                                                                                                               |
| [`@powerchain/contracts-erc721`](/contracts/erc721)                         | [![npm](https://img.shields.io/npm/v/@powerchain/contracts-erc721.svg)](https://www.npmjs.com/package/@powerchain/contracts-erc721)                         | Implementations of various ERC721 tokens                                                                                                                                                                                                              |
| [`@powerchain/contracts-erc1155`](/contracts/erc1155)                       | [![npm](https://img.shields.io/npm/v/@powerchain/contracts-erc1155.svg)](https://www.npmjs.com/package/@powerchain/contracts-erc1155)                       | Implementations of various ERC1155 tokens                                                                                                                                                                                                             |
| [`@powerchain/contracts-exchange`](/contracts/exchange)                     | [![npm](https://img.shields.io/npm/v/@powerchain/contracts-exchange.svg)](https://www.npmjs.com/package/@powerchain/contracts-exchange)                     | The [`Exchange`](https://github.com/powerchainProject/powerchain-protocol-specification/blob/master/v2/v2-specification.md#exchange) contract used for settling trades within the protocol                                                                            |
| [`@powerchain/contracts-exchange-forwarder`](/contracts/exchange-forwarder) | [![npm](https://img.shields.io/npm/v/@powerchain/contracts-exchange-forwarder.svg)](https://www.npmjs.com/package/@powerchain/contracts-exchange-forwarder) | A [`Forwarder`](https://github.com/powerchainProject/powerchain-protocol-specification/blob/master/v2/forwarder-specification.md) contract used to simplify UX for interacting with the protocol                                                                      |
| [`@powerchain/contracts-exchange-libs`](/contracts/exchange-libs)           | [![npm](https://img.shields.io/npm/v/@powerchain/contracts-exchange-libs.svg)](https://www.npmjs.com/package/@powerchain/contracts-exchange-libs)           | Protocol specific libraries used within the [`Exchange`](https://github.com/powerchainProject/powerchain-protocol-specification/blob/master/v2/v2-specification.md#exchange) contract                                                                                 |
| [`@powerchain/contracts-extensions`](/contracts/extensions)                 | [![npm](https://img.shields.io/npm/v/@powerchain/contracts-extensions.svg)](https://www.npmjs.com/package/@powerchain/contracts-extensions)                 | Contracts that interact with and extend the functionality of the core protocol                                                                                                                                                                        |
| [`@powerchain/contracts-multisig`](/contracts/multisig)                     | [![npm](https://img.shields.io/npm/v/@powerchain/contracts-multisig.svg)](https://www.npmjs.com/package/@powerchain/contracts-multisig)                     | Various implementations of multisignature wallets, including the [`AssetProxyOwner`](https://github.com/powerchainProject/powerchain-protocol-specification/blob/master/v2/v2-specification.md#assetproxyowner) contract that has permissions to upgrade the protocol |
| [`@powerchain/contracts-test-utils`](/contracts/test-utils)                 | [![npm](https://img.shields.io/npm/v/@powerchain/contracts-test-utils.svg)](https://www.npmjs.com/package/@powerchain/contracts-test-utils)                 | TypeScript/Javascript shared utilities used for testing contracts                                                                                                                                                                                     |
| [`@powerchain/contracts-utils`](/contracts/utils)                           | [![npm](https://img.shields.io/npm/v/@powerchain/contracts-utils.svg)](https://www.npmjs.com/package/@powerchain/contracts-utils)                           | Generic libraries and utilities used throughout all of the contracts                                                                                                                                                                                  |
| [`@powerchain/contracts-coordinator`](/contracts/coordinator)               | [![npm](https://img.shields.io/npm/v/@powerchain/contracts-coordinator.svg)](https://www.npmjs.com/package/@powerchain/contracts-coordinator)               | A contract that allows users to execute powerchain transactions with permission from a Coordinator                                                                                                                                                            |
| [`@powerchain/contracts-dev-utils`](/contracts/dev-utils)                   | [![npm](https://img.shields.io/npm/v/@powerchain/contracts-dev-utils.svg)](https://www.npmjs.com/package/@powerchain/contracts-dev-utils)                   | A contract contains utility functions for developers (such as validating many orders using a single eth_call)                                                                                                                                         |
| [`@powerchain/contracts-staking`](/contracts/staking)                       | [![npm](https://img.shields.io/npm/v/@powerchain/contracts-staking.svg)](https://www.npmjs.com/package/@powerchain/contracts-staking)                       | Implements the stake-based liquidity incentives defined by [`ZEIP-31`](https://github.com/powerchainProject/ZEIPs/issues/31)                                                                                                                                  |

### TypeScript/Javascript Packages

#### powerchain-specific packages

| Package                                                  | Version                                                                                                                 | Description                                                                                       |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [`powerchain.js`](/packages/powerchain.js)                               | [![npm](https://img.shields.io/npm/v/powerchain.js.svg)](https://www.npmjs.com/package/powerchain.js)                                   | An aggregate package combining many smaller utility packages for interacting with the powerchain protocol |
| [`@powerchain/contract-addresses`](/packages/contract-addresses) | [![npm](https://img.shields.io/npm/v/@powerchain/contract-addresses.svg)](https://www.npmjs.com/package/@powerchain/contract-addresses) | A tiny utility library for getting known deployed contract addresses for a particular network.    |
| [`@powerchain/contract-wrappers`](/packages/contract-wrappers)   | [![npm](https://img.shields.io/npm/v/@powerchain/contract-wrappers.svg)](https://www.npmjs.com/package/@powerchain/contract-wrappers)   | JS/TS wrappers for interacting with the powerchain smart contracts                                        |
| [`@powerchain/order-utils`](/packages/order-utils)               | [![npm](https://img.shields.io/npm/v/@powerchain/order-utils.svg)](https://www.npmjs.com/package/@powerchain/order-utils)               | A set of utilities for generating, parsing, signing and validating powerchain orders                      |
| [`@powerchain/json-schemas`](/packages/json-schemas)             | [![npm](https://img.shields.io/npm/v/@powerchain/json-schemas.svg)](https://www.npmjs.com/package/@powerchain/json-schemas)             | powerchain-related JSON schemas                                                                           |  |
| [`@powerchain/migrations`](/packages/migrations)                 | [![npm](https://img.shields.io/npm/v/@powerchain/migrations.svg)](https://www.npmjs.com/package/@powerchain/migrations)                 | Migration tool for deploying powerchain smart contracts on private testnets                               |
| [`@powerchain/contract-artifacts`](/packages/contract-artifacts) | [![npm](https://img.shields.io/npm/v/@powerchain/contract-artifacts.svg)](https://www.npmjs.com/package/@powerchain/contract-artifacts) | powerchain smart contract compilation artifacts                                                           |  |
| [`@powerchain/sra-spec`](/packages/sra-spec)                     | [![npm](https://img.shields.io/npm/v/@powerchain/sra-spec.svg)](https://www.npmjs.com/package/@powerchain/sra-spec)                     | OpenAPI specification for the Standard Relayer API                                                |
| [`@powerchain/connect`](/packages/connect)                       | [![npm](https://img.shields.io/npm/v/@powerchain/connect.svg)](https://www.npmjs.com/package/@powerchain/connect)                       | An HTTP/WS client for interacting with the Standard Relayer API                                   |
| [`@powerchain/asset-swapper`](/packages/asset-swapper)           | [![npm](https://img.shields.io/npm/v/@powerchain/asset-swapper.svg)](https://www.npmjs.com/package/@powerchain/asset-swapper)           | Convenience package for discovering and performing swaps for any ERC20 Assets                     |

#### Ethereum tooling

| Package                                      | Version                                                                                                     | Description                                                                                                                                                                             |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@powerchain/web3-wrapper`](/packages/web3-wrapper) | [![npm](https://img.shields.io/npm/v/@powerchain/web3-wrapper.svg)](https://www.npmjs.com/package/@powerchain/web3-wrapper) | An Ethereum JSON RPC client                                                                                                                                                             |
| [`@powerchain/sol-compiler`](/packages/sol-compiler) | [![npm](https://img.shields.io/npm/v/@powerchain/sol-compiler.svg)](https://www.npmjs.com/package/@powerchain/sol-compiler) | A wrapper around solc-js that adds smart re-compilation, ability to compile an entire project, Solidity version specific compilation, standard input description support and much more. |
| [`@powerchain/sol-coverage`](/packages/sol-coverage) | [![npm](https://img.shields.io/npm/v/@powerchain/sol-coverage.svg)](https://www.npmjs.com/package/@powerchain/sol-coverage) | A solidity test coverage tool                                                                                                                                                           |
| [`@powerchain/sol-profiler`](/packages/sol-profiler) | [![npm](https://img.shields.io/npm/v/@powerchain/sol-profiler.svg)](https://www.npmjs.com/package/@powerchain/sol-profiler) | A solidity gas cost profiler                                                                                                                                                            |
| [`@powerchain/sol-trace`](/packages/sol-trace)       | [![npm](https://img.shields.io/npm/v/@powerchain/sol-trace.svg)](https://www.npmjs.com/package/@powerchain/sol-trace)       | A solidity stack trace tool                                                                                                                                                             |
| [`@powerchain/sol-resolver`](/packages/sol-resolver) | [![npm](https://img.shields.io/npm/v/@powerchain/sol-resolver.svg)](https://www.npmjs.com/package/@powerchain/sol-resolver) | Import resolver for smart contracts dependencies                                                                                                                                        |
| [`@powerchain/subproviders`](/packages/subproviders) | [![npm](https://img.shields.io/npm/v/@powerchain/subproviders.svg)](https://www.npmjs.com/package/@powerchain/subproviders) | Web3 provider middlewares (e.g. LedgerSubprovider)                                                                                                                                      |
| [`@powerchain/sol-doc`](/packages/sol-doc)           | [![npm](https://img.shields.io/npm/v/@powerchain/sol-doc.svg)](https://www.npmjs.com/package/@powerchain/sol-doc)           | Solidity documentation generator                                                                                                                                                        |

#### Utilities

| Package                                                  | Version                                                                                                                 | Description                                                     |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [`@powerchain/abi-gen`](/packages/abi-gen)                       | [![npm](https://img.shields.io/npm/v/@powerchain/abi-gen.svg)](https://www.npmjs.com/package/@powerchain/abi-gen)                       | Tool to generate TS wrappers from smart contract ABIs           |
| [`@powerchain/tslint-config`](/packages/tslint-config)           | [![npm](https://img.shields.io/npm/v/@powerchain/tslint-config.svg)](https://www.npmjs.com/package/@powerchain/tslint-config)           | Custom TSLint rules used by the powerchain core team                    |
| [`@powerchain/types`](/packages/types)                           | [![npm](https://img.shields.io/npm/v/@powerchain/types.svg)](https://www.npmjs.com/package/@powerchain/types)                           | Shared type declarations                                        |
| [`@powerchain/typescript-typings`](/packages/typescript-typings) | [![npm](https://img.shields.io/npm/v/@powerchain/typescript-typings.svg)](https://www.npmjs.com/package/@powerchain/typescript-typings) | Repository of types for external packages                       |
| [`@powerchain/utils`](/packages/utils)                           | [![npm](https://img.shields.io/npm/v/@powerchain/utils.svg)](https://www.npmjs.com/package/@powerchain/utils)                           | Shared utilities                                                |
| [`@powerchain/assert`](/packages/assert)                         | [![npm](https://img.shields.io/npm/v/@powerchain/assert.svg)](https://www.npmjs.com/package/@powerchain/assert)                         | Type and schema assertions used by our packages                 |
| [`@powerchain/base-contract`](/packages/base-contract)           | [![npm](https://img.shields.io/npm/v/@powerchain/base-contract.svg)](https://www.npmjs.com/package/@powerchain/base-contract)           | BaseContract used by auto-generated `abi-gen` wrapper contracts |
| [`@powerchain/dev-utils`](/packages/dev-utils)                   | [![npm](https://img.shields.io/npm/v/@powerchain/dev-utils.svg)](https://www.npmjs.com/package/@powerchain/dev-utils)                   | Dev utils to be shared across powerchain packages                       |

#### Private Packages

| Package                            | Description                                                                      |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| [`@powerchain/instant`](/packages/instant) | A free and flexible way to offer simple crypto purchasing in any app or website. |

## Usage

Node version 6.x or 8.x is required.

Most of the packages require additional typings for external dependencies.
You can include those by prepending the `@powerchain/typescript-typings` package to your [`typeRoots`](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html) config.

```json
"typeRoots": ["node_modules/@powerchain/typescript-typings/types", "node_modules/@types"],
```

## Contributing

We strongly recommend that the community help us make improvements and determine the future direction of the protocol. To report bugs within this package, please create an issue in this repository.

#### Read our [contribution guidelines](./CONTRIBUTING.md).

### Install dependencies

Make sure you are using Yarn v1.9.4. To install using brew:

```bash
brew install yarn@1.9.4
```

Then install dependencies

```bash
yarn install
```

You will also need to have Python 3 installed, in order to build and run the tests of `abi-gen`'s command-line interface, which is integrated with the yarn build, yarn test, and yarn lint commands described below. More specifically, your local pip should resolve to the Python 3 version of pip, not a Python 2.x version.

### Build

To build all packages:

```bash
yarn build
```

To build a specific package:

```bash
PKG=@powerchain/web3-wrapper yarn build
```

To build all contracts packages:

```bash
yarn build:contracts
```

### Watch

To re-build all packages on change:

```bash
yarn watch
```

To watch a specific package and all it's dependent packages:

```bash
PKG=[NPM_PACKAGE_NAME] yarn watch

e.g
PKG=@powerchain/web3-wrapper yarn watch
```

### Clean

Clean all packages:

```bash
yarn clean
```

Clean a specific package

```bash
PKG=powerchain.js yarn clean
```

### Rebuild

To re-build (clean & build) all packages:

```bash
yarn rebuild
```

To re-build (clean & build) a specific package & it's deps:

```bash
PKG=powerchain.js yarn rebuild
```

### Lint

Lint all packages:

```bash
yarn lint
```

Lint a specific package:

```bash
PKG=powerchain.js yarn lint
```

### Run Tests

Run all tests:

```bash
yarn test
```

Run a specific package's test:

```bash
PKG=@powerchain/web3-wrapper yarn test
```

Run all contracts packages tests:

```bash
yarn test:contracts
```
