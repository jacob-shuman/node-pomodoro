import { NPPeriod, NPError, NPDuration } from "./models";

export const isValidPeriod = (period: NPPeriod): boolean => {
  return (
    period.duration.hours > 0 ||
    period.duration.minutes > 0 ||
    period.duration.seconds > 0
  );
};

export class NPTimer {
  private periodIndex: number = 0;
  private periods: NPPeriod[] = [];
  private periodChanged = true;
  private periodCounter: NPDuration = { hours: 0, minutes: 0, seconds: 0 };

  private intervalId?: number;

  onPeriodChange?: (
    period: NPPeriod,
    nextPeriod: NPPeriod,
    prevPeriod: NPPeriod
  ) => void;
  onStart?: () => void;
  onStop?: () => void;
  onReset?: () => void;

  onHour?: (hour: number) => void;
  onMinute?: (minute: number) => void;
  onSecond?: (second: number) => void;

  public get period(): NPPeriod {
    return this.periods[this.periodIndex];
  }

  running: boolean = false;

  constructor(options: {
    periods: NPPeriod[];
    startImmediately?: boolean;
    onPeriodChange?: (
      period: NPPeriod,
      nextPeriod: NPPeriod,
      prevPeriod: NPPeriod
    ) => void;
    onStart?: () => void;
    onStop?: () => void;
    onReset?: () => void;
    onHour?: (hour: number) => void;
    onMinute?: (minute: number) => void;
    onSecond?: (second: number) => void;
  }) {
    const { periods, startImmediately, onPeriodChange } = options;

    if (periods.length < 1) {
      throw Error(NPError.MISSING_PERIODS);
    } else if (periods.some((p) => !isValidPeriod(p))) {
      throw Error(NPError.INVALID_PERIOD);
    }

    this.periods = periods;
    this.onPeriodChange = onPeriodChange;
    this.periodCounter = { ...this.periods[this.periodIndex].duration };

    if (startImmediately) {
      this.start();
    }
  }

  start(): void {
    if (!this.running) {
      this.intervalId = setInterval(() => {
        if (this.periodChanged && this.onPeriodChange) {
          this.periodChanged = false;

          const nextPeriod =
            this.periodIndex < this.periods.length - 1
              ? this.periodIndex + 1
              : 0;

          const prevPeriod =
            this.periodIndex > 0
              ? this.periodIndex - 1
              : this.periods.length - 1;

          this.onPeriodChange!(
            this.periods[this.periodIndex],
            this.periods[nextPeriod],
            this.periods[prevPeriod]
          );
        }

        if (this.periodCounter.hours > 0) {
          if (this.periods[this.periodIndex].onHour) {
            this.periods[this.periodIndex].onHour!(this.periodCounter.hours);
          }

          if (this.onHour) {
            this.onHour!(this.periodCounter.hours);
          }
        }

        if (this.periodCounter.minutes > 0) {
          if (this.periods[this.periodIndex].onMinute) {
            this.periods[this.periodIndex].onMinute!(
              this.periodCounter.minutes
            );
          }

          if (this.onMinute) {
            this.onMinute!(this.periodCounter.minutes);
          }
        }

        if (this.periodCounter.seconds > 0) {
          if (this.periods[this.periodIndex].onSecond) {
            this.periods[this.periodIndex].onSecond!(
              this.periodCounter.seconds
            );
          }

          if (this.onSecond) {
            this.onSecond!(this.periodCounter.seconds);
          }
        }

        if (this.periodCounter.seconds > 1) {
          this.periodCounter.seconds--;
        } else if (this.periodCounter.minutes > 1) {
          this.periodCounter.minutes--;
          this.periodCounter.seconds = 59;
        } else if (this.periodCounter.hours > 1) {
          this.periodCounter.hours--;
          this.periodCounter.minutes = 59;
          this.periodCounter.seconds = 59;
        } else if (
          this.periodCounter.hours < 2 &&
          this.periodCounter.minutes < 2 &&
          this.periodCounter.seconds < 2
        ) {
          if (this.periodIndex < this.periods.length - 1) {
            this.periodIndex++;
          } else {
            this.periodIndex = 0;
          }

          this.periodCounter = { ...this.periods[this.periodIndex].duration };
          this.periodChanged = true;
        }
      }, 1000);

      this.running = true;

      if (this.onStart) {
        this.onStart();
      }
    }
  }

  stop(): void {
    if (this.running) {
      clearInterval(this.intervalId);

      this.running = false;

      if (this.onStop) {
        this.onStop();
      }
    }
  }

  reset(): void {
    if (this.running) {
      this.stop();
    }

    this.periodIndex = 0;

    if (this.onReset) {
      this.onReset();
    }
  }

  toggleState(): void {
    if (this.running) {
      this.stop();
    } else {
      this.start();
    }
  }

  addPeriod(period: NPPeriod): void {
    this.periods.push(period);
  }
}

export default NPTimer;
