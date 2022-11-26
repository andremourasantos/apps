//↓↓ EVENTOS PRIMORDIAIS
window.addEventListener('load', ()=>{
    ajustarAlturaFerramenta()
    document.querySelector('#requisicao').focus()
    setTimeout(() => {
        QRCode.ParametrosURL.obter()
    }, 1000);
})

//↓↓ CONFIGURAÇÕES
let Ferramenta = {
    nome: 'gerador-de-qrcode',
    info: 'versao:1.3;temaDaPagina:Claro;',
    PUAU: 'acessibilidadeFonte:1;salvarDados:0;sincronizarTema:2;temaDoDispositivo:1;habilitarCookies:0',
}
let QRCode = {
    gerarURL: ()=>{return QRCode.api + QRCode.requisicao},
    api: 'https://chart.googleapis.com/chart?chs=256x256&cht=qr&chl=',
    requisicao: 'https://apps.andremourasantos.com',
    ParametrosURL: {
        obter: ()=>{
            if(window.location.href.includes('?')){
                let parametrosURL = window.location.href.split('?')[1].split('&').map(parm => {return parm.split('=')})

                for(parm of parametrosURL){if(parm[i] === 'url'){requisicao.value = parm[1]; btnacao.click(); break;}}
            }
        }
    },
    saida: document.querySelector('#QRCode')
}

let btnacao = document.querySelector('#criarQRCode')
let requisicao = document.querySelector('#requisicao')
let saida = document.querySelector("#ferramenta > section:nth-child(3)")

//↓↓ ACIONADORES
btnacao.addEventListener('click', checarEntradas);
requisicao.addEventListener('keyup', (key)=>{key.key === 'Enter' ? btnacao.click() : ''})


//↓↓ FUNÇÕES
function checarEntradas() {
    setTimeout(()=>{if(document.querySelector('#requisicao').value != ''){QRCode.requisicao = requisicao.value; gerarQRCode()} else {abrirPopupErro()}}, 250)
}

function abrirPopupErro() {
    abrirPopup('popup_erro'); setTimeout(() => {
        fecharPopup('popup_erro')
    }, 2000);
}

function gerarQRCode() {
    //Elementos
    let entradas = document.querySelectorAll("#ferramenta > section:nth-child(1), #ferramenta > section:nth-child(2)")
    let acoesExtras = document.querySelector('#opcoesFerramentaSaida')

    //Estilos
    entradas.forEach(item => {item.style.display = 'none'})
    saida.style.display = 'flex'
    //acoesExtras.style.display = 'flex'

    //Ações
    QRCode.saida.src = QRCode.gerarURL()
    btnacao.removeEventListener('click', checarEntradas)
    btnacao.addEventListener('click', recriarQRCode)
    requisicao.value = ''
    btnacao.innerText = 'Criar novo'
}

function recriarQRCode() {
    //Elementos
    let entradas = document.querySelector("#ferramenta > section:nth-child(2)")
    let acoesExtras = document.querySelector('#opcoesFerramentaSaida')

    //Estilos
    saida.style.display = 'none'
    acoesExtras.style.display = 'none'
    entradas.style.display = 'flex'

    //Ações
    requisicao.focus()
    btnacao.removeEventListener('click', recriarQRCode)
    btnacao.addEventListener('click', checarEntradas)
    btnacao.innerText = 'Criar QRCode' 
}

//↓↓ CÓDIGO DE ESTILIZAÇÃO TEMPORÁRIO
/* CÓDIGO DE ESTILIZAÇÃO TEMPORÁRIO
    Esse código será adaptado e utilizado para determinar a altura dos elementos em todas as outras páginas de ferramenta em uma futura atualização. As ferramentas perderão a coluna #informacoes e ficarão apenas com a #ferramenta. As informações importantes sobre a ferramenta serão movidas para o #popup_sobre.
*/
window.addEventListener('resize', ()=>{ajustarAlturaFerramenta()})
function ajustarAlturaFerramenta(){
    let Alturas = {
        dispositivo: window.innerHeight,
        cabecalho: document.querySelector('header').clientHeight,
        rodape: document.querySelector('footer').clientHeight
    }
    if(Alturas.dispositivo < 500){return}

    document.querySelector('main > *').style.height = `calc(${Alturas.dispositivo}px - ${Alturas.cabecalho}px - ${Alturas.rodape}px)`
}