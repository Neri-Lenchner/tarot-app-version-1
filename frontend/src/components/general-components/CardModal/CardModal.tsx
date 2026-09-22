import { JSX, ReactNode } from "react";
import { X } from "lucide-react";
import styles from "./CardModal.module.css";

interface Props {
    /** Card title shown at the top. */
    name?: string;
    /** Optional uppercase position line under the name (Celtic / ThreeCards). */
    position?: string;
    /** Body text direction — 'rtl' when showing Hebrew. */
    dir?: "ltr" | "rtl";
    /** Render the EN/HE toggle. Omit both to hide it (Carousel / Deck). */
    langLabel?: string;
    onLangToggle?: () => void;
    onClose: () => void;
    children: ReactNode;
}

export function CardModal({
    name,
    position,
    dir = "ltr",
    langLabel,
    onLangToggle,
    onClose,
    children,
}: Props): JSX.Element {
    return (
        // `modal-widget-root` stays a plain global string — it is matched
        // from outside this component (InterpretWidget/ConclusionModal/
        // CombinationsModal's own outside-click handlers), so it must NOT
        // be hashed by the CSS module.
        <div className={`${styles.overlay} modal-widget-root`} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby={name ? "card-modal-heading" : undefined}>
                <div className={styles.header}>
                    <button className={styles.close} onClick={onClose} aria-label="Close">
                        <X size={18} />
                    </button>
                    {langLabel && onLangToggle && (
                        <button className={styles.langBtn} onClick={onLangToggle}>
                            {langLabel}
                        </button>
                    )}
                </div>
                {name && <h3 id="card-modal-heading" className={styles.name}>{name}</h3>}
                {position && (
                    <p className={styles.position} dir={dir}>
                        {position}
                    </p>
                )}
                <div dir={dir}>{children}</div>
            </div>
        </div>
    );
}

/** Body-text classes, so callers style their paragraphs from this file
 *  instead of re-declaring .card-modal-meaning / -desc per route. */
export const cardModalText = {
    meaning: styles.meaning,
    desc: styles.desc,
};
