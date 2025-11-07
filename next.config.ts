import type { NextConfig } from "next"
import "./src/env.ts"

const config = {
	reactStrictMode: true,
	reactCompiler: true,
	typedRoutes: true
} satisfies NextConfig

export default config
