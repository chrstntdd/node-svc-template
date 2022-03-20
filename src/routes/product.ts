import crypto from "crypto"

import fp from "fastify-plugin"
import type { FastifyPluginAsync } from "fastify"
import { z } from "zod"
import * as z2js from "zod-to-json-schema"

const { zodToJsonSchema } = z2js

const tProduct = z.object({
  id: z.string(),
  name: z.string(),
  /* Timestamp */
  created_at: z.string()
})

export default fp(
  async function gracefulExitPlugin(server, _) {
    const ROUTE_BASE = "/product"
    /***************************************************************************/

    let productList = z.array(tProduct)
    type ProductList = z.TypeOf<typeof productList>

    server.get<{ Reply: ProductList }>(
      ROUTE_BASE,
      { schema: { response: { 200: zodToJsonSchema(productList) } } },
      function handleRoot(_, reply) {
        /* Interacted with DB */
        let now = new Date().toISOString()
        reply.send([
          { id: "some-id", name: "A", created_at: now },
          { id: "another-id", name: "B", created_at: now }
        ])
      }
    )

    let inputProductList = z.object({
      productCollection: z.array(tProduct.omit({ id: true }))
    })
    let productIds = z.object({ productIds: z.array(z.string()) })

    type Req = z.TypeOf<typeof inputProductList>
    type ProductIds = z.TypeOf<typeof productIds>

    server.route<{ Body: Req; Reply: ProductIds }>({
      url: ROUTE_BASE,
      method: "POST",
      schema: {
        // @ts-expect-error is this deprecated???
        description: "Add one or more products",
        body: zodToJsonSchema(inputProductList),
        response: {
          201: zodToJsonSchema(productList)
        }
      },
      handler: function handleRoot(req, reply) {
        let productIds = req.body.productCollection.map(() =>
          crypto.randomBytes(16).toString("hex")
        )

        reply.send({ productIds })
      }
    })
  } as FastifyPluginAsync,
  "3.X"
)
