import * as fs from "node:fs/promises"
import * as path from "node:path"
import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { inngest } from "@/inngest/client"

function getMimeTypeFromExtension(
	filePath: string
): "image/png" | "image/jpeg" | "image/webp" | "image/gif" {
	const ext = path.extname(filePath).toLowerCase()
	const mimeTypes: Record<
		string,
		"image/png" | "image/jpeg" | "image/webp" | "image/gif"
	> = {
		".png": "image/png",
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
		".webp": "image/webp",
		".gif": "image/gif"
	}

	const mimeType = mimeTypes[ext]
	if (!mimeType) {
		logger.error("unsupported image extension", { extension: ext, filePath })
		throw errors.new(`unsupported image extension: ${ext}`)
	}

	return mimeType
}

async function main() {
	logger.info("testing assessment item generation from envelope")

	const [, , imagePath] = process.argv
	const jobId = crypto.randomUUID()
	logger.info("created job id", { jobId, imagePath })

	const multimodalImagePayloads = []

	if (!imagePath) {
		logger.error("image path not provided")
		throw errors.new("image path not provided")
	}

	logger.info("reading image file", { imagePath })

	const fileReadResult = await errors.try(fs.readFile(imagePath))
	if (fileReadResult.error) {
		logger.error("failed to read image file", {
			imagePath,
			error: fileReadResult.error
		})
		throw errors.wrap(fileReadResult.error, "read image file")
	}

	const buffer = fileReadResult.data
	const base64 = buffer.toString("base64")

	const mimeTypeResult = errors.trySync(() =>
		getMimeTypeFromExtension(imagePath)
	)
	if (mimeTypeResult.error) {
		logger.error("failed to determine mime type", {
			imagePath,
			error: mimeTypeResult.error
		})
		throw errors.wrap(mimeTypeResult.error, "determine mime type")
	}

	multimodalImagePayloads.push({
		dataBase64: base64,
		mimeType: mimeTypeResult.data
	})

	logger.info("image file loaded", {
		imagePath,
		mimeType: mimeTypeResult.data,
		sizeBytes: buffer.byteLength
	})

	const envelope = {
		primaryContent:
			"Analyze the image provided and create a multiple choice question that tests understanding of what is shown. The question should have 4 answer choices with exactly one correct answer.",
		supplementaryContent: [],
		multimodalImageUrls: [],
		multimodalImagePayloads,
		pdfPayloads: []
	}

	const eventResult = await errors.try(
		inngest.send({
			id: `assessment-generation-${jobId}`,
			name: "assessment/item.generation.requested",
			data: {
				jobId,
				widgetCollection: "all",
				envelope
			}
		})
	)
	if (eventResult.error) {
		logger.error("failed to send assessment item generation event", {
			error: eventResult.error
		})
		throw errors.wrap(
			eventResult.error,
			"send assessment item generation event"
		)
	}

	logger.info("assessment item generation event sent", {
		eventIds: eventResult.data.ids
	})
	logger.info("check inngest UI at http://localhost:8288 to see progress")
}

const result = await errors.try(main())
if (result.error) {
	logger.error("test script failed", { error: result.error })
	process.exit(1)
}
