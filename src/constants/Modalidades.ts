export enum ModalidadesEnum {
    ONLINE = 1,
    PRESENCIAL = 2,
}

export const ModalidadesDetalhes = {
    [ModalidadesEnum.ONLINE]: {
        nome: "online",
        descricao: "Online",
    },
    [ModalidadesEnum.PRESENCIAL]: {
        nome: "presencial",
        descricao: "Presencial",
    },
}