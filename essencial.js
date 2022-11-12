//↓↓ SCRIPTS PRIMORDIAIS
window.addEventListener('DOMContentLoaded', async () => {
    //CONFERIR ARMAZENAMENTO LOCAL
    if(localStorage.getItem(`info${Ferramenta.nome}`) == null){}else{localStorage.clear()}
    if(localStorage.getItem(`info_${Ferramenta.nome}`) == null){localStorage.setItem(`info_${Ferramenta.nome}`, Ferramenta.info)}

    /*REFERÊNCIA DE TEMA*/
    if(Number(conferirPUAU('sincronizarTema')) >=2){
        if(localStorage.getItem('temaDaPagina') != null){pegarDadosLocais('temaDaPagina', localStorage.getItem('temaDaPagina')); alterarTema(0)}
    } else{if(pegarDadosLocais('temaDaPagina') != null){alterarTema(0)}}

    //CARREGAR ARQUIVOS
    const rodape = document.querySelector('footer')
    const popups = document.querySelector('#container_popup')

    importarRodape = async () => {
        try {
            const res = await fetch('/pedaco/footer.html');
            if(res.status != 200){throw new Error(res.status)}
            rodape.innerHTML = (await res.text()).toString()
        } catch (erro) {
            console.log(erro)
        }
    }; importarRodape();

    importarPUAU = async () => {
        try {
            const res = await fetch('/pedaco/puau.html');
            if(res.status != 200){throw new Error(res.status)}
            popups.innerHTML += (await res.text()).toString();autoAjustePUAU();
        } catch (erro) {
            console.log(erro)

            //>>TROCAR PARA FETCH POR URL NA VERSÃO FINAL.
            const resErro = await fetch('/pedaco/erro_fetch.html')
            popups.innerHTML += (await resErro.text()).toString()
            trocarOnClickAcionador('icone_Ajustes', 'popup_erroFetch')
        }
    }; importarPUAU();
})

//↓↓ EVENTOS PÓS CARRAGAMENTO
window.addEventListener('load', ()=>{
    /*CHECA VERSAO*/
    if(pegarDadosLocais('versao') != pegarDadosFerramenta('versao')){
        //EXIBIR POPUP NOVIDADES
        abrirPopup('popup_log_novidades')

        //ATUALIZAR ARMAZENAMENTO LOCAL
        pegarDadosLocais('versao', pegarDadosFerramenta('versao'))

        //ATUALIZAR O PUAU
        if(localStorage.getItem(`puau_${Ferramenta.nome}`) != null){
            const antigoPUAU = localStorage.getItem(`puau_${Ferramenta.nome}`).split(';').map(item => {return item.split(':')});

            const novoPUAU = Ferramenta.PUAU.split(';').map(item => {return item.split(':')});

            //verifica e mantém as configurações do usuário, mesmo com a atualização do painel.
            novoPUAU.forEach(item => {
                if(item[0] === antigoPUAU[i][0]){
                    if(item[1] != '0' && item[1] != '3'){item[1] = antigoPUAU[i][1]}
                }
                i++;
            });
            localStorage.setItem(`puau_${Ferramenta.nome}`, novoPUAU.join(';').replaceAll(',', ':'))
        } else {}
    }
})

//↓↓ SCRIPTS DE IMPORTAÇÃO


//↓↓ AUTO AJUSTE DO PUAU
function autoAjustePUAU(){
    //AJUSTAR TOGGLES
    document.querySelectorAll('#container_opcoes_PUAU input').forEach(opcao => {if(conferirPUAU(opcao.id) == 1){opcao.disabled = false} else if(conferirPUAU(opcao.id) == 2){opcao.disabled = false; opcao.checked = true;} else if(conferirPUAU(opcao.id) == 3){opcao.checked = true;};})

    //ACIONADORES
    document.querySelectorAll("#container_opcoes_PUAU > article.opcao_PUAU > div:nth-child(2) > input").forEach(opcao => document.querySelector(`#${opcao.id}`).addEventListener('click', ()=>{conferirPUAU(opcao.id, document.querySelector(`#${opcao.id}`).checked)}))
}

//↓↓ PAINEL UNIVERSAL DE AJUSTES DO USUÁRIO (PUAU)
function conferirPUAU(funcao, status=null) {
    let PUAU = ''

    if(localStorage.getItem(`puau_${Ferramenta.nome}`) != null && localStorage.getItem(`puau_${Ferramenta.nome}`).length == Ferramenta.PUAU.length
    ) {
        PUAU = localStorage.getItem(`puau_${Ferramenta.nome}`).split(';').map(item => {return item.split(':')})
    } else {
        PUAU = Ferramenta.PUAU.split(';').map(item => {return item.split(':')})
    }

    if(status != null){
        for(i=0;i<PUAU.length;i++){if(PUAU[i][0] == funcao){PUAU[i][1] = (status == true) ? 2 : 1; return localStorage.setItem(`puau_${Ferramenta.nome}`, PUAU.join(';').replaceAll(',',':'))}}
    }
    else {for(i=0;i<PUAU.length;i++){if(PUAU[i][0] == funcao){return PUAU[i][1]}}}

    return null;
}

