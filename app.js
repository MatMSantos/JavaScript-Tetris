document.addEventListener('DOMContentLoaded', () => {

    // The whole area where the game takes place
    const grid = document.querySelector('.grid')

    // We create an array from the grid squares. We're essentially indexing the game area linearly.
    // As the rectangle is 10 squares in width, the first element of each line is indexed as '0', '10', '20', and so on.
    let squares = Array.from(document.querySelectorAll('.grid div'))

    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    let timerId
    let score = 0

    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    // Each line is 10 squares in length, it's useful to store this number for later.
    const width = 10

    let nextRandom = 0

    // L-shaped tetromino
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    // Z-shaped tetromino
    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]

    // T-shaped tetromino
    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    // O-shaped tetromino
    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    // I-shaped tetromino
    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    // We can index each tetromino in an array which will make things easier for us.
    const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    // Current position and rotation of the piece.
    let currentPosition = 4
    let currentRotation = 0

    // We randomly select an index from the array of Tetrominos.
    let random = Math.floor(Math.random()*theTetrominos.length)
    // And from this index then select the respective Tetromino.
    let current = theTetrominos[random][currentRotation]

    // Take the indexes where the tetromino should go and paint them with the right color to indicate the piece.
    // This is done by assigning the class 'tetromino' to the divs where the piece should go. This class is characterized by a specific background color.
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    // Undrawing is as simple as removing the class 'tetromino' from the respective divs.
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    // Function that determines what to do for each key press. 
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    // Update the position of the piece so that it moves down
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {

            current.forEach(index => squares[currentPosition + index].classList.add('taken'))

            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominos.length)
            current = theTetrominos[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    function moveLeft() {
        undraw()

        // These two lines take care of moving the piece IF it is inside the grid area
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if (!isAtLeftEdge) currentPosition -= 1

        // If the piece somehow collides with another piece, cancel the movement
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw()
    }

    function moveRight() {
        undraw()

        // These two lines take care of moving the piece IF it is inside the grid area
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1)
        if (!isAtRightEdge) currentPosition += 1

        // If the piece somehow collides with another piece, cancel the movement
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }

        draw()
    }

    function rotate() {
        undraw()

        // Increase current rotation by 1
        currentRotation ++
        // Loop through the rotations if we reach the last one
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        // Choose the correct rotation from the list of Tetrominoes
        current = theTetrominos[random][currentRotation]
        draw()
    }

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0

    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0, displayWidth, displayWidth+1, displayWidth*2+1],
        [1, displayWidth, displayWidth+1, displayWidth*2],
        [0, 1, displayWidth, displayWidth+1],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
    ]

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors [nextRandom]
        })
    }

    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            // Function to make the pieces descend constantly
            // 'setInterval' will call the function 'moveDown' every 1000ms (1s)
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominos.length)
            displayShape()
        }
    })

    function addScore(){
        for (let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                score.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    function gameOver() {
        if (current.some(index => squares[currentPosition+ index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }

})