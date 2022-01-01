document.addEventListener('DOMContentLoaded', () => {

    // The whole area where the game takes place
    const grid = document.querySelector('.grid')

    // We create an array from the grid squares. We're essentially indexing the game area linearly.
    // As the rectangle is 10 squares in width, the first element of each line is indexed as '0', '10', '20', and so on.
    let squares = Array.from(document.querySelectorAll('.grid div'))

    const ScoreDisplay = document.querySelector('#score')
    const StartBtn = document.querySelector('#start-button')

    // Each line is 10 squares in length, it's useful to store this number for later.
    const width = 10

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
        })
    }

    // Undrawing is as simple as removing the class 'tetromino' from the respective divs.
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }

    // Function to make the pieces descend constantly
    // 'setInterval' will call the function 'moveDown' every 1000ms (1s)
    timerId = setInterval(moveDown, 1000)

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

            random = Math.floor(Math.random() * theTetrominos.length)
            current = theTetrominos[random][currentRotation]
            currentPosition = 4
            draw()
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
        currentRotation ++
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominos[random][currentRotation]
        draw()
    }

})