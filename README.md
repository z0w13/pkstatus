# PKStatus

Display PluralKit systems and their current status

## App Screenshots

![A screenshot of the status page](/contrib/img/screenshot1.png?raw=true)

## Install the dependencies

```bash
pnpm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
pnpm run dev
```

### Lint the files

```bash
pnpm run lint
```

### Format the files

```bash
pnpm run format
```

### Build the app for production

```bash
# single-page application (webapp)
pnpm exec quasar build
# electron (desktop app)
pnpm exec quasar build -m electron -T [win|linux|mac]
```