//↓↓ ESTILO DA PÁGINA
function alterarTema(interacao=0){
    let icone = document.querySelector("#alteraTemaPagina > i")

    if(interacao===0){
        switch (pegarDadosLocais('temaDaPagina')) {
            case 'Escuro':
                document.body.classList.add('modo_escuro'); icone.className = 'ph-sun-fill'; icone.style.transform = 'scaleX(1)';
                if(Number(conferirPUAU('sincronizarTema')) >=2){localStorage.setItem('temaDaPagina', 'Escuro')}
                break;
        
            default:
                document.body.classList.remove('modo_escuro'); icone.className = 'ph-moon-fill'; icone.style.transform = 'scaleX(-1)';
                if(Number(conferirPUAU('sincronizarTema')) >=2){localStorage.setItem('temaDaPagina', 'Claro')}
                break;
        }
    } else {
        switch (pegarDadosLocais('temaDaPagina')) {
            case 'Escuro':
                document.body.classList.remove('modo_escuro'); pegarDadosLocais('temaDaPagina', 'Claro'); icone.className = 'ph-moon-fill'; icone.style.transform = 'scaleX(-1)';
                if(Number(conferirPUAU('sincronizarTema')) >=2){localStorage.setItem('temaDaPagina', 'Claro')}
                break;
        
            default:
                document.body.classList.add('modo_escuro'); pegarDadosLocais('temaDaPagina', 'Escuro'); icone.className = 'ph-sun-fill'; icone.style.transform = 'scaleX(1)';
                if(Number(conferirPUAU('sincronizarTema')) >=2){localStorage.setItem('temaDaPagina', 'Escuro')}
                break;
        }
    }
    
    switch(pegarDadosLocais('temaDaPagina')){
        case 'Escuro':
            document.querySelectorAll('meta').forEach(meta => {if(meta.name === 'theme-color'){meta.content = '#333333'}})
            break;
        
        default:
            document.querySelectorAll('meta').forEach(meta => {if(meta.name === 'theme-color'){meta.content = '#FDFBEE'}})
            break;
    }
}

//↓↓ CHAMAR FETCH DE ERRO
//Não funciona por algum motivo...
async function chamarPopupErroFetch(){
    const res = await fetch('/pedaco/erro_fetch.html')
    return (await res.text()).toString()
}

//↓↓ ALTERA ATRIBUTO ONCLICK
function trocarOnClickAcionador(acionador, novoID) {
    const elemento = document.querySelector(`#${acionador}`)
    elemento.setAttribute('onclick', `abrirPopup('${novoID}')`)
}

//↓↓ POPUPS
function abrirPopup(id){
    id = `#${id}`

    //Fecha todos os Popups anteriores (evitar erros)
    document.querySelectorAll('*[id^="popup_"]').forEach(popup => {popup.style.display = 'none'})

    //Aplica os estilos ao respectivo Popup
    setTimeout(() => {
        document.querySelector('html').style.overflow = 'hidden';
        document.querySelector('#container_popup').style.display = 'flex';
        document.querySelector(id).style.display = 'block';
        document.querySelector(id).scrollTo(0,0)
    }, 125);

    //Atalho de teclado para fechar Popup
    window.addEventListener('keyup', tecla => {if(tecla.code === 'Escape'){fecharPopup(id.substring(1))}})
}

function fecharPopup(id){
    id = `#${id}`

    //Aplica estilos ao respectivo Popup
    document.querySelector(id).style.animation = 'popupDesaparecer 250ms ease-out';

    //Fecha o popup
    setTimeout(() => {
        document.querySelector(id).style.display = 'none';
        document.querySelector('#container_popup').style.display = 'none';
        document.querySelector('html').style.overflow = 'scroll'
        document.querySelector(id).style.animationName = 'popupAparecer'
    }, 250);
}

//↓↓ PEGAR DADOS DA FERRAMENTA
function pegarDadosFerramenta(item) {
    const itens = Ferramenta.info.split(';').map(item => {return item.split(':')})

    for(i=0;i<itens.length;i++){
        if(itens[i][0] == item){return itens[i][1]}
    }

    return null
}

//↓↓ PEGAR E ALTERAR DADOS LOCAIS
function pegarDadosLocais(item, valor=null) {
    const info = localStorage.getItem(`info_${Ferramenta.nome}`).split(';').map(item => {return item.split(':')})

    if(valor!=null) {
        for(i=0;i<info.length;i++){if(info[i][0] == item){info[i][1] = valor; Ferramenta.info = info.join(';').replaceAll(',',':'); return window.localStorage.setItem(`info_${Ferramenta.nome}`, Ferramenta.info)}}
    } else {
        for(i=0;i<info.length;i++){if(info[i][0] == item){return info[i][1]}}
    }
    return null;
}

//↓↓ ABRIR LINK
function abrirLink(link,delay=0,alvo='_blank'){setTimeout(()=>{window.open(`https://${link}`, `${alvo}`)},delay)}