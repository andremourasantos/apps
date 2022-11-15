//↓↓ EVENTOS PRIMORDIAIS
window.addEventListener('load', ()=>{
    document.querySelector('#requisicao').focus()
})

//↓↓ CONFIGURAÇÕES
let Ferramenta = {
    nome: 'gerador-de-qrcode',
    info: 'versao:1.2;temaDaPagina:Claro;',
    PUAU: 'acessibilidadeFonte:1;salvarDados:0;sincronizarTema:2;temaDoDispositivo:2;habilitarCookies:0',
}
let QRCode = {
    url: ()=>{return QRCode.api + QRCode.requisicao},
    api: 'https://chart.googleapis.com/chart?chs=256x256&cht=qr&chl=',
    requisicao: 'https://apps.andremourasantos.com',
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
    setTimeout(()=>{if(document.querySelector('#requisicao').value != ''){QRCode.requisicao = requisicao.value; console.log(QRCode.requisicao); gerarQRCode()} else {abrirPopupErro()}}, 250)
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
    QRCode.saida.src = QRCode.url()
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