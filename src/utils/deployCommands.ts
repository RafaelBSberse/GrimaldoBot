import 'dotenv/config';

import { getCommands } from "./getCommands.js";
import { REST, Routes } from "discord.js";

export const deployCommands = async () => {
    const commands = (await getCommands()).map(command => command.data.toJSON());

    const rest = new REST().setToken(process.env.BOT_TOKEN)

    try {
        console.log(`Iniciando deploy de ${commands.length} comandos.`)

        await rest.put(Routes.applicationCommands(process.env.BOT_CLIENT_ID), {
            body: commands
        })

        console.log('Deploy dos comandos bem sucedido.');
    } catch (error) {
        console.error(error)
    }
}