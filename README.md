# 📖 Introduction

A tool to help manage the ins and outs of a mystery tournament-style game show. Originally created for [Kusogrande](twitch.tv/brossentia).

# 🏗 Development

## Requirements

- [pnpm](https://pnpm.io/) to enable a monorepo setup with workspaces
- [Node Version Manager](https://github.com/nvm-sh/nvm) to maintain a consistent node version, and to keep the project environment clean

## Installation

```bash
# Install pnpm and nvm first
nvm use; pnpm i
```

## Building

MMD has three main projects: `client`, `common`, and `server`. Each one contains its own scripts.

```bash
pnpm run common build
      ...       clean

pnpm run client build
      ...       watch
      ...       clean

pnpm run server build
      ...       start
      ...       watch
      ...       clean

pnpm run build-all
pnpm run clean-all
```

# 💻 Production

```
pnpm install --production
pnpm run common build; pnpm i
pnpm run client build
pnpm run server build
```

# 🐋 Docker

To start your application:

Don't, I deleted this part until I decide I want to torture myself.

<!-- ```
docker-compose up -d
```

To shut down your application:

```
docker-compose down
```

To view your application's logs:

```
docker-compose logs
``` -->

For the full command list please view the [Docker Documentation](https://docs.docker.com/engine/reference/commandline/cli/).
