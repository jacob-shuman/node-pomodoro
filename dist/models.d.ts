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
    onHour?: (remainingTime: NPDuration) => void;
    onMinute?: (remainingTime: NPDuration) => void;
    onSecond?: (remainingTime: NPDuration) => void;
    onEnd?: (period: number, nextPeriod: number, prevPeriod: number) => void;
}
