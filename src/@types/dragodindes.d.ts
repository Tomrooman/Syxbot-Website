export interface dragoType {
    name: string;
    duration: number;
    generation: number;
    used: boolean;
    last?: {
        status: boolean;
        date?: string;
    };
};

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
        date: string;
    };
};

export interface localDragodindesType {
    name: string;
    duration?: string;
    generation?: number;
    used?: boolean;
}

export interface selectedDragoType {
    used: dragoType[];
    last: dragoType[];
}

export type dragoSelectedtype = {
    name: string,
    duration: number,
    parchment: string,
    generation: number,
    selected?: boolean
};