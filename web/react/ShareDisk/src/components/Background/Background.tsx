import React, { useRef, useState } from 'react';

import './Background.css';
import { draw } from './ParticleEngine'

export function Background() {
    function run() {
        draw("canvas");
    }
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

    React.useEffect(() => {
        if (canvasRef.current) {
            const renderCtx = canvasRef.current.getContext('2d');

            if (renderCtx) {
                setContext(renderCtx);
            }
        }
        console.log(canvasRef);
        if (context) run();
    }, [context]);

    return (
        <canvas id="canvas" ref={canvasRef}>
        </canvas>
    )
}

export default Background