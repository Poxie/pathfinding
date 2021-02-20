import React, { Component, createRef, useEffect, useRef, useState } from 'react';
import { start } from 'repl';
import { dijkstra, getShortestPath } from '../algorithms/dijkstra';
import { useVisualizer } from '../contexts/VisualizerContext';
import { Navbar } from './Navbar';
import { Node } from './Node';

const ROW_LENGTH = 32;
const COLUMN_LENGTH = 76;

interface Node {
    visited: boolean;
    isFinish: boolean;
    isStart: boolean;
    column: number;
    row: number;
    distance: number;
    wall: boolean;
}

export class PathCanvas extends Component {
    state = {
        grid: [],
        mouseIsPressed: false,
        draggingStart: false,
        draggingFinish: false,
        startNodeRow: 16,
        startNodeColumn: 20,
        finishNodeRow: 16,
        finishNodeColumn: 55,
        isVisualized: false,
        active: false,
        creatingObsticles: false
    }

    componentDidMount = () => {
        const newGrid = this.getGrid();
        this.setState({
            grid: newGrid
        })
        const grid: any = this.copyGrid(newGrid);
    }

    animateNodes = (nodes: any, endNode: Node) => {
        if(!nodes) return;
        // Animating nodes
        nodes.forEach((node: Node, index: number) => {
            setTimeout(() => {
                document.querySelector(`[column='${node.column}'][row='${node.row}']`)?.classList.add('animate-visited');
            }, index * 5);
        })

        // Animating node path
        const path = getShortestPath(endNode);
        setTimeout(() => {
            path.forEach((node, index) => {
                setTimeout(() => {
                    document.querySelector(`[column='${node.column}'][row='${node.row}']`)?.classList.add('animate-node-path');
                }, index * 30);
            })
            setTimeout(() => {
                this.setState({
                    active: false,
                    isVisualized: true
                })
            }, path.length * 30);
        }, nodes.length * 5);
    }
    
    handleMouseDown = (rowIndex: number, column: number, isStart: boolean, isFinish: boolean) => {
        if(this.state.active) return;
        if(!isStart && !isFinish) {
            const newGrid = this.updateGridWithNewWalls(rowIndex, column);
            this.setState({
                grid: newGrid,
                mouseIsPressed: true
            })
        } else if(isStart) {
            this.setState({
                draggingStart: true
            })
        } else {
            this.setState({
                draggingFinish: true
            })
        }
    }
    instantVisualize = (grid: any, firstNodeRow: number, firstNodeColumn: number, isStart: boolean) => {
        // Removing all other nodes' styles
        this.removeCurrentStyles();

        this.setState({
            grid: grid,
        })
        const nodes = dijkstra(grid, isStart ? grid[firstNodeRow][firstNodeColumn] : grid[this.state.startNodeRow][this.state.startNodeColumn], !isStart ? grid[firstNodeRow][firstNodeColumn] : grid[this.state.finishNodeRow][this.state.finishNodeColumn]);
        if(!nodes) return;
        nodes.forEach((node: Node, index: number) => {
            document.querySelector(`[column='${node.column}'][row='${node.row}']`)?.classList.add('visited');
        })
        const path = getShortestPath(!isStart ? grid[firstNodeRow][firstNodeColumn] : grid[this.state.finishNodeRow][this.state.finishNodeColumn]);
        path.forEach((node, index) => {
            document.querySelector(`[column='${node.column}'][row='${node.row}']`)?.classList.add('node-path');
        })
    }

    getNewGridWithWalls = (rowIndex: number, column: number, walls: Node[], isStart: boolean) => {
        const grid: any = [];
        for(let i = 0; i < ROW_LENGTH; i++) {
            const row: any = [];
            for(let y = 0; y < COLUMN_LENGTH; y++) {
                const node = this.createNode(i, y);
                if(walls.filter(n => n.row === i && n.column === y).length > 0) {
                    node.wall = true;
                }
                if(isStart) {
                    node.isStart = false;
                    if(i === rowIndex && y === column) {
                        node.isStart = true;
                    }
                } else {
                    node.isFinish = false;
                    if(i === rowIndex && y === column) {
                        node.isFinish = true;
                    }
                }
                row.push(
                    node
                )
            }
            grid.push(row);
        }
        return grid;
    }
    
    handleMouseEnter = (rowIndex: number, column: number) => {
        if(this.state.active) return;
        if(this.state.mouseIsPressed) {
            const newGrid = this.updateGridWithNewWalls(rowIndex, column);
            this.setState({
                grid: newGrid
            })
        } else if(this.state.draggingStart) {
            const walls: any = [];
            this.state.grid.forEach((row: any) => {
                row.forEach((node: any) => {
                    if(node.wall) {
                        walls.push(node);
                    }
                })
            })
            const newGrid = this.getNewGridWithWalls(rowIndex, column, walls, true);
            if(this.state.isVisualized) {
                this.instantVisualize(newGrid, rowIndex, column, true);
                this.setState({
                    startNodeRow: rowIndex,
                    startNodeColumn: column
                })
            } else {
                this.setState({
                    startNodeRow: rowIndex,
                    startNodeColumn: column,
                    grid: newGrid
                })
            }
        } else if(this.state.draggingFinish) {
            const walls: any = [];
            this.state.grid.forEach((row: any) => {
                row.forEach((node: any) => {
                    if(node.wall) {
                        walls.push(node);
                    }
                })
            })
            const newGrid = this.getNewGridWithWalls(rowIndex, column, walls, false);
            if(this.state.isVisualized) {
                this.instantVisualize(newGrid, rowIndex, column, false);
                this.setState({
                    finishNodeRow: rowIndex,
                    finishNodeColumn: column
                })
            } else {
                this.setState({
                    finishNodeRow: rowIndex,
                    finishNodeColumn: column,
                    grid: newGrid
                })
            }
        }
    }

