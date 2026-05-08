import type { ITokenPayload } from './../models/user';
import bcrypt from "bcryptjs";
import * as jose from 'jose';

let jwtSecret: string | undefined;

export const setJwtSecret = (secret: string) => {
    jwtSecret = secret;
};

const getJwtSecret = () => {
    if (!jwtSecret) {
        throw new Error('JWT secret is not defined');
    }

    return new TextEncoder().encode(jwtSecret);
};

const setPasswordHash = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}

const generateToken = async (payload: ITokenPayload): Promise<string> => {
    const token = await new jose.SignJWT(payload as unknown as jose.JWTPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('2h')
        .sign(getJwtSecret());
    return token;
}

const verifyToken = async (token: string): Promise<ITokenPayload> => {
    const { payload } = await jose.jwtVerify(token, getJwtSecret());
    return payload as unknown as ITokenPayload;
}

export default {
    setPasswordHash,
    comparePassword,
    generateToken,
    verifyToken,
    setJwtSecret
}
