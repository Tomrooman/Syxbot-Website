export interface dragoType {
    name: string;
    duration: number;
    generation: number;
    used: boolean;
    last: {
        status: boolean;
        date?: string;
    };
}

export interface sortedDragoType {
    name: string;
    duration: number;
    generation: number;
    used: boolean;
    selected?: boolean;
    last: {
        status: boolean;
        date?: string;
    };
    end: {
        time: string;
        date: number;
    };
}

export interface ddFecondType {
    name: string;
    duration: number;
    generation: number;
    used: boolean;
    last: {
        status: boolean;
        date: string;
    };
}

export interface localDragodindesType {
    name: string;
    duration?: number;
    generation?: number;
    used?: boolean;
}

export interface usedAndLastArrayDragoType {
    used: dragoType[];
    last: dragoType[];
}

export interface dragoSelectedtype {
    name: string,
    duration: number,
    parchment: string,
    generation: number,
    selected?: boolean
}
