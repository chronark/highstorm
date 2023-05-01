<div align="center">
    <h1 align="center">Highstorm</h1>
    <h5>Open Source Event Monitoring</h5>
</div>

<div align="center">
  <a href="https://highstorm.app?ref=github">highstorm.app</a>
</div>
<br/>

## Contributing

### Services

There are a few 3rd party services that are required to run the app:

- [planetscale](https://planetscale.com?ref=highstorm): Database
- [tinybird](https://www.tinybird.co?ref=highstorm): Time series database
- [upstash](https://upstash.com/qstash?ref=highstorm): Optional, only required for reports
- [clerk](https://clerk.com?ref=highstorm): Authentication

Set environment variables in `/apps/web/.env` file and populate the values from the services above.:

```sh-session
cp apps/web/.env.example apps/web/.env
```

### Install

```sh-session
pnpm install
```

### Prepare databases

#### Prisma

```sh-session
cd apps/web
npx prisma db push
```

#### Tinybird

Download the Tinybird CLI from [here](https://www.tinybird.co/docs/cli.html) and run the following command after authenticating:

```sh-session
cd apps/web/lib/tinybird
tb push datasources/
tb push
```

### Build

```sh-session
pnpm build
```

### Run

```sh-session
pnpm turbo run dev --filter=web
```
