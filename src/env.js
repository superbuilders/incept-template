// biome-ignore-all lint/style/noProcessEnv: env wrapper needs to be able to access process.env
import * as logger from "@superbuilders/slog"
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

if (!process.env.NEXT_RUNTIME && typeof window === "undefined") {
	const { loadEnvConfig } = require("@next/env")
	const projectDir = process.cwd()
	loadEnvConfig(projectDir)
}

if (process.env.NODE_ENV === "development" && typeof window === "undefined") {
	logger.setDefaultLogLevel(logger.DEBUG)
}

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		AWS_RDS_RESOURCE_ARN: z.string(),
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development")
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		// NEXT_PUBLIC_CLIENTVAR: z.string(),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		AWS_RDS_RESOURCE_ARN: process.env.AWS_RDS_RESOURCE_ARN,
		NODE_ENV: process.env.NODE_ENV
		// NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	/**
	 * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
	 * `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true
})
