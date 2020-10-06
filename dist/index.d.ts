import { NPPeriod } from "./models";
export declare const isValidPeriod: (period: NPPeriod) => boolean;
export declare class NPTimer {
    private period;
    private periods;
    private periodChanged;
    private periodCounter;
    private intervalId?;
    private onPeriodChange?;
    constructor(options: {
        periods: NPPeriod[];
        startImmediately?: boolean;
        onPeriodChange?: (period: NPPeriod, nextPeriod: NPPeriod, prevPeriod: NPPeriod) => void;
    });
    start(): void;
    stop(): void;
    addPeriod(period: NPPeriod): void;
    reset(): void;
}
export default NPTimer;
