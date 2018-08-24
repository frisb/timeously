import { INTERVAL_TYPE } from './intervaltype';
export interface ITimeouslyOptions {
    name: string;
    interval: number;
    type: INTERVAL_TYPE;
    tz: string;
    start: number;
    stop: number;
}
export declare class Timeously {
    private name;
    private interval;
    private intervalType;
    private tz;
    private callback;
    private startTime;
    private stopTime;
    private started;
    private timerID;
    constructor(options: ITimeouslyOptions, callback: () => void);
    private readonly title;
    private readonly now;
    start(): void;
    stop(): void;
    private execute;
    private calculateNextTimeout;
    private setLongTimeout;
}
