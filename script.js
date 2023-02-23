let baseScore = 301
let round = 1
let subtract = 0

PopupEngine.init()

//----------- players -----------//
let players = []
let editingPlayer = 0 //id of player thats beeing edited rn

renderInput()
addPlayer()

function addPlayer(){
	players.push({
		name: "Player " + (players.length+1),
		score: [baseScore],
	})

	renderPlayers()
	editPlayer(players.length-1)
}

function deletePlayer(){
	if(editingPlayer == 0){
		PopupEngine.createPopup("Cannot delete Player 1")
		return
	}

	PopupEngine.createPopup(
		"Are you sure you want to delete " + players[editingPlayer].name, 
		() => {
			players.splice(editingPlayer, editingPlayer)
			renderPlayers()
			editPlayer(players.length-1)
		}
	)
}

function editPlayer(id = editingPlayer){
	editingPlayer = id
	
	calculateScorePreview()

	document.querySelectorAll('.player.selected').forEach(element => {
		element.classList.remove("selected")
	});

	document.querySelectorAll('.player')[id].classList.add("selected")

	document.getElementById("name").value = players[id].name

	document.getElementById(`score`).innerText = players[id].score.at(-1)

	//calulate average score
	document.getElementById(`average`).innerText = ((baseScore - players[id].score.at(-1))/round).toFixed(1)
}

function renderPlayers(){
	playerHtml = ""

	for (let i = 0; i < players.length; i++) {
		playerHtml += `
    <div onclick="editPlayer(${i})" class="player">
        <p>${players[i].name}</p>
        <p>${players[i].score.at(-1)}</p>
    </div>`
	}

	document.querySelector('#players').innerHTML = playerHtml
}

function changeName(){
	players[editingPlayer].name = document.querySelector('#name').value
	renderPlayers()
	editPlayer()
}

//----------- score change -----------//

function subtractValueBox(){return document.querySelector('#subtract p')}

function clickNumber(value, elem){
	elem.classList.add("selected")

	let counterValue = parseInt(elem.querySelector(".counter").innerText)
	counterValue = counterValue + 1 > 9 ? 0 : counterValue + 1
	
	if(parseInt(elem.querySelector(".counter").innerText) >= 9 ){
			elem.classList.remove("selected")

			subtract -= value*9
	}
	else{
		subtract += value

		document.getElementById("subtract-div").style.visibility = "visible"
		document.querySelector("#info").classList.add("previewVisible")
	}

	calculateScorePreview()
	
	subtractValueBox().innerText = subtract
	elem.querySelector(".counter").innerText = counterValue
}

function calculateScorePreview(){
	document.querySelector('#info .value-preview').innerText = players[editingPlayer].score.at(-1) - subtract
	
	if((players[editingPlayer].score.at(-1) - subtract) < 0){
		document.querySelector('#info .value-preview').style.color = "red"
	}
	else{
		document.querySelector('#info .value-preview').style.color = "black"
	}
}

function resetNumberTiles(){
	let numbers = document.getElementsByClassName(`numberPanel`)
	let counter = document.getElementsByClassName("counter")
	for (let i = 0; i < numbers.length; i++) {
			numbers[i].classList.remove("selected")
			counter[i].innerText = `0` 
	}

	document.getElementById("subtract-div").style.visibility = "hidden"
	document.querySelector("#info").classList.remove("previewVisible")
	subtractValueBox().innerText = 0

	subtract = 0
}

function changeScore(){
	if(players[editingPlayer].score.at(-1) - subtract < 0){
		PopupEngine.createPopup("Too much, score would be negative")
		return
	}

	if (editingPlayer == 0) {
			round++
	}

	players[editingPlayer].score.push(players[editingPlayer].score.at(-1)-subtract)

	
	resetNumberTiles()
	renderPlayers()
	
	if(players[editingPlayer].score.at(-1) == 0){
			document.getElementById(`playerScore-${editPlayer}`).innerText = "Gewonnen"
			document.getElementById(`player-${editPlayer}`).style.backgroundColor = "gold"
	}

	editPlayer((editingPlayer+1)%players.length)
}

function stepBack(){
	if(players[editingPlayer].score.length<=1){
		PopupEngine.createPopup("no score left")
		return
	}

	PopupEngine.createPopup("sure you want to revert to previous score?", () => {
		players[editingPlayer].score.pop()

		renderPlayers()
		editPlayer()
	})
}

//----------- rest -----------//

function renderInput(){
	let tileHtml = ""
	for (let i = 1; i <= 20; i++) {
	tileHtml += `<div class="numberPanel" onclick="clickNumber(${i},this)">
							<p>${i}</p>
							<p class="counter">0</p>
					</div>`
	}
	tileHtml += `<div class="numberPanel" onclick="clickNumber(25,this)">
					<p>25</p>
					<p class="counter">0</p>
					</div>
					<div id="subtract-div"><div id="subtract"><p>0</p></div></div>`
	document.getElementById("input").innerHTML = tileHtml

	subtract = 0
}

function setBaseScore(){
	baseScore = document.querySelector('#baseScoreInput').value
	round = 1;
	editPlayer()
}

function resetPlayerScores(){
	PopupEngine.createPopup(
		"Are you sure you want to set ever players score to " + baseScore,
		() => {
			for (let i = 0; i < players.length; i++) {
				players[i].score = [baseScore]
			}
		
			renderPlayers()
			renderInput()
		}
	)
}

document.querySelector('#baseScoreInput').addEventListener("keydown", (e) => {
	if(e.key == "Enter"){
		setBaseScore()
		document.querySelector('#baseScoreInput').blur()
	}
})

document.querySelector('#name').addEventListener("keydown", (e) => {
	if(e.key == "Enter"){
		changeName()
		document.querySelector('#name').blur()
		document.querySelector('#baseScoreInput').blur()
	}
})