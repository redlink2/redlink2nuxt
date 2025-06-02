<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const images = ref([]) // [{ name, alternates, display }]
const loading = ref(true)
const showModal = ref(false)
const selectedGroup = ref(null) // The group object
const selectedIndex = ref(0) // Index of the alternate in the group

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

function openModal(group) {
	selectedGroup.value = group
	selectedIndex.value = 0
	showModal.value = true
}

function closeModal() {
	showModal.value = false
	selectedGroup.value = null
	selectedIndex.value = 0
}

function selectAlternate(idx) {
	selectedIndex.value = idx
}

function prevAlternate() {
	if (selectedGroup.value && selectedGroup.value.alternates.length > 1) {
		selectedIndex.value =
			(selectedIndex.value - 1 + selectedGroup.value.alternates.length) %
			selectedGroup.value.alternates.length
	}
}

function nextAlternate() {
	if (selectedGroup.value && selectedGroup.value.alternates.length > 1) {
		selectedIndex.value =
			(selectedIndex.value + 1) % selectedGroup.value.alternates.length
	}
}

// Keyboard navigation for modal
function handleKeydown(e) {
	if (!showModal.value) return
	if (e.key === 'ArrowLeft') {
		prevAlternate()
		e.preventDefault()
	} else if (e.key === 'ArrowRight') {
		nextAlternate()
		e.preventDefault()
	} else if (e.key === 'Escape') {
		closeModal()
		e.preventDefault()
	}
}

onMounted(async () => {
	window.addEventListener('keydown', handleKeydown)
	try {
		const res = await fetch('/gallery.json')
		const data = await res.json()
		// For each group, pick a random alternate for display
		const withDisplay = data.map((group) => {
			const idx = Math.floor(Math.random() * group.alternates.length)
			return {
				...group,
				display: group.alternates[idx],
			}
		})
		images.value = shuffle(withDisplay)
	} finally {
		loading.value = false
	}
})

onBeforeUnmount(() => {
	window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
	<div
		:style="{ background: pastelBg, minHeight: '100vh' }"
		class="gallery-root"
	>
		<h1>Gallery</h1>
		<div v-if="loading">Loading...</div>
		<div
			v-else
			class="gallery-flex"
		>
			<div class="gallery-scroll">
				<div class="masonry-gallery">
					<div
						v-for="group in images"
						:key="group.name"
						class="gallery-item"
					>
						<img
							:src="group.display.url"
							:alt="group.name"
							:width="group.display.width"
							:height="group.display.height"
							loading="lazy"
							@click="openModal(group)"
							style="cursor: pointer"
						/>
						<div class="name">{{ group.name }}</div>
					</div>
				</div>
			</div>
			<!-- Modal -->
			<div
				v-if="showModal && selectedGroup"
				class="modal-backdrop"
				@click.self="closeModal"
			>
				<div class="modal-content">
					<!-- Carousel controls if more than one alternate -->
					<button
						v-if="selectedGroup.alternates.length > 1"
						class="modal-nav left"
						@click.stop="prevAlternate"
						aria-label="Previous"
					>
						&#8592;
					</button>
					<img
						:src="selectedGroup.alternates[selectedIndex].url"
						:alt="selectedGroup.name"
						class="modal-img"
					/>
					<button
						v-if="selectedGroup.alternates.length > 1"
						class="modal-nav right"
						@click.stop="nextAlternate"
						aria-label="Next"
					>
						&#8594;
					</button>
					<div class="modal-meta">
						<strong>{{ selectedGroup.name }}</strong
						><br />
						<span>
							{{ selectedGroup.alternates[selectedIndex].width }}×
							{{
								selectedGroup.alternates[selectedIndex].height
							}}px </span
						><br />
						<span>
							{{
								(
									selectedGroup.alternates[selectedIndex]
										.size / 1024
								).toFixed(1)
							}}
							KB
						</span>
					</div>
					<!-- Thumbnails for alternates -->
					<div
						v-if="selectedGroup.alternates.length > 1"
						class="modal-thumbs"
					>
						<img
							v-for="(alt, idx) in selectedGroup.alternates"
							:key="alt.url"
							:src="alt.url"
							:alt="`${selectedGroup.name} alternate ${idx + 1}`"
							class="thumb"
							:class="{ active: idx === selectedIndex }"
							@click.stop="selectAlternate(idx)"
						/>
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
.gallery-root {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}
.gallery-flex {
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	min-height: 0;
}
.gallery-scroll {
	flex: 1 1 auto;
	overflow-y: auto;
	overflow-x: hidden;
	min-height: 0;
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
	right: -2.5em;
	background: none;
	border: none;
	color: #fff;
	font-size: 2em;
	cursor: pointer;
	line-height: 1;
	z-index: 2;
}
.modal-thumbs {
	display: flex;
	gap: 0.5em;
	margin-top: 1em;
	justify-content: center;
	flex-wrap: wrap;
}
.thumb {
	width: 48px;
	height: 48px;
	object-fit: cover;
	border-radius: 4px;
	border: 2px solid transparent;
	cursor: pointer;
	transition: border 0.2s;
}
.thumb.active {
	border: 2px solid #fff;
}
.modal-nav {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	background: rgba(0, 0, 0, 0.5);
	border: none;
	color: #fff;
	font-size: 2em;
	cursor: pointer;
	padding: 0.2em 0.5em;
	z-index: 2;
}
.modal-nav.left {
	left: -2em;
}
.modal-nav.right {
	right: -2em;
}
</style>
