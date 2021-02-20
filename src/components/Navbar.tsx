import React, { useEffect, useState } from 'react';

interface Props {
    onClick: () => void;
    disabled: boolean;
    clear: () => void;
    setObstacles: (value: string) => void;
    creatingObstacles: boolean;
}
export const Navbar: React.FC<Props> = ({onClick, disabled, clear, setObstacles, creatingObstacles}) => {
    const [openObstacles, setOpenObstacles] = useState(false);

    const toggleObstacles = () => {
        setOpenObstacles((previous) => !previous);
    }

    useEffect(() => {
        if(!openObstacles) return;

        document.querySelector('body')?.addEventListener('click', toggleObstacles);

        return () => document.querySelector('body')?.removeEventListener('click', toggleObstacles);
    }, [openObstacles]);

    let text;
    if(creatingObstacles) {
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
                    <span className="side-button" onClick={toggleObstacles}>
                        Create Obstacles
                    </span>
                    {openObstacles ? (
                        <div className="obsticles-popup">
                            <div className={`obsticles-option`} onClick={() => setObstacles('random')} style={{pointerEvents: disabled || creatingObstacles ? 'none' : 'all'}}>
                                {disabled || creatingObstacles ? (
                                    text
                                ) : (
                                    'Random Obstacles'
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
                <button onClick={onClick} className={disabled || creatingObstacles ? 'disabled' : ''} disabled={disabled}>
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