# `seguro-worker-lib-worker` README

The seguro-worker-lib-worker library.

## Usage

Add as a dependency to a Node.js project:

```bash
yarn add @conet-project/seguro-worker-lib-worker
```

Import from the package:

```ts
import { Person, getGreeting } from '@conet-project/seguro-worker-lib-worker'

const person: Person = { name: 'John' }

console.log(getGreeting(person))
```

## Development

### Install

```bash
yarn
```

### Lint

```bash
yarn lint
```

### Build

```bash
yarn build
```

### Clean

```bash
yarn clean
```
