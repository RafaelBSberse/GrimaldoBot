import { Attachment, MessageFlags, SlashCommandBuilder } from "discord.js";
import ApplicationCommand from "../templates/ApplicationCommand.js";
import { SistemasDetalhes, TSistemaDetalhes } from "../constants/Sistemas.js";
import { ModalidadesDetalhes } from "../constants/Modalidades.js";
import { getCommandInputs } from "../utils/getCommandInputs.js";
import moment from "moment-timezone";

type Inputs = {
    nome: string;
    descricao: string;
    modalidade: string;
    data: string;
    nivel_minimo?: number;
    nivel_maximo?: number;
    imagem?: Attachment;
}

const getSlashCommandWithSubcommands = (): SlashCommandBuilder => {
    const command = new SlashCommandBuilder()
        .setName("criar-missao")
        .setDescription("Crie uma ]aventura que será exibida no quadro de missões.");

    Object.values(SistemasDetalhes).forEach(sistema => {
        command.addSubcommand(subcommand =>
            subcommand
                .setName(sistema.apelido)
                .setDescription(`Criar aventura para ${sistema.descricao}`)
                .addStringOption(option =>
                    option.setName("nome")
                        .setDescription("Titulo de sua aventura.")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("descricao")
                        .setDescription("Descreva como será sua aventura para atrair aventureiros, mas sem muitos spoiler's.")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("modalidade")
                        .setDescription("Sua aventura será Presencial ou Online")
                        .setChoices(Object.entries(ModalidadesDetalhes).map(([value, { nome }]) => ({ name: nome, value })))
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("data")
                        .setDescription("Data e hora que serão encerradas as incrições para a aventura. Formato DD/MM/AAAA HH:mm")
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName("nivel_minimo")
                        .setDescription("Nível mínimo que o aventureiro deve ter para participar.")
                        .setMinValue(sistema.nivelInicial)
                        .setMaxValue(sistema.nivelMaximo)
                )
                .addIntegerOption(option =>
                    option.setName("nivel_maximo")
                        .setDescription("Nível máximo que o aventureiro deve ter para participar.")
                        .setMinValue(sistema.nivelInicial)
                        .setMaxValue(sistema.nivelMaximo)
                )
                .addAttachmentOption(option =>
                    option.setName("imagem")
                        .setDescription("Adicione uma imagem para ilustrar sua aventura. Ela será exibida no quadro de aventuras.")
                )
        )
    });
    
    return command;
};

const validateDate = (date: string): boolean => moment(date, "DD/MM/YYYY HH:mm", true).isValid();
const validateNivel = (sistema: TSistemaDetalhes, nivel: number): boolean => nivel >= sistema.nivelInicial && nivel <= sistema.nivelMaximo;

export default new ApplicationCommand({
    data: getSlashCommandWithSubcommands(),
    async execute(interaction): Promise<void> {
        const { nome, descricao, modalidade, data, nivel_minimo, nivel_maximo } = getCommandInputs<Inputs>(interaction, ["nome", "descricao", "modalidade", "data", "nivel_minimo", "nivel_maximo"]);
        const [sistema, sistemaDetalhes] = Object.entries(SistemasDetalhes).find(([_, { apelido }]) => interaction.options.getSubcommand() === apelido) ?? [];
        const imagem = interaction.options.getAttachment("imagem");


        if (!nome || !descricao || !modalidade || !data) {
            interaction.reply({
                content: "Por favor, preencha todos os campos obrigatórios.",
                flags: MessageFlags.Ephemeral
            });
            return;
        }
        
        if (!sistema || !sistemaDetalhes) {
            interaction.reply({
                content: "Sistema não encontrado.",
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const erros = new Array<string>();

        if (!validateDate(data)) {
            erros.push("Data inválida. Por favor, informe a data no formato DD/MM/AAAA HH:mm");
        }

        if (nivel_minimo && !validateNivel(sistemaDetalhes, nivel_minimo)) {
            erros.push(`Nível mínimo inválido. O nível mínimo deve ser entre ${sistemaDetalhes.nivelInicial} e ${sistemaDetalhes.nivelMaximo}.`);
        }

        if (nivel_maximo && !validateNivel(sistemaDetalhes, nivel_maximo)) {
            erros.push(`Nível máximo inválido. O nível máximo deve ser entre ${sistemaDetalhes.nivelInicial} e ${sistemaDetalhes.nivelMaximo}.`);
        }

        if (nivel_minimo && nivel_maximo && nivel_minimo > nivel_maximo) {
            erros.push("Nível mínimo não pode ser maior que o nível máximo.");
        }

        if (imagem && !["image/jpeg", "image/jpg", "image/gif", "image/png"].includes(imagem.contentType ?? "")) {
            erros.push("Imagem inválida. Por favor, informe uma imagem no formato jpeg, jpg, gif ou png.");
        }

        if (erros.length) {
            interaction.reply({
                content: `Erro ao criar aventura:\n- ${erros.join("\n- ")}`,
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const dataMoment = moment(data, 'DD/MM/YYYY HH:mm');

        const { error } = await client.api.from("adventures").insert({
            name: nome,
            description: descricao,
            modality: modalidade,
            date: dataMoment.toISOString(),
            minLvl: nivel_minimo,
            maxLvl: nivel_maximo,
            system: sistema,
            masterUserId: interaction.user.id,
            image: imagem?.url,
        });

        if (error) {
            interaction.reply({
                content: "Erro ao criar aventura. Tente novamente mais tarde.",
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        interaction.reply({ content: `Aventura \"${nome}\" criada com sucesso! Confira o quadro de missões.`, flags: MessageFlags.Ephemeral });
    }
});