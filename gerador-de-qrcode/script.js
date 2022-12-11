//↓↓ EVENTOS PRIMORDIAIS
window.addEventListener('load', ()=>{
    document.querySelector('#requisicao').focus()
    setTimeout(() => {
        QRCode.ParametrosURL.obter()
    }, 1000);
})

//↓↓ CONFIGURAÇÕES
let Ferramenta = {
    nome: 'gerador-de-qrcode',
    info: 'nome:Gerador de QR Code;descricao:Crie QR Codes estáticos facilmente.;versao:1.3.1;temaDaPagina:Claro;',
    PUAU: 'acessibilidadeFonte:1;salvarDados:0;sincronizarTema:2;temaDoDispositivo:1;habilitarCookies:0',
    Info: {
        nome: 'Gerador de QR Code',
        descricao: 'Crie QR Codes estáticos facilmente.',
        sobre: `Este projeto utiliza a API do Google para criar QR Codes estáticos de validade ilimitada. Seu pedido é enviado e então o QR Code é gerado e exibido nesta página. Seu pedido não é salvo em nenhuma instância pela API do Google.`,
        novidades: [
            ['Acessibilidade','Você agora pode selecionar uma fonte para facilitar a leitura da tela no Painel Universal de Ajustes do Usuário.'],
            ['Parâmetros de URL','Agora você pode fazer requisições via parâmetros na URL da ferramenta! Confira o GitHub para mais informações.']
        ]
    }
}
let QRCode = {
    gerarURL: ()=>{return QRCode.api + QRCode.requisicao},
    api: 'https://chart.googleapis.com/chart?chs=256x256&cht=qr&chl=',
    requisicao: 'https://apps.andremourasantos.com',
    ParametrosURL: {
        obter: ()=>{
            if(window.location.href.includes('?')){
                let parametrosURL = window.location.href.split('?')[1].split('&').map(parm => {return parm.split('=')})

                for(parm of parametrosURL){if(parm[0] === 'url'){requisicao.value = parm[1]; btnacao.click(); break;}}
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