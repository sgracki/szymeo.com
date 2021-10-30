import type { FixedLengthArray } from './fixed-array';

export interface WayPoint {
    coords: FixedLengthArray<[number, number]>;
    callback: () => void;
}

export type WayPointsSchema = Array<WayPoint>;

const point: WayPoint = {
    coords: [1,1],
    callback: () => null
}

const points: Array<WayPoint> = [point];

export const wayPoints: WayPointsSchema = [
    {
        coords: [3,3],
        callback: () => console.log('waypoint reached [3,3]')
    }, {
        coords: [5,10],
        callback: () => console.log('waypoint reached [5,10]')
    }
];