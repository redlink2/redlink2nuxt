<template>
	<div class="blackjack">
		<h1>Blackjack</h1>
		<div class="dealer">
			<div class="dealer-score">Dealer: {{ handScore(dealerCards) }}</div>
			<div class="dealer-cards">
				<span
					v-for="(card, index) in dealerCards"
					:key="index"
					class="card"
				>
					{{ displayCard(card, index === 0 && !gameOver) }}
				</span>
			</div>
		</div>
		<div class="player">
			<div class="player-cards">
				<span
					v-for="(card, index) in playerCards"
					:key="index"
					class="card"
				>
					{{ displayCard(card) }}
				</span>
			</div>
			<div class="player-score">Player: {{ handScore(playerCards) }}</div>
		</div>
		<div class="wallet">Gems: ${{ wallet }}</div>
		<div class="bet">Bet: ${{ bet }}</div>
		<div class="controls">
			<button
				v-if="gameOver"
				@click="resetGame"
			>
				Play Again
			</button>
			<button
				v-if="!gameOver"
				@click="decreaseBet"
			>
				Decrease
			</button>
			<button
				v-if="!gameOver"
				@click="increaseBet"
			>
				Increase
			</button>
			<button
				v-if="!gameOver"
				@click="hit"
			>
				Hit
			</button>
			<button
				v-if="!gameOver"
				@click="stay"
			>
				Stay
			</button>
			<button
				v-if="!gameOver"
				@click="showHelp"
			>
				Help
			</button>
		</div>
		<div
			v-if="gameOver"
			class="game-result"
		>
			{{ gameResult }}
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			bet: 50,
			minBet: 50,
			maxBet: 500,
			wallet: 500,
			playerCards: [],
			dealerCards: [],
			gameOver: false,
			gameResult: '',
			deck: [],
			bettingOpen: true,
		}
	},
	created() {
		this.resetGame()
	},
	methods: {
		displayCard(card, isHidden = false) {
			if (isHidden) return 'Hidden'
			const values = [
				'Ace',
				'2',
				'3',
				'4',
				'5',
				'6',
				'7',
				'8',
				'9',
				'10',
				'Jack',
				'Queen',
				'King',
			]
			const suits = {
				club: 'Clubs',
				diamond: 'Diamonds',
				heart: 'Hearts',
				spade: 'Spades',
			}
			return `${values[card.value]} of ${suits[card.suit]}`
		},
		createDeck() {
			const suits = ['club', 'diamond', 'heart', 'spade']
			const deck = []
			suits.forEach((suit) => {
				for (let i = 0; i <= 12; i++) {
					deck.push({ value: i, suit })
				}
			})
			return deck
		},
		shuffleDeck(deck) {
			for (let i = deck.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))
				;[deck[i], deck[j]] = [deck[j], deck[i]]
			}
		},
		dealInitialCards() {
			this.playerCards.push(this.deck.pop(), this.deck.pop())
			this.dealerCards.push(this.deck.pop(), this.deck.pop())
			if (this.isBlackjack(this.playerCards)) {
				this.endGame('Player has Blackjack! Player wins!')
			}
		},
		cardScore(card) {
			if (card.value > 10) return 10
			if (card.value === 0) return 11
			return card.value + 1
		},
		handScore(hand) {
			let score = hand.reduce(
				(sum, card) => sum + this.cardScore(card),
				0
			)
			let aces = hand.filter((card) => card.value === 0).length
			while (score > 21 && aces > 0) {
				score -= 10
				aces--
			}
			return score
		},
		hit() {
			this.playerCards.push(this.deck.pop())
			if (this.handScore(this.playerCards) > 21) {
				this.endGame('Player busts. Dealer wins!')
			}
		},
		stay() {
			while (this.handScore(this.dealerCards) < 17) {
				this.dealerCards.push(this.deck.pop())
			}
			this.determineWinner()
		},
		increaseBet() {
			if (this.bettingOpen && this.bet < this.maxBet) {
				this.bet += 50
			}
		},
		decreaseBet() {
			if (this.bettingOpen && this.bet > this.minBet) {
				this.bet -= 50
			}
		},
		isBlackjack(hand) {
			return (
				hand.length === 2 &&
				((hand[0].value === 0 && hand[1].value > 9) ||
					(hand[1].value === 0 && hand[0].value > 9))
			)
		},
		endGame(result) {
			this.gameOver = true
			this.gameResult = result
		},
		resetGame() {
			this.playerCards = []
			this.dealerCards = []
			this.deck = this.createDeck()
			this.shuffleDeck(this.deck)
			this.dealInitialCards()
			this.gameOver = false
			this.gameResult = ''
			this.bettingOpen = true
		},
		showHelp() {
			alert(
				'Blackjack: Try to get as close to 21 as possible without going over. Face cards are worth 10, Aces are 1 or 11.'
			)
		},
		determineWinner() {
			const playerScore = this.handScore(this.playerCards)
			const dealerScore = this.handScore(this.dealerCards)
			if (dealerScore > 21) {
				this.endGame('Dealer busts. Player wins!')
			} else if (playerScore > dealerScore) {
				this.endGame('Player wins!')
			} else if (playerScore < dealerScore) {
				this.endGame('Dealer wins!')
			} else {
				this.endGame("It's a draw!")
			}
		},
	},
}
</script>

<style scoped>
.blackjack {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100vh;
	padding: 0.5rem;
}

.dealer,
.player {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0.5rem;
}

.dealer-cards,
.player-cards {
	display: flex;
	justify-content: center;
	overflow-x: auto;
}

.card {
	background: #fff;
	border: 1px solid #ccc;
	border-radius: 6px;
	padding: 0.5rem 1rem;
	margin: 0.25rem;
	font-family: monospace;
	font-size: 1.1rem;
	min-width: 90px;
	text-align: center;
}

.controls {
	display: flex;
	justify-content: space-around;
	width: 100%;
}

button {
	margin: 0.25rem;
	padding: 0.75rem 1.5rem;
	font-size: 1.25rem;
	border: none;
	border-radius: 4px;
	background-color: #444;
	color: #fff;
	cursor: pointer;
}

button:hover {
	background-color: #555;
}
</style>
