let baseScore = 301
let round = 0

PopupEngine.init()

//----------- players -----------//
let players = []
let editingPlayer = 0 //id of player thats beeing edited rn

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

function editPlayer(id){
	editingPlayer = id

	document.querySelectorAll('.selected').forEach(element => {
		element.classList.remove("selected")
	});

	document.querySelectorAll('.player')[id].classList.add("selected")

	document.getElementById("name").value = players[id].name

	document.getElementById(`score`).innerText = players[id].score.at(-1)

	if(round > 0){
		document.getElementById(`average`).innerText = ((baseScore - players[id].score.at(-1))/round).toFixed(1)
	}
	else{
		document.getElementById(`average`).innerText = 0
	}
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
	editPlayer(editingPlayer)
}

//----------- score change -----------//

let subtract = 0

function clickNumber(value, elem){
	elem.classList.add("selected")

	if(parseInt(elem.querySelector(".counter").innerText)>= 9 ){
			elem.classList.remove("selected")

			subtract -= value*9
			document.getElementById("subtract").innerText = subtract

			elem.querySelector(".counter").innerText = `0`
	}
	else{
		elem.querySelector(".counter").innerText = parseInt(elem.querySelector(".counter").innerText) + 1
		
		subtract += value
		document.getElementById("subtract-div").style.visibility = "visible"
		document.getElementById("subtract").innerText = subtract
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
	document.getElementById("subtract").style.innerText = 0

	subtract = 0
}

function changeScore(){
	if(players[editingPlayer].score.at(-1) - subtract < 0){
		alert("too muc")
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
	console.log("back");
	if(players[editingPlayer].score.length>1){
		players[editingPlayer].score.pop()

		renderPlayers()
		editPlayer(editingPlayer)
	}
}

//----------- rest -----------//

renderInput()
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
					<div id="subtract-div"><p id="subtract">0</p></div>`
	document.getElementById("input").innerHTML = tileHtml

	subtract = 0
}

function setBaseScore(){
	baseScore = document.querySelector('#baseScoreInput').value
	round = 0;
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
	}
})