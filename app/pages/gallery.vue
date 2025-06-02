<script setup>
import { ref, onMounted } from 'vue'

const images = ref([])
const loading = ref(true)

// Fisher-Yates shuffle
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}

onMounted(async () => {
	try {
		const res = await fetch('/gallery.json')
		const data = await res.json()
		images.value = shuffle(data)
	} finally {
		loading.value = false
	}
})
</script>

<template>
	<div>
		<h1>Gallery</h1>
		<div v-if="loading">Loading...</div>
		<div v-else>
			<div class="gallery-scroll">
				<div class="masonry-gallery">
					<div
						v-for="image in images"
						:key="image.url"
						class="gallery-item"
					>
						<img
							:src="image.url"
							:alt="image.name"
							:width="image.width"
							:height="image.height"
							loading="lazy"
						/>
						<div class="meta">
							<strong>{{ image.name }}</strong>
							<span>{{ image.width }}×{{ image.height }}px</span>
							<span>{{ (image.size / 1024).toFixed(1) }} KB</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.gallery-scroll {
	height: 80vh;
	overflow-y: auto;
	overflow-x: hidden;
}
.masonry-gallery {
	column-count: 3;
	column-gap: 1rem;
	padding-bottom: 1rem;
}
.gallery-item {
	break-inside: avoid;
	background: #fff;
	box-shadow: 0 2px 8px #0001;
	border-radius: 6px;
	padding: 0.5rem;
	margin-bottom: 1rem;
	display: block;
}
.gallery-item img {
	width: 100%;
	max-width: 100%;
	height: auto;
	border-radius: 4px;
	display: block;
}
.meta {
	font-size: 0.9em;
	color: #444;
	margin-top: 0.5em;
}
</style>
