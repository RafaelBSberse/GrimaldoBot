import type {
    ChatInputCommandInteraction,
    ContextMenuCommandBuilder,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandsOnlyBuilder
} from 'discord.js'

type ApplicationCommandData = 
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | ContextMenuCommandBuilder;

export default class ApplicationCommand {
    data: ApplicationCommandData;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;

    constructor(options: {
        data: ApplicationCommandData,
        execute: (
            interaction: ChatInputCommandInteraction
        ) => Promise<void> | void
    }) {
        this.data = options.data
        this.execute = options.execute
    }
}