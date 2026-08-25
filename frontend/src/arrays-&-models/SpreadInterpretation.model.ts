export interface ISpreadInterpretation {
    en: string | null;
    he: string | null;
    heLoading?: boolean;
    heFailed?: boolean;
    followupQ?: string | null;
    followupAnswer?: string | null;
    // Bumped on every fresh interpret request and on Clear. An in-flight
    // request captures this value when it starts and only commits its
    // result if it's still current when it finishes — so a stale response
    // (e.g. from a page the user already navigated away from) can't
    // clobber a newer one, while a request nobody superseded still lands
    // normally even after navigating away.
    requestId?: number;
}
