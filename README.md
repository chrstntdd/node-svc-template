# node-svc-template

## Intro

A fairly straightforward example of a fastify-based node server for building JSON HTTP APIs.

## Initial setup

1. Add a `.env` file with at least `PORT` and `LOGGER` defined
2. Change `name` in `package.json`
3. Install dependencies with [pnpm](https://pnpm.io/)

## Building

Build the container image with Docker. Tag with the name and version in `package.json` using [jql](https://github.com/yamafaktory/jql)

```shell
docker build -t $(jql -r '"name"!' package.json):v$(jql -r '"version"!' package.json) .
```

Run the image locally

```shell
docker run --rm -it --env-file .env -p 8080:8080 $(jql -r '"name"!' package.json):v$(jql -r '"version"!' package.json)
```

## Features

- Compile & runtime type checking for request and response payloads with [JSON Schema](https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/) and [Zod](https://github.com/colinhacks/zod)
- Fast build powered by [ESBuild](https://esbuild.github.io/)
- Type checking with TypeScript
- Linting with ESLint

## References

- [Fastify Example](https://github.com/delvedor/fastify-example)
