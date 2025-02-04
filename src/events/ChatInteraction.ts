import { Events, MessageFlags } from "discord.js";
import ApplicationEvent from "../templates/ApplicationEvent.js";

export default new ApplicationEvent({
    name: Events.InteractionCreate,
    once: false,
    execute: (event) => {
        if (!event.isCommand()) return;

        const { commandName } = event;

        const command = client.commands.get(commandName);

        if (!command) return;

        try {
            command.execute(event);
        } catch (error) {
            console.error(error);
            event.reply({ content: 'Ocorreu um erro ao executar este comando. Tente novamente.', flags: MessageFlags.Ephemeral });
        }
    }
});