import { EmbedBuilder } from "discord.js";
import { Canais } from "../constants/Canais.js";
import { Database } from "../supabase/types/supabase.js";
import { ModalidadesDetalhes } from "../constants/Modalidades.js";
import { SistemasDetalhes } from "../constants/Sistemas.js";

type Payload = {
    new: Database["public"]["Tables"]["adventures"]["Row"];
}

export const apiRealtimeSubscriptions = async () => {
    await client.api.channel("public:adventures").unsubscribe();

    const canal = await client.channels.fetch(Canais.QUADRO_DE_AVENTURAS);

    client.api
        .channel("custom-insert-channel")
        .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "adventures" },
            async (payload: Payload) => {
                try {
                    if (canal && canal.isSendable()) {
                        const embed = await createEmbeded(payload);
                        canal.send({ embeds: [embed] });
                    } else {
                        console.log('Canal não encontrado!');
                    }
                } catch (error) {
                    console.error('Erro ao enviar mensagem:', error);
                }
            }
        )
        .subscribe();
};

const createEmbeded = async (payload: Payload) => {
    const mestre = await client.users.fetch(String(payload.new.masterUserId));

    return new EmbedBuilder()
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
}