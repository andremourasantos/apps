//↓↓ CONFIGURAÇÕES
let Ferramenta = {
    nome: 'Inicial',
    info: 'versao:2.5;temaDaPagina:Claro;',
    PUAU: 'acessibilidadeFonte:1;salvarDados:0;sincronizarTema:2;temaDoDispositivo:2;habilitarCookies:0'
}

//↓↓ ACIONADORES
document.querySelector('#pularParaFerramentas').addEventListener('click', ()=>{document.querySelector('#ferramentas').scrollIntoView()})