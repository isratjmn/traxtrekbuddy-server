export interface TUser {
    name: string;
    email: string;
    password: string;
    role?: "user" | "admin";
    userProfile: {
        bio?: string;
        age?: number;
    };
}

export type TLoginUser = {
    email: string;
    password: string;
};