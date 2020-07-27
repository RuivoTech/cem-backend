export interface Permissao {
    id: number,
    chEsUsuario: string,
    menuPermissao: string,
    grupoMenuPermissao: string,
    chEsMenuPermissao: string,
    inserir: boolean,
    alterar: boolean,
    visualizar: boolean,
    remover: boolean
}