export type dragoType = {
    name: string,
    duration: number,
    generation: number,
    used: boolean,
    last?: {
        status: boolean,
        date?: string
    }
};

export type sortedDragoType = {
    name: string,
    duration: number,
    generation: number,
    used: boolean,
    last?: {
        status: boolean,
        date?: string
    },
    end?: {
        time: string
        date: string
    }
};