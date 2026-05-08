import { Hono } from 'hono'
import userController from '../controllers/userController';
import type { AppEnv } from '../types';

const user = new Hono<AppEnv>();

user.post('/register', userController.register);
user.get('/find/:identifier', userController.findOneUser);
user.get('/web/:webId', userController.getAllUsersByWebId);
user.post('/login', userController.login);

export default user;
