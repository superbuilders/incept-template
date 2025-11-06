import type { Config } from "drizzle-kit"

import { env } from "@/env"

export default {
	schema: "./src/server/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: env.AWS_RDS_RESOURCE_ARN
	},
	tablesFilter: ["incept-template_*"]
} satisfies Config
