import { useEffect, useRef } from 'react';

interface MinimalHeroProps {
    isDark?: boolean;
}

export function MinimalHero({ isDark = false }: MinimalHeroProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // @ts-ignore
    const animationRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d')!;
        let frame = 0;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        const drawGrid = () => {
            const gridSize = 60;
            const opacity = isDark ? 0.03 : 0.04;

            ctx.strokeStyle = isDark
                ? `rgba(16, 185, 129, ${opacity})`
                : `rgba(16, 185, 129, ${opacity})`;
            ctx.lineWidth = 1;

            // Vertical lines
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }

            // Horizontal lines
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        };

        const drawFloatingShapes = () => {
            const shapes = [
                { x: 0.2, y: 0.3, size: 200, speed: 0.0005 },
                { x: 0.7, y: 0.6, size: 150, speed: 0.0007 },
                { x: 0.5, y: 0.8, size: 180, speed: 0.0006 },
            ];

            shapes.forEach((shape, i) => {
                const centerX = canvas.width * shape.x + Math.sin(frame * shape.speed + i) * 30;
                const centerY = canvas.height * shape.y + Math.cos(frame * shape.speed + i) * 30;

                // Gradient circle
                const gradient = ctx.createRadialGradient(
                    centerX, centerY, 0,
                    centerX, centerY, shape.size
                );

                if (isDark) {
                    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
                    gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.02)');
                    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
                } else {
                    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
                    gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.04)');
                    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
                }

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(centerX, centerY, shape.size, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        const drawLines = () => {
            const lines = [
                { y1: 0.2, y2: 0.8, x: 0.15, speed: 0.0003 },
                { y1: 0.3, y2: 0.7, x: 0.85, speed: 0.0004 },
            ];

            lines.forEach((line, i) => {
                const x = canvas.width * line.x + Math.sin(frame * line.speed) * 20;
                const y1 = canvas.height * line.y1;
                const y2 = canvas.height * line.y2;

                const gradient = ctx.createLinearGradient(x, y1, x, y2);
                gradient.addColorStop(0, isDark ? 'rgba(16, 185, 129, 0)' : 'rgba(16, 185, 129, 0)');
                gradient.addColorStop(0.5, isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.4)');
                gradient.addColorStop(1, isDark ? 'rgba(16, 185, 129, 0)' : 'rgba(16, 185, 129, 0)');

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x, y1);
                ctx.lineTo(x, y2);
                ctx.stroke();
            });
        };

        const animate = () => {
            frame++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawGrid();
            drawFloatingShapes();
            drawLines();

            animationRef.current = requestAnimationFrame(animate);
        };

        resize();
        animate();
        window.addEventListener('resize', resize);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener('resize', resize);
        };
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
        />
    );
}
