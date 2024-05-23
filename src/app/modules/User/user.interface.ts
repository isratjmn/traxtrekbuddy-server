export interface TUser {
    id: any;
    name: string;
    email: string;
    password: string;
    role?: "user" | "admin";
    userProfile?: {
        bio?: string;
        age?: number;
    };
}

export type TLoginUser = {
    name: string;
    email: string;
    password: string;
};