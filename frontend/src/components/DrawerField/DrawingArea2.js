import { React } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useEffect, useState, useRef } from 'react';
import { Typography } from '@mui/material';

const DrawingArea2 = ({ onClearLines, clearLines }) => {

    const [lines, setLines] = useState([]);
    const [draw, setDraw] = useState({
        mouseDown: false,
        pixelsArray: []
    });
    const isDrawing = useRef(false);

    useEffect(() => {
        isDrawing.current = new WebSocket('ws://localhost:8000/drawer');

        isDrawing.current.ondraw = e => {
            const decoded = JSON.parse(e.data);

            if (decoded.type === 'NEW_DRAW') {
                setLines(prev => [
                    ...prev,
                    decoded.draw
                ]);
            }
        }
    }, [clearLines])

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { points: [pos.x, pos.y] }]);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        let lastLine = lines[lines.length - 1];

        if (lastLine) {
            lastLine.points = lastLine.points.concat([point.x, point.y]);

            lines.splice(lines.length - 1, 1, lastLine);
            setLines(lines.concat());
        }

    };

    const handleMouseUp = () => {
        isDrawing.current = false;

        setDraw({ ...draw, mouseDown: false, pixelsArray: [] });

        isDrawing.current.send(JSON.stringify({
            type: 'CREATE_DRAW',
            draw
        }));
    };

    return (
        <>
            <Typography>Draw a line on Canvas</Typography>
            <Stage
                style={{ border: '1px solid black', borderRadius: '.3rem' }}
                width={1600}
                height={600}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
            >
                <Layer>
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke="#df4b26"
                            strokeWidth={2}
                            tension={0.5}
                            lineCap="round"
                            globalCompositeOperation={
                                line.tool === 'eraser' ? 'destination-out' : 'source-over'
                            }
                        />
                    ))}
                </Layer>
            </Stage>
        </>
    )
};

export default DrawingArea2;