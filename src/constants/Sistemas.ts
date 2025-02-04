export enum SistemasEnum {
    DUNGEONS_AND_DRAGONS_5 = 1,
}

export const SistemasDetalhes: TSistemas = {
    [SistemasEnum.DUNGEONS_AND_DRAGONS_5]: {
        id: "dungeons-and-dragons-5",
        name: "Dungeons and Dragons 5e",
        descricao: "Dungeons and Dragons 5th edition",
        apelido: "dungeons-and-dragons-5",
        nivelMaximo: 20,
        nivelInicial: 1,
        imagem: "https://i.pinimg.com/736x/39/3c/7b/393c7bb31fbd7aae593b9b5e5f307d51.jpg"
    },
} as const;

export type TSistemaDetalhes = {
    id: string;
    name: string;
    descricao: string;
    apelido: string;
    nivelMaximo: number;
    nivelInicial: number;
    imagem: string;
};

export type TSistemas = Record<SistemasEnum, TSistemaDetalhes>;