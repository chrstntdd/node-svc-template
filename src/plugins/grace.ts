import fp from "fastify-plugin"
import type { FastifyInstance, FastifyPluginCallback } from "fastify"

function setupGracefulExit(server: FastifyInstance) {
  let isShuttingDown = false

  function makeGracefulExitHandler(signal: string) {
    return async function gracefulExit() {
      if (isShuttingDown) return

      isShuttingDown = true

      server.log.info(`\nReceived kill signal (${signal})`)

      await server.close()
    }
  }

  ;["SIGINT", "SIGTERM", "SIGQUIT"].forEach((sig) => {
    process.on(sig, makeGracefulExitHandler(sig))
  })
}

export default fp(
  function gracefulExitPlugin(server, _, done) {
    setupGracefulExit(server)

    done()
  } as FastifyPluginCallback,
  "3.X"
)
