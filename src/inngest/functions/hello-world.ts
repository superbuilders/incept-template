import { inngest } from "@/inngest/client"

export const helloWorldFunction = inngest.createFunction(
	{ id: "hello-world", name: "template.hello-world" },
	{ event: "template/hello" },
	async ({ event, logger }) => {
		logger.info("Hello from Inngest!", {
			message: event.data.message
		})

		return {
			acknowledged: true
		}
	}
)
