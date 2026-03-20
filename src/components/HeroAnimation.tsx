"use client";

import { useEffect, useRef } from "react";

const CALLERS = [
  { name: "VoteHub", color: "#f0ebe3", speed: 1.0 },
  { name: "DDHQ", color: "#8a8275", speed: 0.62 },
  { name: "AP", color: "#504a42", speed: 0.42 },
];

const LANES = [0.26, 0.39, 0.61, 0.74];

interface Dot {
  callerIdx: number;
  progress: number;
  speed: number;
  alpha: number;
}

interface Race {
  dots: Dot[];
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const races: Race[] = [];
    let time = 0;
    let lastSpawn = -10;

    const spawn = () => {
      races.push({
        dots: CALLERS.map((c, i) => ({
          callerIdx: i,
          progress: 0,
          speed: c.speed * (0.88 + Math.random() * 0.24),
          alpha: 1,
        })),
      });
    };

    // Pre-warm
    for (let i = 0; i < 3; i++) {
      spawn();
      for (let f = 0; f < 90 * (i + 1); f++) {
        time += 1 / 60;
        races.forEach((r) =>
          r.dots.forEach((d) => {
            d.progress += d.speed * 0.0022;
            if (d.progress > 0.82) d.alpha = Math.max(0, 1 - (d.progress - 0.82) / 0.18);
          })
        );
      }
      lastSpawn = time;
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      time += 1 / 60;

      if (time - lastSpawn > 3.5) {
        spawn();
        lastSpawn = time;
      }

      const marginL = w * 0.08;
      const marginR = w * 0.06;
      const trackW = w - marginL - marginR;

      // --- Track lines ---
      CALLERS.forEach((caller, i) => {
        const y = h * LANES[i];

        // Line
        ctx.beginPath();
        ctx.moveTo(marginL, y);
        ctx.lineTo(marginL + trackW, y);
        ctx.strokeStyle = "rgba(240,235,227,0.025)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label
        ctx.font = "500 10px monospace";
        ctx.textAlign = "right";
        ctx.fillStyle = caller.color;
        ctx.globalAlpha = 0.12;
        ctx.fillText(caller.name, marginL - 14, y + 3.5);
        ctx.globalAlpha = 1;
      });

      // --- Dots ---
      for (let ri = races.length - 1; ri >= 0; ri--) {
        const race = races[ri];
        let allDone = true;

        race.dots.forEach((dot) => {
          if (dot.progress >= 1) return;
          allDone = false;

          dot.progress += dot.speed * 0.0022;
          if (dot.progress > 0.82) {
            dot.alpha = Math.max(0, 1 - (dot.progress - 0.82) / 0.18);
          }
          if (dot.progress >= 1) return;

          const caller = CALLERS[dot.callerIdx];
          const y = h * LANES[dot.callerIdx];
          const eased = easeInOut(Math.min(dot.progress, 1));
          const x = marginL + eased * trackW;

          // Comet trail
          const trailLen = trackW * 0.12;
          const trailX = Math.max(marginL, x - trailLen);
          if (x > marginL + 4) {
            const grad = ctx.createLinearGradient(trailX, 0, x, 0);
            grad.addColorStop(0, "transparent");
            grad.addColorStop(1, caller.color);
            ctx.beginPath();
            ctx.moveTo(trailX, y);
            ctx.lineTo(x, y);
            ctx.strokeStyle = grad;
            ctx.globalAlpha = dot.alpha * 0.3;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }

          // Bloom
          const bloom = ctx.createRadialGradient(x, y, 0, x, y, 20);
          bloom.addColorStop(0, caller.color);
          bloom.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(x, y, 20, 0, Math.PI * 2);
          ctx.fillStyle = bloom;
          ctx.globalAlpha = dot.alpha * 0.08;
          ctx.fill();
          ctx.globalAlpha = 1;

          // Dot
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = caller.color;
          ctx.globalAlpha = dot.alpha * 0.8;
          ctx.fill();
          ctx.globalAlpha = 1;
        });

        if (allDone) races.splice(ri, 1);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
