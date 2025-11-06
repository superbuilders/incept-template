export type CartridgeReader = {
	readText(relativePath: string): Promise<string>
	readBytes(relativePath: string): Promise<Uint8Array>
	exists(relativePath: string): Promise<boolean>
	list(prefix: string): Promise<string[]>
}
