import { useEffect, useState } from 'react';

type Listener = () => void;

let visible = false;
const listeners = new Set<Listener>();

function notify(): void {
    listeners.forEach(fn => fn());
}

export const noticeStore = {
    show(): void {
        visible = true;
        notify();
    },
    hide(): void {
        visible = false;
        notify();
    },
    getState(): boolean {
        return visible;
    },
    subscribe(fn: Listener): () => void {
        listeners.add(fn);
        return () => listeners.delete(fn);
    },
};

// First-ever visit to the site (any page) shows the notice once, tracked
// via localStorage so returning visitors aren't nagged on every load.
// Every login/register still explicitly re-shows it regardless of this
// flag — see AuthService.ts.
const FIRST_VISIT_KEY = 'hasSeenNotice';

export function showNoticeOnFirstVisit(): void {
    if (localStorage.getItem(FIRST_VISIT_KEY)) return;
    localStorage.setItem(FIRST_VISIT_KEY, '1');
    noticeStore.show();
}

export function useNoticeVisible(): boolean {
    const [v, setV] = useState(noticeStore.getState());
    useEffect(() => noticeStore.subscribe(() => setV(noticeStore.getState())), []);
    return v;
}
