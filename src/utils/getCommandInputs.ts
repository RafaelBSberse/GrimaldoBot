import { ChatInputCommandInteraction } from "discord.js";

export const getCommandInputs = <K>(interaction: ChatInputCommandInteraction, inputs: Array<keyof K>): Partial<K> => {
    if (!interaction) {
        return {};
    }

	const result: Partial<K> = {};

	inputs.forEach(input => {
        const value = interaction.options.get(input as string);

        if (value && input) {
            result[input] = value.value as K[keyof K];
        }
	});

	return result;
}