    updateGridWithNewWalls = (rowIndex: number, column: number) => {
        const grid: any = [];
        const newGrid = this.copyGrid(this.state.grid);
        newGrid.forEach((row: any) => {
            const r: any = row.map((node: Node) => {
                if(node.column == column && node.row == rowIndex) {
                    node.wall = !node.wall;
                }
                return node;
            })
            grid.push(r);
        })
        return newGrid;
    }

    handleMouseUp = () => {
        this.setState({
            mouseIsPressed: false,
            draggingStart: false,
            draggingFinish: false
        })
    }

    getGrid = () => {
        const grid: any = [];
        for(let i = 0; i < ROW_LENGTH; i++) {
            const row: any = [];
            for(let y = 0; y < COLUMN_LENGTH; y++) {
                row.push(
                    this.createNode(i, y)
                )
            }
            grid.push(row);
        }
        return grid;
    }
    
    createNode = (row: number, column: number) => {
        const node = {
            column,
            row,
            wall: false,
            isFinish: row === this.state.finishNodeRow && column === this.state.finishNodeColumn,
            isStart: row === this.state.startNodeRow && column === this.state.startNodeColumn,
            distance: Infinity
        }
        return node;
    }
    
    copyGrid = (grid: any) => {
        const newGrid = grid.map((row: any) => {
            const newRow = row.map((node: any) => {
                const n = this.createNode(node.row, node.column);
                if(node.wall) n.wall = true;
                return n;
            })
            return newRow;
        })
        return newGrid;
    }

    removeCurrentStyles = () => {
        document.querySelectorAll('.node').forEach(node => {
            ['animate-node-path', 'animate-visited', 'visited', 'node-path'].forEach(name => {
                if(node.classList.contains(name)) {
                    node.classList.remove(name);
                }
            })
        })
    }

    visualize = () => {
        this.setState({
            active: true
        })
        this.removeCurrentStyles();
        const grid = this.copyGrid(this.state.grid);
        const nodes = dijkstra(grid, grid[this.state.startNodeRow][this.state.startNodeColumn], grid[this.state.finishNodeRow][this.state.finishNodeColumn]);
        this.animateNodes(nodes, grid[this.state.finishNodeRow][this.state.finishNodeColumn]);
    }

    clearCanvas = () => {
        this.removeCurrentStyles();
        const grid = this.getGrid();
        this.setState({
            grid: grid,
            isVisualized: false
        })
    }

    setObsticles = (value: string) => {
        this.setState({
            creatingObsticles: true
        })
        this.clearCanvas();
        if(value === 'random') {
            const walls: Node[] = [];
            for(let i = 0; i < 800; i++) {
                const randomRow = Math.floor(Math.random() * ROW_LENGTH);
                const randomColumn = Math.floor(Math.random() * COLUMN_LENGTH);
                const node: Node = this.state.grid[randomRow][randomColumn];
                if(!node.isStart && !node.isFinish) {
                    walls.push(node);
                    setTimeout(() => {
                        document.querySelector(`[column='${node.column}'][row='${node.row}']`)?.classList.add('wall');
                    }, 5 * i);
                }
            }
            setTimeout(() => {
                const grid = this.getNewGridWithWalls(this.state.startNodeRow, this.state.startNodeColumn, walls, true);
                this.setState({
                    grid,
                    creatingObsticles: false
                })
            }, 5 * 800);
        }
    }

    render() {
        const { grid } = this.state;
        return(
            <>
            <Navbar 
                onClick={this.visualize}
                disabled={this.state.active}
                clear={this.clearCanvas}
                setObsticles={(value) => this.setObsticles(value)}
                creatingObsticles={this.state.creatingObsticles}
            />
            <div className="path-canvas flex column align-center" onMouseUp={this.handleMouseUp} onMouseLeave={this.handleMouseUp}>
                {grid.map((row: any, rowIndex: number) => {
                    return(
                        <div className="row" key={rowIndex}>
                            {row.map((node: Node, key: number) => {
                                return(
                                    <Node 
                                        column={node.column}
                                        isFinish={node.isFinish}
                                        isStart={node.isStart}
                                        row={node.row}
                                        extraClassname={''}
                                        key={key + (rowIndex * 10)}
                                        wall={node.wall}
                                        onMouseDown={(column: number, row: number, isStart, isFinish) => this.handleMouseDown(column, row, isStart, isFinish)}
                                        onMouseEnter={(column, row) => this.handleMouseEnter(column, row)}
                                    />
                                )
                            })}
                        </div>
                    )
                })}
            </div>
            </>
        )
    }
}