<div align="center">
    <h1 align="center">Highstorm</h1>
    <h5>Open Source Event Monitoring</h5>
</div>

<div align="center">
  <a href="https://highstorm.app?ref=github">highstorm.app</a>
</div>
<br/>



## Contributing


Set environment variables in `/apps/web/.env` file:

```sh-session
cp apps/web/.env.example apps/web/.env
```


### Install

```sh-session
pnpm install
```

### Build
  

```sh-session 
pnpm build
```

### Run

```sh-session
pnpm turbo run dev --filter=web
```
