<script setup>
import { ref, onMounted } from 'vue'

const images = ref([])
const loading = ref(true)
const showModal = ref(false)
const selectedImage = ref(null)

// Generate a random pastel color
const pastelBg = ref('')
function randomPastel() {
	const hue = Math.floor(Math.random() * 360)
	return `hsl(${hue}, 70%, 90%)`
}
pastelBg.value = randomPastel()

// Fisher-Yates shuffle
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}

function openModal(image) {
	selectedImage.value = image
	showModal.value = true
}

function closeModal() {
	showModal.value = false
	selectedImage.value = null
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
	<div :style="{ background: pastelBg, minHeight: '100vh' }">
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
							@click="openModal(image)"
							style="cursor: pointer"
						/>
						<div class="name">{{ image.name }}</div>
					</div>
				</div>
			</div>
			<!-- Modal -->
			<div
				v-if="showModal"
				class="modal-backdrop"
				@click.self="closeModal"
			>
				<div class="modal-content">
					<img
						v-if="selectedImage"
						:src="selectedImage.url"
						:alt="selectedImage.name"
						class="modal-img"
					/>
					<div
						class="modal-meta"
						v-if="selectedImage"
					>
						<strong>{{ selectedImage.name }}</strong
						><br />
						<span
							>{{ selectedImage.width }}×{{
								selectedImage.height
							}}px</span
						><br />
						<span
							>{{
								(selectedImage.size / 1024).toFixed(1)
							}}
							KB</span
						>
					</div>
					<button
						class="modal-close"
						@click="closeModal"
					>
						&times;
					</button>
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
	cursor: pointer;
}
.name {
	text-align: center;
	font-size: 1em;
	color: #333;
	margin-top: 0.5em;
	font-weight: bold;
}
.modal-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}
.modal-content {
	position: relative;
	max-width: 90vw;
	max-height: 90vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.modal-img {
	max-width: 90vw;
	max-height: 80vh;
	border-radius: 8px;
	box-shadow: 0 4px 32px #000a;
}
.modal-meta {
	color: #fff;
	text-align: center;
	margin-top: 1em;
	font-size: 1.1em;
}
.modal-close {
	position: absolute;
	top: 0.5em;
	right: -2.5em; /* Move further right, off the image */
	background: none;
	border: none;
	color: #fff;
	font-size: 2em;
	cursor: pointer;
	line-height: 1;
	z-index: 2;
}
</style>
