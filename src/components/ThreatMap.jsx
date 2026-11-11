import React, { useEffect, useRef } from 'react';

export default function ThreatMap() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = (canvas.width = canvas.parentElement.clientWidth);
    const height = (canvas.height = 240);

    // Global Coordinates (Scaled for canvas)
    const nodes = [
      { x: width * 0.22, y: height * 0.35, label: 'North America (US-East)' },
      { x: width * 0.16, y: height * 0.42, label: 'US-West' },
      { x: width * 0.48, y: height * 0.32, label: 'Europe (Frankfurt)' },
      { x: width * 0.72, y: height * 0.48, label: 'Asia (Dhaka / SG)' },
      { x: width * 0.82, y: height * 0.36, label: 'East Asia (Tokyo)' },
      { x: width * 0.32, y: height * 0.72, label: 'South America (Sao Paulo)' },
      { x: width * 0.54, y: height * 0.62, label: 'Africa (Johannesburg)' },
      { x: width * 0.85, y: height * 0.78, label: 'Australia (Sydney)' },
    ];

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = 'rgba(8, 123, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Attack Arcs
      const attacks = [
        { from: 0, to: 3, color: '#FF4560', speed: 0.015 },
        { from: 1, to: 2, color: '#00E5FF', speed: 0.02 },
        { from: 4, to: 3, color: '#873BFF', speed: 0.012 },
        { from: 2, to: 0, color: '#00D68F', speed: 0.018 },
      ];

      attacks.forEach((atk, idx) => {
        const start = nodes[atk.from];
        const end = nodes[atk.to];
        const cx = (start.x + end.x) / 2;
        const cy = Math.min(start.y, end.y) - 40;

        // Curve
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(cx, cy, end.x, end.y);
        ctx.strokeStyle = 'rgba(8, 123, 255, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Traveling pulse
        const progress = (t * atk.speed + idx * 0.25) % 1;
        const px = (1 - progress) * (1 - progress) * start.x + 2 * (1 - progress) * progress * cx + progress * progress * end.x;
        const py = (1 - progress) * (1 - progress) * start.y + 2 * (1 - progress) * progress * cy + progress * progress * end.y;

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = atk.color;
        ctx.shadowColor = atk.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Nodes
      nodes.forEach((node) => {
        // Outer pulse
        const pulse = Math.sin(t * 0.05) * 4 + 6;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00E5FF';
        ctx.shadowColor = '#00E5FF';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      t++;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-[240px] rounded-xl overflow-hidden bg-[#071022] border border-nexblue/30">
      <div className="absolute top-3 left-4 z-10 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-nexcyan animate-ping"></span>
        <span className="text-xs font-mono font-semibold tracking-wider text-nexcyan uppercase">
          Live Global Threat Telemetry & Attack Map
        </span>
      </div>
      <div className="absolute bottom-3 right-4 z-10 text-[11px] font-mono text-nexmuted bg-nexbg/80 px-2.5 py-1 rounded border border-nexblue/20">
        Active Sensors: <span className="text-nexgreen font-bold">148 Nodes</span> | Blocked: <span className="text-nexdanger font-bold">99.98%</span>
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
