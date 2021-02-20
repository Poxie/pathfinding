import React from 'react';

interface Props {
    extraClassname: string;
    column: number;
    row: number;
    isFinish: boolean;
    isStart: boolean;
    wall: boolean;
    onMouseEnter: (row: number, column: number) => void;
    onMouseDown: (row: number, column: number, isStart: boolean, isFinish: boolean) => void;
}
export const Node: React.FC<Props> = ({wall, column, row, isFinish, isStart, extraClassname='', onMouseDown, onMouseEnter}) => {
    if(isFinish) {
        extraClassname += ' finish-node'
    } else if(isStart) {
        extraClassname += ' start-node'
    }
    if(wall) {
        extraClassname += ' wall';
    }
    return(
        <div 
            className={`node${extraClassname ? ' ' + extraClassname : ''}`} 
            // @ts-ignore
            column={column} 
            row={row}
            onMouseEnter={(e) => {
                e.stopPropagation();
                onMouseEnter(row, column)
            }}
            onMouseDown={() => onMouseDown(row, column, isStart, isFinish)}
        />
    )
}