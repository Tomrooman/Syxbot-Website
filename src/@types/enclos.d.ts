export interface enclosType {
    _id: string;
    title: string;
    content: string;
}

export interface callEnclosAPIType {
    action?: string;
    enclosID?: string;
    title?: string;
    content?: string;
}
