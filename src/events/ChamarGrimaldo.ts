import { Events } from "discord.js";
import ApplicationEvent from "../templates/ApplicationEvent.js";

export default new ApplicationEvent({
    name: Events.MessageCreate,
    once: false,
    execute: (event) => {
        if (event.mentions.has(event.client.user) && !event.mentions.everyone) {
            const falas = [
                "Estou muito cansado, volte outra hora.",
                "Não me incomode.",
                "Não estou com vontade de falar.",
                "Não me perturbe.",
                "Estou ocupado descansando, volte mais tarde.",
                "Ta carente? Peça ajuda para o psicóloga da guilda."
            ];
    
            const fala = falas[Math.floor(Math.random() * falas.length)];
    
            event.reply({ content: fala });
        }
    }
});