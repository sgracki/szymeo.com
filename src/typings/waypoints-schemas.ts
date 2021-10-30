import type { FixedLengthArray } from './fixed-array';

export interface WayPoint {
    coords: FixedLengthArray<[number, number]>;
    callback: () => void;
}

export type WayPointsSchema = Array<WayPoint>;

export const wayPoints: WayPointsSchema = [
    {
        coords: [3,3],
        callback: () => console.log('waypoint reached [3,3]')
    }, {
        coords: [3,13],
        callback: () => console.log('waypoint reached [3,13]')
    }, {
        coords: [12,4],
        callback: () => console.log('waypoint reached [12,4]')
    }
];