import { Contato } from "./ContatoInterface";
import { Endereco } from "./EnderecoInterface";
import { Igreja } from "./IgrejaInterface";
import { Parentes } from "./ParentesInterface";

export interface Membro {
    id: number,
    nome: string,
    identidade?: string,
    dataNascimento?: string,
    dataCadastro?: string,
    estadoCivil?: string,
    sexo?: string,
    profissao?: string,
    ativo?: boolean,
    contato: Contato,
    endereco: Endereco,
    igreja: Igreja,
    parentes: Parentes
}