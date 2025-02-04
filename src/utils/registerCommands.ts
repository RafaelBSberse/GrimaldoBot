import { getCommands } from "./getCommands.js";

export const registerCommands = async () => {
    client.commands = await getCommands();
};