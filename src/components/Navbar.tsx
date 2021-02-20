import React, { useEffect, useState } from 'react';
import { useVisualizer } from '../contexts/VisualizerContext';

interface Props {
    onClick: () => void;
    disabled: boolean;
    clear: () => void;
    setObsticles: (value: string) => void;
    creatingObsticles: boolean;
}
export const Navbar: React.FC<Props> = ({onClick, disabled, clear, setObsticles, creatingObsticles}) => {
    const [openObsticles, setOpenObsticles] = useState(false);

    const toggleObsticles = () => {
        setOpenObsticles((previous) => !previous);
    }

    useEffect(() => {
        if(!openObsticles) return;

        document.querySelector('body')?.addEventListener('click', toggleObsticles);

        return () => document.querySelector('body')?.removeEventListener('click', toggleObsticles);
    }, [openObsticles]);

    let text;
    if(creatingObsticles) {
        text = 'Creating obsticles...';
    } else if(disabled) {
        text = 'Visualizing...';
    } else {
        text = 'Visualize Algorithm';
    }

    return(
        <div className="navbar flex column align-center">
            <div className="navbar-content flex align-center justify-center">
                <div className="obsticles">
                    <span className="side-button" onClick={toggleObsticles}>
                        Create Obsticles
                    </span>
                    {openObsticles ? (
                        <div className="obsticles-popup">
                            <div className={`obsticles-option`} onClick={() => setObsticles('random')} style={{pointerEvents: disabled || creatingObsticles ? 'none' : 'all'}}>
                                {disabled || creatingObsticles ? (
                                    text
                                ) : (
                                    'Random Obsticles'
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
                <button onClick={onClick} className={disabled || creatingObsticles ? 'disabled' : ''} disabled={disabled}>
                    {text}
                </button>
                <span className="side-button" onClick={clear}>
                    Clear Canvas
                </span>
            </div>
            <div className="navbar-bottom flex">
                <div className="flex align-center justify-center">
                    <div className="fake-node visited"></div>
                    <span>Visited node</span>
                </div>
                <div className="flex align-center justify-center">
                    <div className="fake-node node-path"></div>
                    <span>Shortest path</span>
                </div>
                <div className="flex align-center justify-center">
                    <div className="fake-node wall"></div>
                    <span>Wall</span>
                </div>
                <div className="flex align-center justify-center">
                    <div className="fake-node start-node"></div>
                    <span>Start node</span>
                </div>
                <div className="flex align-center justify-center">
                    <div className="fake-node finish-node"></div>
                    <span>Finish node</span>
                </div>
            </div>
        </div>
    )
}