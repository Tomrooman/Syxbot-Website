export interface noteType {
    title: string;
    content: string;
};

export interface createNoteType {
    title: string;
    content: string;
};

export interface modifyNoteType {
    title: string;
    oldContent: string;
    newContent: string;
};