import { NPPeriod } from "./models";
export declare const isValidPeriod: (period: NPPeriod) => boolean;
export declare class NPTimer {
    private periodIndex;
    private periods;
    private periodChanged;
    private periodCounter;
    private intervalId?;
    onPeriodChange?: (period: NPPeriod, nextPeriod: NPPeriod, prevPeriod: NPPeriod) => void;
    onStart?: () => void;
    onStop?: () => void;
    onReset?: () => void;
    get period(): NPPeriod;
    running: boolean;
    constructor(options: {
        periods: NPPeriod[];
        startImmediately?: boolean;
        onPeriodChange?: (period: NPPeriod, nextPeriod: NPPeriod, prevPeriod: NPPeriod) => void;
        onStart?: () => void;
        onStop?: () => void;
        onReset?: () => void;
    });
    start(): void;
    stop(): void;
    reset(): void;
    toggleState(): void;
    addPeriod(period: NPPeriod): void;
}
export default NPTimer;
