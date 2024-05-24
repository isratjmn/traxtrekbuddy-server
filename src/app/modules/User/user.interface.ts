export interface TUser {
    // id: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
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