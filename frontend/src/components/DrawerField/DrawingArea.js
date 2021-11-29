import React, { useRef, useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const DrawingArea = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState({
        mouseDown: false,
        pixelsArray: []
    });

    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/drawer');

        ws.current.onmessage = e => {
            const decoded = JSON.parse(e.data);

            if (decoded.type === 'NEW_DRAW') {
                setMessages(prev => [
                    ...prev,
                    decoded.message,
                ]);
            }
        }
    }, []);

    console.log(messages[0])

    const canvas = useRef(null);
    const canvasMouseMoveHandler = event => {

        if (message.mouseDown) {
            event.persist();
            const clientX = event.clientX;
            const clientY = event.clientY;

            setMessage(prevState => {
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
        setMessage({ ...message, mouseDown: true });
    };

    const mouseUpHandler = event => {

        // Где-то здесь отправлять массив пикселей на сервер

        setMessage({ ...message, mouseDown: false, pixelsArray: [] });
        ws.current.send(JSON.stringify({
            type: 'CREATE_DRAW',
            message
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
                {/* {messages.map(message => (
                    { message }
                ))} */}
            </canvas>
        </>
    )
};

export default DrawingArea;
