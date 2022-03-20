import fastify from "fastify"
import sensible from "fastify-sensible"
import env from "fastify-env"
import { z } from "zod"
import "dotenv/config"

import * as z2js from "zod-to-json-schema"

import gracefulExit from "./plugins/grace"
import product from "./routes/product"

const { zodToJsonSchema } = z2js

const PORT = (process.env.PORT && parseInt(process.env.PORT, 10)) || 8080
const ENV = process.env.NODE_ENV

let server = fastify({
  logger: ENV === "production" ? true : { prettyPrint: true }
})

server.register(env, {
  schema: zodToJsonSchema(
    z.object({
      PORT: z.string(),
      LOGGER: z.union([z.literal("pretty"), z.literal("prod")]).optional()
    })
  )
})
server.register(sensible)
server.register(gracefulExit)
server.register(product)

server.get("/healthz", async () => "OK!")

await server.listen(PORT, "0.0.0.0")
