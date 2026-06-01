import { IRegister } from "./user.types";
import common from "../../shared/auth";
import query from "../../shared/db";

const register = async (req: IRegister) => {
    const { webId, username, password, email } = req;
    try {
        // const existingUser = await findOneUser(webId) || await findOneUser(username) || await findOneUser(email);
        // if (existingUser) {
        //     throw new Error('User with the same webId, username, or email already exists');
        // }
        const response = await query(
            'INSERT INTO users (web_id, username, password, email) VALUES ($1, $2, $3, $4) RETURNING id',
            [webId, username, password, email]
        ) as any[];
        return { message: 'User registered successfully', userId: response[0].id };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred');
    }
}

const login = async (identifier: string, password: string) => {
    try {
        const user = await findUserByUsernameOrEmail(identifier);
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await common.comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        return user;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred');
    }
}

const findUserByUsernameOrEmail = async (identifier: string) => {
    try {
        const response = await query(
            'SELECT id, web_id AS "webId", username, email, password, created_at AS "createdAt", updated_at AS "updatedAt" FROM users WHERE username = $1 OR email = $1',
            [identifier]
        ) as any[];
        return response[0] ?? null;
    } catch (error) {
        return null;
    }
}


const findWebsiteById = async (webId: number) => {
    try {
        const response = await query(
            'SELECT id, web_name AS "webName", domain FROM websites WHERE id = $1',
            [webId]
        ) as any[];
        return response[0] ?? null;
    } catch (error) {
        return null;
    }
}

const getAllUsersByWebId = async (webId: number) => {
    try {
        const response = await query(
            'SELECT id, web_id AS "webId", username, email, password, created_at AS "createdAt", updated_at AS "updatedAt" FROM users WHERE web_id = $1',
            [webId]
        ) as any[];
        return response;
    } catch (error) {
        return [];
    }
}

const findUniqueUserByWebId = async (webId: number, username: string, email: string) => {
    try {
        const response = await query(
            'SELECT id, web_id AS "webId", username, email, password, created_at AS "createdAt", updated_at AS "updatedAt" FROM users WHERE web_id = $1 AND (username = $2 OR email = $3)',
            [webId, username, email]
        ) as any[];
        return response[0] ?? null;
    } catch (error) {
        return null;
    }
}

export default {
    register,
    findOneUser: findUserByUsernameOrEmail,
    getAllUsersByWebId,
    login,
    findWebsiteById,
    findUniqueUserByWebId
}
