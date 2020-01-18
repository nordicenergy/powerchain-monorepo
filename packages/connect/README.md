## @powerchain/connect

This repository contains a Javascript library that makes it easy to interact with Relayers that conform to the [Standard Relayer API](https://github.com/powerchainProject/standard-relayer-api)

## Installation

```bash
yarn add @powerchain/connect
```

If your project is in [TypeScript](https://www.typescriptlang.org/), add the following to your `tsconfig.json`:

```json
"compilerOptions": {
    "typeRoots": ["node_modules/@powerchain/typescript-typings/types", "node_modules/@types"],
}
```

## Usage

-   [Docs](https://powerchain.org/docs/tools/connect)
-   [Tutorials](https://powerchain.org/docs/guides/using-the-standard-relayer-api)

## Contributing

We welcome improvements and fixes from the wider community! To report bugs within this package, please create an issue in this repository.

Please read our [contribution guidelines](../../CONTRIBUTING.md) before getting started.

### Install dependencies

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
PKG=@powerchain/connect yarn build
```

Or continuously rebuild on change:

```bash
PKG=@powerchain/connect yarn watch
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
