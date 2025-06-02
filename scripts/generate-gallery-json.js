import fs from 'fs'
import path from 'path'
import { imageSize } from 'image-size'

const galleryDir = path.join(process.cwd(), 'public', 'gallery')
const outputJson = path.join(process.cwd(), 'public', 'gallery.json')
const imageExtensions = [
	'.jpg',
	'.jpeg',
	'.png',
	'.gif',
	'.webp',
	'.bmp',
	'.svg',
]

function getImageFiles(dir) {
	return fs
		.readdirSync(dir)
		.filter((file) =>
			imageExtensions.includes(path.extname(file).toLowerCase())
		)
}

function buildGalleryJson(files) {
	return files.map((filename) => {
		const filepath = path.join(galleryDir, filename)
		let dimensions = { width: null, height: null }
		try {
			// Pass the file path string directly
			dimensions = imageSize(filepath)
		} catch (err) {
			console.warn(
				`Could not get dimensions for ${filename}:`,
				err.message
			)
		}
		const stats = fs.statSync(filepath)
		return {
			name: path.parse(filename).name,
			url: `/gallery/${filename}`,
			width: dimensions.width,
			height: dimensions.height,
			type: path.extname(filename).slice(1),
			size: stats.size, // in bytes
		}
	})
}

function main() {
	if (!fs.existsSync(galleryDir)) {
		console.error('Gallery directory does not exist:', galleryDir)
		process.exit(1)
	}
	const files = getImageFiles(galleryDir)
	const galleryJson = buildGalleryJson(files)
	fs.writeFileSync(outputJson, JSON.stringify(galleryJson, null, 2))
	console.log(`Wrote ${galleryJson.length} entries to gallery.json`)
}

main()
