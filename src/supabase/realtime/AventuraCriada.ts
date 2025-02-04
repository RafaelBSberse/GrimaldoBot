import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from "@supabase/supabase-js";
import DatabaseRealtimeAction from "../../templates/DatabaseRealtimeAction.js";
import { EmbedBuilder } from "discord.js";
import { ModalidadesDetalhes } from "../../constants/Modalidades.js";
import { SistemasDetalhes } from "../../constants/Sistemas.js";
import { Canais } from "../../constants/Canais.js";

const canal = await client.channels.fetch(Canais.QUADRO_DE_AVENTURAS);

export default new DatabaseRealtimeAction({
    schema: "public",
    table: "adventures",
    event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT,
    callback: async (payload) => {
        const mestre = await client.users.fetch(String(payload.new.masterUserId));

        const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle(payload.new.name)
            .setDescription(payload.new.description)
            .setAuthor({ name: mestre.username, iconURL: mestre.avatarURL() ?? "" })
            .addFields(
                { name: "Nível mínimo", value: `${payload.new.minLvl ?? "-"}`, inline: true },
                { name: "Nível máximo", value: `${payload.new.maxLvl ?? "-"}`, inline: true },
                { name: "Modalidade", value: `${ModalidadesDetalhes[payload.new.modality].descricao}`, inline: true },
            )
            .setImage(payload.new.image ?? SistemasDetalhes[payload.new.system].imagem)
            .setFooter({ text: "Você pode se inscrever para a aventura reagindo a está mensagem." });

        try {
            if (canal && canal.isSendable()) {
                canal.send({ embeds: [embed] });
            } else {
                console.log('Canal não encontrado!');
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    }
});