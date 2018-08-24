export declare class TimeBucket {
    [intervalType: string]: any;
    tzOffsetMinutes: number;
    private date;
    constructor(date?: Date | string);
    static readonly MonthNames: string[];
    static readonly DayNames: string[];
    readonly offsetString: string;
    tz(timezone: string): this;
    subtract(timeBucket: TimeBucket): number;
    toString(format?: string): string;
    valueOf(): number;
    toUTCDate(): Date;
    toISOString(withTimeZoneOffset?: boolean): string;
    millisecond: number;
    second: number;
    minute: number;
    hour: number;
    day: number;
    readonly dayName: string;
    month: number;
    readonly monthName: string;
    year: number;
    readonly daysInMonth: number;
}
