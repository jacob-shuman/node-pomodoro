import { NPPeriod, NPError, NPDuration } from "./models";

export const isValidPeriod = (period: NPPeriod): boolean => {
  return (
    period.duration.hours > 0 ||
    period.duration.minutes > 0 ||
    period.duration.seconds > 0
  );
};

export class NPTimer {
  private period: number = 0;
  private periods: NPPeriod[] = [];
  private periodChanged = false;
  private periodCounter: NPDuration = { hours: 0, minutes: 0, seconds: 0 };

  private intervalId?: number;
  private onPeriodChange?: (
    period: NPPeriod,
    nextPeriod: NPPeriod,
    prevPeriod: NPPeriod
  ) => void;

  constructor(options: {
    periods: NPPeriod[];
    startImmediately?: boolean;
    onPeriodChange?: (
      period: NPPeriod,
      nextPeriod: NPPeriod,
      prevPeriod: NPPeriod
    ) => void;
  }) {
    const { periods, startImmediately, onPeriodChange } = options;

    if (periods.length < 1) {
      throw Error(NPError.MISSING_PERIODS);
    } else if (periods.some((p) => !isValidPeriod(p))) {
      throw Error(NPError.INVALID_PERIOD);
    }

    this.periods = periods;
    this.onPeriodChange = onPeriodChange;
    this.periodCounter = { ...this.periods[this.period].duration };

    if (startImmediately) {
      this.start();
    }
  }

  start() {
    this.intervalId = setInterval(() => {
      if (this.periodChanged && this.onPeriodChange) {
        this.periodChanged = false;

        const nextPeriod =
          this.period < this.periods.length - 1 ? this.period + 1 : 0;

        const prevPeriod =
          this.period > 0 ? this.period - 1 : this.periods.length - 1;

        this.onPeriodChange!(
          this.periods[this.period],
          this.periods[nextPeriod],
          this.periods[prevPeriod]
        );
      }

      if (this.periods[this.period].onHour && this.periodCounter.hours > 0) {
        this.periods[this.period].onHour!(this.periodCounter.hours);
      }

      if (
        this.periods[this.period].onMinute &&
        this.periodCounter.minutes > 0
      ) {
        this.periods[this.period].onMinute!(this.periodCounter.minutes);
      }

      if (
        this.periods[this.period].onSecond &&
        this.periodCounter.seconds > 0
      ) {
        this.periods[this.period].onSecond!(this.periodCounter.seconds);
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
        if (this.period < this.periods.length - 1) {
          this.period++;
        } else {
          this.period = 0;
        }

        this.periodCounter = { ...this.periods[this.period].duration };
        this.periodChanged = true;
      }
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  addPeriod(period: NPPeriod) {
    this.periods.push(period);
  }

  reset() {
    this.stop();
    this.period = 0;
  }
}

export default NPTimer;
