import { CELL_SIZE, PLAYER_SIZE, WALL_WIDTH } from './constants';
import { mainMazeSchema } from './schemas/maze-schemas';
import { Point } from './schemas/point';
import { WayPoint, wayPoints } from './schemas/waypoints-schemas';

export function detectCollision(position: Point): [boolean[], WayPoint|null] {
    const [xIdx, yIdx]: number[] = [Math.ceil((position.x + PLAYER_SIZE / 2) / CELL_SIZE) - 1, Math.ceil((position.y + PLAYER_SIZE / 2) / CELL_SIZE) - 1];
    const [topWall, rightWall, bottomWall, leftWall] = mainMazeSchema[yIdx][xIdx];
    const cellXY: Point = { x: xIdx * CELL_SIZE, y: yIdx * CELL_SIZE };
    const wallsCollision = [
        (topWall !== 0) && position.y - PLAYER_SIZE < cellXY.y + WALL_WIDTH,
        (rightWall !== 0) && position.x + PLAYER_SIZE > cellXY.x + CELL_SIZE - WALL_WIDTH,
        (bottomWall !== 0) && position.y + PLAYER_SIZE > cellXY.y + CELL_SIZE - WALL_WIDTH,
        (leftWall !== 0) && position.x - PLAYER_SIZE < cellXY.x + WALL_WIDTH,
    ];
    const collidingWaypoint = wayPoints.find((wayPoint: WayPoint) => xIdx === wayPoint.coords[0] - 1 && yIdx === wayPoint.coords[1] - 1);

    return [wallsCollision, collidingWaypoint];
}