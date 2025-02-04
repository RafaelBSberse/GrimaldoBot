import { Events } from "discord.js";
import ApplicationEvent from "../templates/ApplicationEvent.js";

export default new ApplicationEvent({
    name: Events.ClientReady,
    once: true,
    execute: (readyClient) => {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    }
});