//↓↓ CONFIGURAÇÕES
let Ferramenta = {
    nome: 'Inicial',
    info: 'versao:2.2;temaDaPagina:Claro;',
    PUAU: 'salvarDados:0;sincronizarTema:0;habilitarCookies:0',
    temaDaPagina: null
}

//↓↓ ACIONADORES
document.querySelector('#pularParaFerramentas').addEventListener('click', ()=>{document.querySelector('#ferramentas').scrollIntoView()})