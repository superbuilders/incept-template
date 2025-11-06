import type { StimulusAsset } from "@/stimulus/types"

export function collectAssets(root: Element): StimulusAsset[] {
	const assets: StimulusAsset[] = []
	for (const img of Array.from(root.querySelectorAll("img"))) {
		const src = img.getAttribute("src")
		if (src) assets.push({ type: "image", url: src })
	}
	for (const iframe of Array.from(root.querySelectorAll("iframe"))) {
		const src = iframe.getAttribute("src")
		if (src) assets.push({ type: "iframe", url: src })
	}
	for (const link of Array.from(root.querySelectorAll("a"))) {
		const href = link.getAttribute("href")
		if (href) assets.push({ type: "link", url: href })
	}
	return assets
}
