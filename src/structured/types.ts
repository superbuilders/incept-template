// NEW: Add PdfPayload for raw PDF data
export interface PdfPayload {
	// Display name for traceability (e.g., "The Necklace.pdf")
	name: string
	// Raw PDF bytes (ArrayBuffer), NOT base64-encoded by callers
	data: ArrayBuffer
}

// NEW: Add RasterImagePayload for raw image data, unifying binary payloads
export interface RasterImagePayload {
	// Raw image bytes (ArrayBuffer)
	data: ArrayBuffer
	// The IANA MIME type for the image (e.g., "image/png", "image/jpeg")
	mimeType: "image/png" | "image/jpeg" | "image/webp" | "image/gif"
}

// MODIFIED: Update AiContextEnvelope to include all multimodal payloads
export interface AiContextEnvelope {
	primaryContent: string
	supplementaryContent: string[]
	multimodalImageUrls: string[]
	// MODIFIED: This field now holds structured raw image data
	multimodalImagePayloads: RasterImagePayload[]
	// NEW: Add required pdfPayloads array (may be empty)
	pdfPayloads: PdfPayload[]
}

export interface ImageContext {
	imageUrls: string[]
}
