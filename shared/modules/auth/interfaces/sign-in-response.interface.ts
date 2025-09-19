export interface ISignInResponse {
    accessToken: string;
    refreshToken: string;
    idToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
} 