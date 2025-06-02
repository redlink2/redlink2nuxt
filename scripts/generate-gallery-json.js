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

function getGroupName(filename) {
	const name = path.parse(filename).name
	const dashIdx = name.indexOf('-')
	if (dashIdx !== -1) {
		return name.substring(0, dashIdx)
	}
	return name
}

function buildGalleryJson(files) {
	const grouped = {}
	files.forEach((filename) => {
		const filepath = path.join(galleryDir, filename)
		let dimensions = { width: null, height: null }
		try {
			dimensions = imageSize(filepath)
		} catch (err) {
			console.warn(
				`Could not get dimensions for ${filename}:`,
				err.message
			)
		}
		const stats = fs.statSync(filepath)
		const groupName = getGroupName(filename)
		const entry = {
			url: `/gallery/${filename}`,
			width: dimensions.width,
			height: dimensions.height,
			type: path.extname(filename).slice(1),
			size: stats.size, // in bytes
		}
		if (!grouped[groupName]) {
			grouped[groupName] = {
				name: groupName,
				alternates: [entry],
			}
		} else {
			grouped[groupName].alternates.push(entry)
		}
	})
	return Object.values(grouped)
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
