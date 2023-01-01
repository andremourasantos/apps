//↓↓ CONFIGURAÇÕES
let Ferramenta = {
    info: 'nome:Ferramentas de André;descricao:Aplicativos para facilitar o seu dia-a-dia.;versao:2.5;temaDaPagina:Claro;',
    PUAU: 'acessibilidadeFonte:1;salvarDados:0;sincronizarTema:2;temaDoDispositivo:1;habilitarCookies:0',
}

//↓↓ ACIONADORES
document.querySelector('#pularParaFerramentas').addEventListener('click', ()=>{document.querySelector('#ferramentas').scrollIntoView()})