/* GCompris - oware.js
 *
 * Copyright (C) 2016 YOUR NAME <xx@yy.org>
 *
 * Authors:
 *   <THE GTK VERSION AUTHOR> (GTK+ version)
 *   "YOUR NAME" <YOUR EMAIL> (Qt Quick port)
 *
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation; either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
.pragma library
.import QtQuick 2.0 as Quick

var currentLevel = 0
var numberOfLevel = 4
var items

var url = "qrc:/gcompris/src/activities/oware/resource/"

var twoPlayers = false

var numberOfCells = 6 //Number of cells for each player

var state //state of the game
var selectedCell //cell where the player clicked
var lastCell //last cell where we sowed a seed

var currentPlayer = 1

function start(items_) {
    items = items_
    currentLevel = 0
    initLevel()
}

function stop() {
}

//Set all variables to their default values
function initLevel() {
    items.bar.level = currentLevel + 1
    items.cells.clear()
    for (var i = 0; i < 2 *numberOfCells; i++)
        items.cells.append({ "n": 4})
    items.player1.score = 0
    items.player2.score = 0
    state = "waiting"
    switchPlayer()
}

//Simply switch players. If it's the computer's turn, play for him
function switchPlayer() {
    currentPlayer = (currentPlayer === 0) ? 1 : 0
    var active = (currentPlayer === 0) ? items.player1 : items.player2
    var inactive = (currentPlayer === 0) ? items.player2 : items.player1
    items.player1.brightness = 0
    items.player2.brightness = 0
    if (!twoPlayers && currentPlayer === 1)
        playComputer();
    else {
        active.animation.start()
        inactive.animation.stop()
    }
}

//Display an information message below the board
function displayMessage(msg) {
    items.info.text = msg
    items.info.animation.start()
}

//Attempt to play
function onClick(parent) {
    //Check that it's the right player's turn
    if (state !== 'waiting')
        return
    if ((parent.y > 0 && currentPlayer === 1) || (parent.y === 0 && currentPlayer === 0)) {
        displayMessage("You can only sow seeds from your own side of the board!")
        return
    }

    //Get the indice of the cell
    var i = Math.floor(parent.x / (parent.width * 28.5 / 18.5 ))
    if (parent.y > 0) {
        i += numberOfCells
    }
    if (items.repeater.itemAt(i).numberOfSeeds === 0)
        return
    playAt(i)
}

//Start distributing seeds
//No check about the validity of the move is done, it should be done before calling this function
function playAt(i) {
    selectedCell = i
    lastCell = i
    state = "distributing"
}

//Calculate the index of the next cell on the board, rotating clock wise
function nextCell(cell) {
    if (cell === numberOfCells - 1)
        return numberOfCells * 2 - 1
    else if (cell === numberOfCells)
        return 0
    else if (cell < numberOfCells)
        return cell + 1
    else
        return cell - 1
}

//Calculate the index of the previous cell on the board, rotating counter clock wise
function previousCell(cell) {
    if (cell === numberOfCells * 2 - 1)
        return numberOfCells - 1
    else if (cell === 0)
        return numberOfCells
    else if (cell >= numberOfCells)
        return cell + 1
    else
        return cell - 1
}

//Function called every 0.05 second to update the game
function update() {
    if (state === "distributing") {
        var cell = items.repeater.itemAt(selectedCell)
        lastCell = nextCell(lastCell)
        //we skip the cell where the seeds come from (oware rules)
        if (lastCell === selectedCell)
            lastCell = nextCell(lastCell)
        var item = items.repeater.itemAt(lastCell)
        item.numberOfSeeds++
        item.opacity = 1.0
        item.repeater.itemAt(item.numberOfSeeds-1).opacity = 0
        item.repeater.itemAt(item.numberOfSeeds-1).appear.start()
        cell.repeater.itemAt(cell.numberOfSeeds-1).disappear.start()
        //There is only one seed left
        if (cell.numberOfSeeds === 1) {
            removeSeeds(lastCell)
            state = "waiting"
            switchPlayer();
        }
    }
}

//Attempt to remove seeds starting from cell i folowing oware's rules
function removeSeeds(i) {
    //If the last cell is on the current player's side, we do nothing
    if (i < numberOfCells) {
        if (currentPlayer === 1)
            return
    } else if (currentPlayer === 0)
        return
    var score = 0
    //Go through each cell backwards and add score as long as there are 2 or 3 seeds
    for (;;) {
        var cell = items.repeater.itemAt(i)
        if (cell.numberOfSeeds === 2) {
            score += 2
            cell.fade.start()
        } else if (cell.numberOfSeeds === 3) {
            score += 3
            cell.fade.start()
        } else
            break
        if (i === 0 || i === numberOfCells * 2 - 1)
            break;
        i = previousCell(i)
    }
    if (currentPlayer === 0)
        items.player1.score += score
    else
        items.player2.score += score
}

//IA for single player mode
function playComputer() {
    var max = -1;
    var max_i = -1;
    //Find the best direct move
    //TODO: add some randomness and eventually make the AI smarter (is it even needed?)
    for (var i=0; i < numberOfCells; i++) {
        var board = getBoardAsArray();
        if (board[i] === 0)
            continue;
        var score = simulatePlay(i, getBoardAsArray())
        if (score >= max) {
            max = score
            max_i = i;
        }
    }
    // no seeds on the board
    if (max_i === -1) {
        displayMessage("It's a draw!"); //TODO: draw animation
    } else
        playAt(max_i);
}

//Simulate a play at on the board by distributing and removing seeds at i
//Return the number of seeds that the move would score
function simulatePlay(i, board) {
    var score = 0
    var seedNumber = board[i] //contains the number of seeds left to distribute
    for (var j = i;;) {
        if (seedNumber-- === 0)
            break
        j = nextCell(j)
        if (j === i)
            continue
        board[j]++
        if (board[j] === 2 )
            score += 2
        else if (board[j] === 3)
            score += 3
        else
            score = 0
    }
    return score
}


function getBoardAsArray() {
    var v = []
    for (var i=0; i < numberOfCells * 2; i++)
        v.push(items.repeater.itemAt(i).numberOfSeeds)
    return v
}

function reset() {
    initLevel()
}

function nextLevel() {
    if(numberOfLevel <= ++currentLevel ) {
        currentLevel = 0
    }
    initLevel();
}

function previousLevel() {
    if(--currentLevel < 0) {
        currentLevel = numberOfLevel - 1
    }
    initLevel();
}
