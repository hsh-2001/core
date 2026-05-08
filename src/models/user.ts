export interface IRegister {
    webId: string;
    username: string;
    password: string;
    email: string;
}

export interface ITokenPayload {
    webId: string | number;
    username: string;
    email: string;
}
