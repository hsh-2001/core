import { IRegister } from "../models/user";
import userrepo from "../repositories/userRepo";
import common from "../utils/common";

const register = async (req: IRegister) => {
    try {
        const { password, ...rest } = req;
        const hashedPassword = await common.setPasswordHash(password);
        const reqWithHashedPassword = { ...rest, password: hashedPassword };
        const response = await userrepo.register(reqWithHashedPassword);
        return response;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred');
    }
}

const findOneUser = async (identifier: string) => {
    try {
        const response = await userrepo.findOneUser(identifier);
        return response;
    } catch (error) {
        return null;
    }
}

const getAllUsersByWebId = async (webId: number) => {
    try {
        const response = await userrepo.getAllUsersByWebId(webId);
        return response;
    } catch (error) {
        return [];
    }
}

const login = async (identifier: string, password: string) => {
    try {
        const user = await findOneUser(identifier);
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

export default {
    register,
    findOneUser,
    getAllUsersByWebId,
    login
}
