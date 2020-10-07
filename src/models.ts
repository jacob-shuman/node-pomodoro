export enum NPError {
  MISSING_PERIODS = "MISSING_PERIODS",
  INVALID_PERIOD = "INVALID_PERIOD",
}

export interface NPDuration {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface NPPeriod {
  // Name of period
  title: string;

  // How long the period will last
  duration: NPDuration;

  // Called when the period begins
  // Args: indexes of current, next, previous periods
  // Return: Data to pass to next period
  onBegin?: (period: number, nextPeriod: number, prevPeriod: number) => void;

  // Called once an hour passes
  onHour?: (remainingTime: NPDuration) => void;

  // Called once an hour passes
  onMinute?: (remainingTime: NPDuration) => void;

  // Called once an hour passes
  onSecond?: (remainingTime: NPDuration) => void;

  // Called when the period ends
  // Args: indexes of current, next, previous periods
  onEnd?: (period: number, nextPeriod: number, prevPeriod: number) => void;
}
