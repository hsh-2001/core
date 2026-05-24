import { Hono } from 'hono';
import commoncontroller from '../controllers/commonController';

const common = new Hono();

common.post("/send-email", commoncontroller.sendEmail);

export default common;