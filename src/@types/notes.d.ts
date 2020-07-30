export interface noteType {
    title: string;
    content: string;
};

export interface createNoteType {
    userId: string;
    title: string;
    content: string;
};

export interface modifyNoteType {
    userId: string;
    title: string;
    oldContent: string;
    newContent: string;
};