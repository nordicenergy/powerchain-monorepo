## @powerchain/sol-resolver

A Solidity import resolver used by [sol-compiler](https://github.com/nordicenergy/powerchain-protocol-dev-kit/tree/development/packages/sol-compiler).

## Installation

```bash
yarn add @powerchain/sol-resolver
```

**Import**

```javascript
import { Resolver } from '@powerchain/sol-resolver';
```

or

```javascript
var Resolver = require('@powerchain/sol-resolver').Resolver;
```

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
PKG=@powerchain/sol-resolver yarn build
```

Or continuously rebuild on change:

```bash
PKG=@powerchain/sol-resolver yarn watch
```

### Clean

```bash
yarn clean
```

### Lint

```bash
yarn lint
```
