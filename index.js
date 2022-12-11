//↓↓ CONFIGURAÇÕES
let Ferramenta = {
    nome: 'Inicial',
    info: 'nome:Ferramentas de André;descricao:Aplicativos para facilitar o seu dia-a-dia.;versao:2.5;temaDaPagina:Claro;',
    PUAU: 'acessibilidadeFonte:1;salvarDados:0;sincronizarTema:2;temaDoDispositivo:1;habilitarCookies:0',
    Info: {
        nome: 'Ferramentas de André',
        descricao: 'Aplicativos para facilitar o seu dia-a-dia.',
        sobre: `Nesta página você poderá ver todos os projetos que desenvolvi para aprimorar minhas habilidades com o desenvolvimento web. Todas as ferrametnas são de livre acesso e sem anúncios.`,
        novidades: []
    }
}

//↓↓ ACIONADORES
document.querySelector('#pularParaFerramentas').addEventListener('click', ()=>{document.querySelector('#ferramentas').scrollIntoView()})