import path from "path";
import fs from 'fs'
import { fileURLToPath } from "url";
import DatabaseRealtimeAction from "../templates/DatabaseRealtimeAction.js";

export const getRealtimeEvents = async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const realtimeEvents = [];

    const realtimeEventPath = path.join(__dirname, '../supabase/realtime');
    const realtimeEventsFiles: string[] = fs.readdirSync(realtimeEventPath).filter(file => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of realtimeEventsFiles) {
        const realtimeEvent: DatabaseRealtimeAction<any, any, any> = (await import(`../supabase/realtime/${file}`)).default;
        realtimeEvents.push(realtimeEvent)
    }

    return realtimeEvents;
};