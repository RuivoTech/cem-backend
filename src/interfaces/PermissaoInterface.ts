export interface Permissao {
    id: number,
    chEsUsuario: string,
    chEsMenuPermissao: string,
    inserir: boolean,
    alterar: boolean,
    visualizar: boolean,
    remover: boolean
}