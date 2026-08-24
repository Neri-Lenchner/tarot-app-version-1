export interface IAuthUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    gender?: 'male' | 'female';
}
