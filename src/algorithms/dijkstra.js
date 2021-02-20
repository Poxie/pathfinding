import { finished } from "stream";

export const dijkstra = (grid, startNode, endNode) => {
    const visitedNodes = [];
    const notVisitedNodes = getNodes(grid);

    while(!!notVisitedNodes.length) {
        sortNodes(notVisitedNodes);
        const closestNode = notVisitedNodes.shift();

        if(closestNode.distance === Infinity) return visitedNodes;
        if(closestNode.wall) continue;
        closestNode.visited = true;
        visitedNodes.push(closestNode);
        if(closestNode === endNode) return visitedNodes;
        updateNeighbors(closestNode, grid);
    }
}

const sortNodes = (nodes) => {
    nodes.sort((a, b) => a.distance - b.distance);
}

const getNodes = (grid) => {
    const nodes = [];
    grid.forEach(row => {
        row.forEach(node => {
            if(node.isStart) {
                node.distance = 0;
            }
            nodes.push(node);
        })
    })
    return nodes;
}

const updateNeighbors = (node, grid) => {
    const notVisitedNeighbors = getNodeNeigbors(node, grid);
    notVisitedNeighbors.forEach(neighbor => {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    })
}

const getNodeNeigbors = (node, grid) => {
    const neighbors = [];
    const { column, row } = node;

    if(row > 0) neighbors.push(grid[row - 1][column]);
    if(row < grid.length - 1) neighbors.push(grid[row + 1][column]);
    if(column > 0) neighbors.push(grid[row][column - 1]);
    if(column < grid[0].length - 1) neighbors.push(grid[row][column + 1]);

    return neighbors.filter(neighbor => !neighbor.visited);
}

export const getShortestPath = (endNode) => {
    const shortestPath = [];
    let currentNode = endNode;
    while(currentNode !== null && currentNode !== undefined) {
        shortestPath.push(currentNode);
        currentNode = currentNode.previousNode;
    }
    return shortestPath.reverse();
}