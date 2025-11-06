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
		AWS_REGION: z.string(),
		AWS_RDS_RESOURCE_ARN: z.string(),
		AWS_RDS_SECRET_ARN: z.string(),
		AWS_ACCESS_KEY_ID: z.string(),
		AWS_SECRET_ACCESS_KEY: z.string(),
		INNGEST_EVENT_KEY: z.string().optional(),
		INNGEST_SIGNING_KEY: z.string().optional(),
		OPENAI_API_KEY: z.string(),
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
		AWS_REGION: process.env.AWS_REGION,
		AWS_RDS_RESOURCE_ARN: process.env.AWS_RDS_RESOURCE_ARN,
		AWS_RDS_SECRET_ARN: process.env.AWS_RDS_SECRET_ARN,
		AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
		AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
		INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
		INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
		NODE_ENV: process.env.NODE_ENV,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY
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
