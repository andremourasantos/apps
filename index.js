//↓↓ CONFIGURAÇÕES
let Ferramenta = {
    nome: 'Inicial',
    info: 'versao:2.4;temaDaPagina:Claro;',
    PUAU: 'salvarDados:0;sincronizarTema:2;habilitarCookies:0',
}

//↓↓ ACIONADORES
document.querySelector('#pularParaFerramentas').addEventListener('click', ()=>{document.querySelector('#ferramentas').scrollIntoView()})