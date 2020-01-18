## Integration Tests

This package implements integration tests against powerchain's smart contracts and will provide a location for external contracts to be tested alongside the powerchain smart contracts.

## Installation

**Install**

```bash
npm install @powerchain/contracts-integrations --save
```

## Contributing

We strongly recommend that the community help us make improvements and determine the future direction of the protocol. To report bugs within this package, please create an issue in this repository.

For proposals regarding the powerchain protocol's smart contract architecture, message format, or additional functionality, go to the [powerchain Improvement Proposals (ZEIPs)](https://github.com/powerchainProject/ZEIPs) repository and follow the contribution guidelines provided therein.

Please read our [contribution guidelines](../../CONTRIBUTING.md) before getting started.

### Install Dependencies

If you don't have yarn workspaces enabled (Yarn < v1.0) - enable them:

```bash
yarn config set workspaces-experimental true
```

Then install dependencies

```bash
yarn install
```

### Build

To build this package and all other monorepo packages that it depends on, run the following from the monorepo root directory:

```bash
PKG=@powerchain/contracts-integrations yarn build
```

Or continuously rebuild on change:

```bash
PKG=@powerchain/contracts-integrations yarn watch
```

### Clean

```bash
yarn clean
```

### Lint

```bash
yarn lint
```

### Run Tests

```bash
yarn test
```
