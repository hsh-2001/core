import { IRegister } from "./user.types";
import userrepo from "./user.repository";
import common from "../../shared/auth";

const register = async (req: IRegister) => {
    try {
        const { password, ...rest } = req;

        // Validate that the website exists
        const website = await userrepo.findWebsiteById(Number(rest.webId));
        if (!website) {
            throw new Error('Website not found');
        }

        // Check if user already exists by username or email
        const existingUser = await findOneUser(rest.username) || await findOneUser(rest.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

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
        const token = await common.generateToken({
            webId: user.webId,
            username: user.username,
            email: user.email
        });
        const { password: _password, ...userWithoutPassword } = user;
        return { token, ...userWithoutPassword };
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
