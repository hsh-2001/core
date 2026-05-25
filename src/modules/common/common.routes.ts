import { Hono } from 'hono';
import commoncontroller from './common.controller';

const common = new Hono();

common.post("/send-email", commoncontroller.sendEmail);

export default common;
