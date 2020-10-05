import { NPPeriod, NPError } from "./models";

export const isValidPeriod = (period: NPPeriod): boolean => {
  return (
    period.duration.hours < 0 ||
    period.duration.minutes < 0 ||
    period.duration.seconds < 0
  );
};

export class NPTimer {
  private period: number = 0;
  private periods: NPPeriod[];

  private startImmediately?: boolean;
  private intervalId?: number;

  constructor(periods: NPPeriod[], startImmediately?: boolean) {
    if (periods.length < 1) {
      throw Error(NPError.MISSING_PERIODS);
    } else if (periods.some((p) => !isValidPeriod(p))) {
      throw Error(NPError.INVALID_PERIOD);
    }

    this.periods = periods;

    if (startImmediately) {
      this.start();
    }
  }

  private runTimer() {
    this.periods[this.period].onSecond(0);
  }

  start() {
    this.intervalId = setInterval(this.runTimer, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  reset() {
    this.period = 0;

    this.stop();
  }
}

export default NPTimer;
