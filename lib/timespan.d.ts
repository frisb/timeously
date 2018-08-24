export declare class TimeSpan {
    millisec: number;
    days: number;
    hours: number;
    mins: number;
    sec: number;
    constructor(millisec?: number);
    readonly totalDays: number;
    readonly totalHours: number;
    readonly totalMins: number;
    readonly totalSec: number;
    toString(): string;
}
