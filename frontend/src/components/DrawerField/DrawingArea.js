import React, { useRef, useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const DrawingArea = () => {
    const [draws, setDraws] = useState([]);
    const [draw, setDraw] = useState({
        mouseDown: false,
        pixelsArray: []
    });

    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/drawer');

        ws.current.ondraw = e => {
            const decoded = JSON.parse(e.data);

            if (decoded.type === 'NEW_DRAW') {
                setDraws(prev => [
                    ...prev,
                    decoded.draw
                ]);
            }
        }
    }, []);

    const canvas = useRef(null);
    const canvasMouseMoveHandler = event => {

        if (draw.mouseDown) {
            event.persist();
            const clientX = event.clientX;
            const clientY = event.clientY;

            setDraw(prevState => {
                return {
                    ...prevState,
                    pixelsArray: [...prevState.pixelsArray, {
                        x: clientX,
                        y: clientY
                    }]
                };
            });

            const context = canvas.current.getContext('2d');
            const imageData = context.createImageData(10, 10);
            const d = imageData.data;

            d[0] = 0;
            d[1] = 0;
            d[2] = 0;
            d[3] = 255;
            context.putImageData(imageData, event.clientX, event.clientY);
        }
    };

    const mouseDownHandler = event => {
        setDraw({ ...draw, mouseDown: true });
    };

    const mouseUpHandler = event => {

        // Где-то здесь отправлять массив пикселей на сервер

        setDraw({ ...draw, mouseDown: false, pixelsArray: [] });
        ws.current.send(JSON.stringify({
            type: 'CREATE_DRAW',
            draw
        }));

    };

    return (
        <>
            <Typography>Draw a line on Canvas</Typography>
            <canvas ref={canvas}
                style={{ border: '1px solid black', borderRadius: '.3rem' }}
                width={1600}
                height={600}
                onMouseDown={mouseDownHandler}
                onMouseUp={mouseUpHandler}
                onMouseMove={canvasMouseMoveHandler}
            >
                {draws.map(draw => (
                    { draw }
                ))}
            </canvas>
        </>
    )
};

export default DrawingArea;
