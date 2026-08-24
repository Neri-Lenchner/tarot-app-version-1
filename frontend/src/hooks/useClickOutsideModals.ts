import { useEffect } from 'react';

// Elements tagged with this class are treated as "inside modal space" —
// clicking anywhere that isn't inside any of them closes every active caller.
export const MODAL_ROOT_CLASS = 'modal-widget-root';

export function useClickOutsideModals(onOutsideClick: () => void, active: boolean): void {
    useEffect(() => {
        if (!active) return;
        function handleClick(e: MouseEvent): void {
            if (!(e.target as HTMLElement).closest(`.${MODAL_ROOT_CLASS}`)) {
                onOutsideClick();
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [active, onOutsideClick]);
}
