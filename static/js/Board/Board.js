import { BoardMoveInput } from './BoardMoveInput.js'
import { BoardState } from './BoardState.js'
import { DrawHandler } from '../Draw/Draw.js'
import { Button } from '../Tools/Button.js'

class Cell {
    constructor(x, y, element) {
        this.value
        this.x = x
        this.y = y
        this.element = element
        this.prev_value
    }
    update(value) {
        if (!(value == 'wall-node' && this.isEndPoint())) {
            this.prev_value = this.value
            this.value = value
            this.element.classList.add(value)
        }
    }
    remove(value) {
        if (value) {
            this.value = this.prev_value
            this.prev_value = null
            this.element.classList.remove(value)
        }
    }
    isEndPoint() {
        return this.value == 'start-node' || this.value == 'end-node'
    }
    isWall() {
        return this.value == 'wall-node'
    }

}

export class Board {
    constructor(height, width) {
        this.width = width
        this.height = height
        this.state = new BoardState()
        this.cells = []
        this.element = document.getElementById('grid');
        for (var i = 0; i < height; i++) {
            var row = document.createElement('div');
            row.className = "row-container row";
            row.id = "row" + i;
            this.cells.push([])
            for (var j = 0; j < width; j++) {
                var box = document.createElement('div');
                box.className = 'box box-node-container';
                box.id = i + ',' + j;
                row.appendChild(box);
                const cell = new Cell(i, j, box)
                this.cells[i].push(cell)
            }
            this.element.appendChild(row);
        }
        this.initializeBoard()
        this.initalizeTools()
        this.drawHandle = new DrawHandler(this)
        this.mouseInput = new BoardMoveInput(this)

    }

    initializeBoard() {
        // let walls = document.querySelector('.wall-node')
        // walls.walls.forEach(element => {
        //     element.classList.remove('wall-node')
        // });
        let y = Math.floor(this.height / 2),
            x = Math.floor(this.width * .3)
        this.start = this.cells[y][x]
        this.start.update('start-node')

        this.end = this.cells[y][this.width - x - 1]
        this.end.update('end-node')
    }

    initalizeTools() {
        this.addbtn = document.getElementById('add-wall')
        this.removebtn = document.getElementById('remove-wall')
        this.addWallListener = this.draw.bind(this)
        this.removeWallListener = this.erase.bind(this)
        this.addbtn.addEventListener('click', this.addWallListener)
        this.removebtn.addEventListener('click', this.removeWallListener)

        this.clearWallsbtn = document.getElementById('clearWalls')
        this.clearVisitbtn = document.getElementById('clearVisit')
        this.resetBoardBtn = document.getElementById('resetBoard')

        this.clearWallsListener = this.clearWalls.bind(this)
        this.clearVisitListener = this.clearVisited.bind(this)
        this.resetBoardListener = this.resetBoard.bind(this)

        this.clearWallsbtn = new Button('clearTool', this.clearWallsbtn, this.clearWallsListener)
        this.clearVisitbtn = new Button('clearTool', this.clearVisitbtn, this.clearVisitListener)
        this.resetBoardBtn = new Button('clearTool', this.resetBoardBtn, this.resetBoardListener)
    }

    getCell(id) {
        let loc = id.split(',')
        return this.cells[loc[0]][loc[1]]
    }

    move(fromNode, toNode) {
        if (toNode) {
            toNode.update(fromNode.value)
            fromNode.remove(toNode.value)
            switch (toNode.value) {
                case 'start-node':
                    this.start = toNode
                    break
                case 'end-node':
            }       this.end = toNode
        }


    }

    draw() {
        if (this.state.drawType != "freeDraw") {
            this.addbtn.classList.add('active-tool')
            this.removebtn.classList.remove('active-tool')
            this.state.drawType = "freeDraw"
        }
    }

    erase() {
        if (this.state.drawType != "erase") {
            this.addbtn.classList.remove('active-tool')
            this.removebtn.classList.add('active-tool')
            this.state.drawType = "erase"
        }
    }

    clearWalls() {
        const walls = this.element.querySelectorAll('.wall-node')
        walls.forEach(node => {
            node.classList.remove('wall-node')
        });
    }

    clearVisited() {
        const visited = this.element.querySelectorAll('.visited-node')
        const paths = this.element.querySelectorAll('.path-node')

        visited.forEach(node => {
            node.classList.remove('visited-node')

        });
        paths.forEach(node => {
            node.classList.remove('path-node')
        });


    }

    clearAll() {
        const all = this.element.querySelectorAll('.box')
        all.forEach(node => {
            node.classList = 'box box-node-container'
        });

    }

    resetBoard() {
        this.clearAll()
        this.initializeBoard()
    }

    animate() {
        const tools = document.querySelectorAll('.tools')
        tools.forEach(tool => {
            tool.classList.add('disabled')
        });
    }

    animateStop() {
        const tools = document.querySelectorAll('.tools')
        tools.forEach(tool => {
            tool.classList.remove('disabled')
        });
    }
}