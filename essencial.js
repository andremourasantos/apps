//↓↓ SCRIPTS PRIMORDIAIS
window.addEventListener('DOMContentLoaded', () => {
    /*REFERÊNCIA DE TEMA*/
    if(localStorage.getItem('temaDaPagina') != null){alterarTema(0)} else{localStorage.setItem('temaDaPagina', 'Claro')}
})

//↓↓ EVENTOS PÓS CARRAGAMENTO
window.addEventListener('load', ()=>{
    /*CHECA ACESSOS*/
    if(this.localStorage.getItem(`acessos${FERRAMENTA.nome}`) == null){this.localStorage.setItem(`acessos${FERRAMENTA.nome}`,1)}else{this.localStorage.setItem(`acessos${FERRAMENTA.nome}`, Number(this.localStorage.getItem(`acessos${FERRAMENTA.nome}`)) + 1)}

    /*CHECA VERSAO*/
    if(this.localStorage.getItem(`v${FERRAMENTA.nome}`) == null){this.localStorage.setItem(`v${FERRAMENTA.nome}`, FERRAMENTA.versao);abrirPopup('#popup_BoasVindas');setTimeout(() => {fecharPopup('#popup_BoasVindas')}, 2000);} else if(this.localStorage.getItem(`v${FERRAMENTA.nome}`) != FERRAMENTA.versao){this.localStorage.setItem(`v${FERRAMENTA.nome}`, FERRAMENTA.versao); abrirPopup('#popup_log_novidades');}
})

//↓↓ ESTILO DA PÁGINA
function alterarTema(interacao=0){
    let icone = document.querySelector("#alteraTemaPagina > i")    

    if(interacao===0){
        switch (localStorage.getItem('temaDaPagina')) {
            case 'Escuro':
                document.body.classList.add('modo_escuro'); icone.className = 'ph-moon-fill'; icone.style.transform = 'scaleX(-1)';
                break;
        
            default:
                document.body.classList.remove('modo_escuro'); icone.className = 'ph-sun-fill'; icone.style.transform = 'scaleX(1)';
                break;
        }
    } else {
        switch (localStorage.getItem('temaDaPagina')) {
            case 'Escuro':
                document.body.classList.remove('modo_escuro'); localStorage.setItem('temaDaPagina', 'Claro'); icone.className = 'ph-sun-fill'; icone.style.transform = 'scaleX(1)';
                break;
        
            default:
                document.body.classList.add('modo_escuro'); localStorage.setItem('temaDaPagina', 'Escuro'); icone.className = 'ph-moon-fill'; icone.style.transform = 'scaleX(-1)';
                break;
        }
    }
    
    switch(localStorage.getItem('temaDaPagina')){
        case 'Escuro':
            document.querySelectorAll('meta').forEach(meta => {if(meta.name === 'theme-color'){meta.content = '#333333'}})
            break;
        
        default:
            document.querySelectorAll('meta').forEach(meta => {if(meta.name === 'theme-color'){meta.content = '#FDFBEE'}})
            break;
    }
}

//↓↓ POPUPS
function abrirPopup(id){
    //Fecha todos os Popups anteriores (evitar erros)
    document.querySelectorAll('*[id^="popup_"]').forEach(popup => {popup.style.display = 'none'})

    //Aplica os estilos ao respectivo Popup
    setTimeout(() => {
        document.querySelector('html').style.overflow = 'hidden';
        document.querySelector('#container_popup').style.display = 'flex';
        document.querySelector(id).style.display = 'block';
    }, 125);

    //Atalho de teclado para fechar Popup
    window.addEventListener('keyup', tecla => {if(tecla.code === 'Escape'){fecharPopup(id)}})
}

function fecharPopup(id){
    document.querySelector(id).style.animation = 'popupDesaparecer 250ms ease-out';

    //Aplica os estilos ao respectivo Popup
    setTimeout(() => {
        document.querySelector(id).style.display = 'none';
        document.querySelector('#container_popup').style.display = 'none';
        document.querySelector('html').style.overflow = 'scroll'
        document.querySelector(id).style.animationName = 'popupAparecer'
    }, 250);
}