import { fileURLToPath } from "url";
import { readdirSync } from "fs";
import path from "path";
import ApplicationEvent from "../templates/ApplicationEvent.js";

export const registerEvents = async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const eventsPath = path.join(__dirname, '../events');
    const eventsFiles: string[] = readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'))

    for (const file of eventsFiles) {
        const event: ApplicationEvent<any> = (await import(`../events/${file}`)).default;

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
};