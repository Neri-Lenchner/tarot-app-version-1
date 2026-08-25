import { useCallback, useRef } from 'react';

interface TiltOptions {
    max?: number;
    scale?: number;
    perspective?: number;
    moveTransitionMs?: number;
}

// Tracks the cursor over the element and drives a perspective tilt + a
// glare highlight via inline style/CSS vars (not React state) so every
// mouse move doesn't trigger a re-render.
export function useTilt<T extends HTMLElement>({ max = 14, scale = 1.1, perspective = 700, moveTransitionMs = 50 }: TiltOptions = {}) {
    const ref = useRef<T | null>(null);

    const onMouseMove = useCallback((e: React.MouseEvent<T>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * max * 2;
        const rotateX = (0.5 - y) * max * 2;
        el.style.transition = `transform ${moveTransitionMs}ms ease-out`;
        el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
        el.style.setProperty('--glare-x', `${x * 100}%`);
        el.style.setProperty('--glare-y', `${y * 100}%`);
        el.style.setProperty('--glare-opacity', '1');
    }, [max, scale, perspective, moveTransitionMs]);

    const onMouseLeave = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        el.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
        el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
        el.style.setProperty('--glare-opacity', '0');
    }, [perspective]);

    return { ref, onMouseMove, onMouseLeave };
}
