"use client";

import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import gsap from "gsap";

type BlobSpec = {
	initialX: number;
	initialY: number;
	initialSizeVW: number;
	initialOpacity: number;
};

const COLORS = [
	"rgba(99,102,241,0.28)", // indigo-500
	"rgba(16,185,129,0.26)", // emerald-500
	"rgba(236,72,153,0.24)", // pink-500
	"rgba(59,130,246,0.22)", // blue-500
	"rgba(234,179,8,0.24)", // yellow-500
];

export function FlameAmbient() {
	const containerRef = useRef<HTMLDivElement>(null);
	const blobRefs = useRef<HTMLDivElement[]>([]);
	const [isClient, setIsClient] = useState(false);

	// Ensure this only runs on client side to prevent hydration mismatch
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Helpers
	const rand = (min: number, max: number) => Math.random() * (max - min) + min;
	const randInt = useCallback((min: number, max: number) => Math.floor(rand(min, max + 1)), []);
	const randStep = useCallback((min: number, max: number, step: number) => {
		const n = rand(min, max);
		return Math.round(n / step) * step;
	}, []);

	// Create a stable set of blob specs so re-renders don't reset animation
	// Only generate on client side to prevent hydration mismatch
	const specs = useMemo<BlobSpec[]>(() => {
		if (!isClient) {
			// Return empty array during SSR to prevent hydration mismatch
			return [];
		}
		return new Array(8).fill(0).map(() => ({
			initialX: randStep(-20, 20, 1),
			initialY: randStep(-15, 15, 1),
			initialSizeVW: randStep(18, 48, 0.5),
			initialOpacity: randStep(0.35, 0.75, 0.01),
		}));
	}, [randStep, isClient]);

	useEffect(() => {
		if (!containerRef.current) return;

		const animateBlob = (el: HTMLDivElement) => {
			const drift = () => ({
				x: `${rand(-40, 40).toFixed(2)}vw`,
				y: `${rand(-32, 32).toFixed(2)}vh`,
				scale: Number(rand(0.85, 1.35).toFixed(3)),
				rotation: Number(rand(-25, 25).toFixed(2)),
				duration: Number(rand(10, 24).toFixed(2)),
				ease: "sine.inOut" as const,
			});

			const borderRadiusTarget = () =>
				`${randInt(35, 55)}% ${randInt(45, 65)}% ${randInt(35, 60)}% ${randInt(45, 70)}% / ${randInt(45, 70)}% ${randInt(35, 60)}% ${randInt(45, 65)}% ${randInt(35, 55)}%`;

			const colorTarget = () => COLORS[randInt(0, COLORS.length - 1)];

			// chain tweens for continuous random wandering + morph + color shift
			const tl = gsap.timeline({ repeat: -1 });
			next();

			function next() {
				// movement
				tl.to(el, {
					...drift(),
					onComplete: next,
				});
				// shape morph
				tl.to(
					el,
					{
						borderRadius: borderRadiusTarget(),
						filter: `blur(${randInt(24, 60)}px) hue-rotate(${randInt(-30, 30)}deg)`,
						duration: Number(rand(8, 16).toFixed(2)),
						ease: "sine.inOut",
					},
					"<"
				);
				// color shift
				tl.to(
					el,
					{
						backgroundColor: colorTarget(),
						opacity: Number(rand(0.35, 0.85).toFixed(2)),
						duration: Number(rand(8, 16).toFixed(2)),
						ease: "sine.inOut",
					},
					"<"
				);
			}
		};

		const ctx = gsap.context(() => {
			// Only animate if we have specs (client-side only)
			if (specs.length > 0) {
				blobRefs.current.forEach((el) => {
					if (!el) return;
					animateBlob(el);
				});
			}
		}, containerRef);

		return () => ctx.revert();
	}, [randInt, randStep, specs]);

	return (
		<div ref={containerRef} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
			{isClient && specs.map((s, i) => (
				<div
					key={i}
					ref={(el) => {
						if (el) blobRefs.current[i] = el;
					}}
					className="absolute rounded-[50%] mix-blend-screen"
					style={{
						left: `${50 + s.initialX}vw`,
						top: `${50 + s.initialY}vh`,
						width: `${s.initialSizeVW}vw`,
						height: `${s.initialSizeVW}vw`,
						backgroundColor: COLORS[i % COLORS.length],
						opacity: s.initialOpacity,
						filter: "blur(48px)",
					}}
				/>
			))}
		</div>
	);
}
