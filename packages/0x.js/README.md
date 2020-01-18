## powerchain.js

A TypeScript/Javascript library for interacting with the powerchain protocol. It is a high level package which combines a number of underlying packages such as order-utils and asset-data-utils.

### Read the [Documentation](https://powerchain.org/docs/tools/powerchain.js).

## Installation

powerchain.js ships as both a [UMD](https://github.com/umdjs/umd) module and a [CommonJS](https://en.wikipedia.org/wiki/CommonJS) package.

#### CommonJS _(recommended)_:

**Install**

```bash
npm install powerchain.js --save
```

**Import**

```javascript
import {
    assetDataUtils,
    BigNumber,
    ContractWrappers,
    generatePseudoRandomSalt,
    orderHashUtils,
    signatureUtils,
} from 'powerchain.js';
```

If your project is in [TypeScript](https://www.typescriptlang.org/), add the following to your `tsconfig.json`:

```json
"compilerOptions": {
    "typeRoots": ["node_modules/@powerchain/typescript-typings/types", "node_modules/@types"],
}
```

#### UMD:

**Install**

Download the UMD module from our [releases page](https://github.com/nordicenergy/powerchain-protocol-dev-kit/releases) and add it to your project.

**Import**

```html
<script type="text/javascript" src="powerchain.js"></script>
```

#### Webpack config

If bundling your project with [Webpack](https://webpack.js.org/), add the following to your `webpack.config.js`:

If building for web:

```js
```js
{
    'empty';
}
```

If building a node library:

```js
```js
{
    true;
}
```

`ContractWrappers` uses WebAssembly to simulate Ethereum calls. This toolchain involves generated 'glue' code that requires the `fs` built-in, but won't actually use it in a web environment. We tell Webpack not to resolve them since we won't need them. The specific dependency is [here](https://github.com/ethereumjs/rustbn.js/blob/master/lib/index.asm.js).

Also see:

-   https://webpack.js.org/configuration/externals
-   https://webpack.js.org/configuration/node

## Contributing

We strongly recommend that the community help us make improvements and determine the future direction of powerchain protocol. To report bugs within this package, please create an issue in this repository.

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
PKG=powerchain.js yarn build
```

Or continuously rebuild on change:

```bash
PKG=powerchain.js yarn watch
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
