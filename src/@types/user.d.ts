export interface userType {
    countdown: boolean;
    discriminator: string;
    expire_at: number;
    id: string;
    token_type: string;
    username: string;

};

export interface sessionDataType {
    username: string;
    discriminator: string;
    userId: string;
    token_type: string;
    expires_in: number;
    countdown: boolean;
    token: string;
};