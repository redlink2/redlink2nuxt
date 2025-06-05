<template>
	<div class="game-container">
		<h1>Tic-Tac-Toe</h1>
		<div class="tic-tac-toe">
			<div
				v-for="(cell, idx) in board"
				:key="idx"
				class="cell"
				:class="cell"
				@click="makeMove(idx)"
			>
				<span v-if="cell === 'X'">X</span>
				<span v-else-if="cell === 'O'">O</span>
			</div>
		</div>
		<div class="status">
			<span v-if="winner">
				<span v-if="winner === 'Draw'">It's a draw!</span>
				<span v-else>{{ winner }} wins!</span>
			</span>
			<span v-else> {{ currentPlayer }}'s turn </span>
		</div>
		<button
			class="reset-btn"
			@click="resetGame"
		>
			Restart
		</button>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'

const board = ref(Array(9).fill(''))
const currentPlayer = ref('X')
const winner = ref(null)

function makeMove(idx) {
	if (board.value[idx] || winner.value) return
	board.value[idx] = currentPlayer.value
	if (checkWinner()) {
		winner.value = currentPlayer.value
	} else if (board.value.every((cell) => cell)) {
		winner.value = 'Draw'
	} else {
		currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
	}
}

function checkWinner() {
	const wins = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]
	return wins.some(
		([a, b, c]) =>
			board.value[a] &&
			board.value[a] === board.value[b] &&
			board.value[a] === board.value[c]
	)
}

function resetGame() {
	board.value = Array(9).fill('')
	currentPlayer.value = 'X'
	winner.value = null
}
</script>

<style scoped>
.game-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	background: purple;
	font-family: 'Panic Sans', sans-serif;
}

h1 {
	margin-bottom: 5vh;
	font-size: 5vh;
	color: darkturquoise;
}

.tic-tac-toe {
	display: grid;
	grid-template-columns: repeat(3, 10vw);
	grid-template-rows: repeat(3, 10vw);
	gap: 0.5vw;
	border: 0.8vh solid turquoise;
	border-radius: 2vh;
	background: #222;
	margin-bottom: 2vh;
}

.cell {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 5vh;
	background-color: gray;
	border: 0.3vh ridge green;
	cursor: pointer;
	transition: background 0.2s;
	color: #fff;
	user-select: none;
}

.cell:hover {
	background-color: cyan;
	color: #222;
}

.status {
	margin: 2vh 0;
	font-size: 2.5vh;
	color: #fff;
}

.reset-btn {
	margin-top: 1vh;
	padding: 0.75rem 1.5rem;
	font-size: 1.25rem;
	border: none;
	border-radius: 4px;
	background-color: #444;
	color: #fff;
	cursor: pointer;
}

.reset-btn:hover {
	background-color: #555;
}

@media (max-width: 600px) {
	.tic-tac-toe {
		grid-template-columns: repeat(3, 22vw);
		grid-template-rows: repeat(3, 22vw);
	}
	.cell {
		font-size: 7vw;
	}
}
</style>
