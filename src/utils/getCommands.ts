import ApplicationCommand from "../templates/ApplicationCommand.js";
import path from "path";
import fs from 'fs'
import { Collection } from "discord.js";
import { fileURLToPath } from "url";

export const getCommands = async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const commands = new Collection<string, ApplicationCommand>();

    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles: string[] = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of commandFiles) {
        const command: ApplicationCommand = (await import(`../commands/${file}`)).default;
        commands.set(command.data.name, command)
    }

    return commands;
};