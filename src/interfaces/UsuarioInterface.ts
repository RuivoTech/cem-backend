import { Permissao } from "./PermissaoInterface";

export interface Usuario {
    id: number,
    nomeUsuario: string,
    nome: string,
    email: string,
    nivel: number,
    senha: string,
    salt: string,
    permissao: Permissao[]
}