export declare enum NPError {
    MISSING_PERIODS = "MISSING_PERIODS",
    INVALID_PERIOD = "INVALID_PERIOD"
}
export interface NPDuration {
    hours: number;
    minutes: number;
    seconds: number;
}
export interface NPPeriod {
    title: string;
    duration: NPDuration;
    onBegin?: (period: number, nextPeriod: number, prevPeriod: number) => void;
    onHour?: (hour: number) => void;
    onMinute?: (minute: number) => void;
    onSecond?: (second: number) => void;
    onEnd?: (period: number, nextPeriod: number, prevPeriod: number) => void;
}
