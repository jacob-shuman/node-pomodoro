export enum NPError {
  MISSING_PERIODS = "MISSING_PERIODS",
  INVALID_PERIOD = "INVALID_PERIOD",
}

export interface NPPeriodDuration {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface NPPeriod {
  // Name of period
  title: string;

  // How long the period will last
  duration: NPPeriodDuration;

  // Called when the period begins
  // Args: data passed from last period, indexes of current, next, previous periods
  // Return: Data to pass to next period
  onBegin: (
    period: number,
    nextPeriod: number,
    prevPeriod: number,
    data?: any
  ) => void;

  // Called once an hour passes
  onHour: (hour: number) => void;

  // Called once an hour passes
  onMinute: (minute: number) => void;

  // Called once an hour passes
  onSecond: (second: number) => void;

  // Called when the period ends
  // Args: indexes of current, next, previous periods
  // Return: Data to pass to next period
  onEnd: (period: number, nextPeriod: number, prevPeriod: number) => any;
}
