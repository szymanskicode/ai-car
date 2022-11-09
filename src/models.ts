export interface ICoord {
    x: number;
    y: number;
}

export interface ICoordWithOffset extends ICoord {
    offset: number;
}

export enum CONTROL {
    KEYS = 'KEYS',
    DUMMY = 'DUMMY',
    AI = 'AI',
}
