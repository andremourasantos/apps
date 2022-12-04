//↓↓ CONFIGURAÇÕES
let Ferramenta = {
    nome: 'Inicial',
    info: 'nome:Ferramentas de André;descricao:Aplicativos para facilitar o seu dia-a-dia.;versao:2.5;temaDaPagina:Claro;',
    PUAU: 'acessibilidadeFonte:1;salvarDados:0;sincronizarTema:2;temaDoDispositivo:1;habilitarCookies:0',
    Info: {
        nome: 'Ferramentas de André',
        descricao: 'Aplicativos para facilitar o seu dia-a-dia.',
        sobre: `Nesta página você poderá ver todos os projetos que desenvolvi para aprimorar minhas habilidades com o desenvolvimento web. Todas as ferrametnas são de livre acesso e sem anúncios.`,
        novidades: [
            ['Acessibilidade','Você agora pode selecionar uma fonte para facilitar a leitura da tela no Painel Universal de Ajustes do Usuário.'],
            ['Tema da página sincronizado','Agora, o tema que você escolher para esta página será sincronizado com todas as outras ferramentas que suportam essa função.']
        ]
    }
}

//↓↓ ACIONADORES
document.querySelector('#pularParaFerramentas').addEventListener('click', ()=>{document.querySelector('#ferramentas').scrollIntoView()})