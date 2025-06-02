<script setup>
import { ref, computed } from 'vue'

const images = ref([])
const loading = ref(true)

// Pagination settings
const pageSize = 20
const currentPage = ref(1)

const paginatedImages = computed(() => {
	const start = (currentPage.value - 1) * pageSize
	return images.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(images.value.length / pageSize))

function nextPage() {
	if (currentPage.value < totalPages.value) currentPage.value++
}
function prevPage() {
	if (currentPage.value > 1) currentPage.value--
}

// Fetch images on mount
onMounted(async () => {
	try {
		const res = await fetch('/gallery.json')
		images.value = await res.json()
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
			<div class="gallery-grid">
				<div
					v-for="image in paginatedImages"
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
			<div class="pagination">
				<button
					:disabled="currentPage === 1"
					@click="prevPage"
				>
					Previous
				</button>
				<span>Page {{ currentPage }} / {{ totalPages }}</span>
				<button
					:disabled="currentPage === totalPages"
					@click="nextPage"
				>
					Next
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.gallery-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
}
.gallery-item {
	flex: 1 1 200px;
	max-width: 250px;
	text-align: center;
}
.meta {
	font-size: 0.9em;
	color: #444;
}
.pagination {
	margin: 2rem 0;
	text-align: center;
}
</style>
