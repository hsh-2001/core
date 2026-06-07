import { Hono } from 'hono';
import commoncontroller from './common.controller';

const common = new Hono();

common.post("/send-email", commoncontroller.sendEmail);
common.post("/auto-meeting-scheduler", commoncontroller.autoMeetingScheduler);

export default common;
