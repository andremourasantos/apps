//↓↓ INFO DA FERRAMENTA
let Ferramenta = {
    nome: 'link-de-whatsapp',
    info: 'versao:2.1;temaDaPagina:Claro;dadosSalvos:telefone==',
    PUAU: 'salvarDados:2;sincronizarTema:2;habilitarCookies:0',
    temaDaPagina: null
}

//↓↓ ACIONADORES
document.querySelector('#alteraTemaPagina').addEventListener('click', ()=>{alterarTema(1)})

document.querySelector('#icone_Ajustes').addEventListener('click', ()=>{abrirPopup('popup_puau')})

document.querySelector('#icone_Info').addEventListener('click', ()=>{abrirPopup('popup_sobre')})

window.addEventListener('load', function(){
    document.querySelector('#numero_telefone').focus()
})

//↓↓ FERRAMENTA
let LinkdeWhatsApp = {
    pais: '55',
    ddd: '',
    dddsBrasil: [11,12,13,14,15,16,17,18,19,21,22,24,27,28,31,32,33,34,35,37,38,41,42,43,44,45,46,47,48,49,51,53,54,55,61,62,63,64,65,66,67,68,69,71,73,74,75,77,79,81,82,83,84,85,86,87,88,89,91,92,93,94,95,96,97,98,99],
    telefone: '',
    mensagem: '',
    salvar: ()=>{if(conferirPUAU('salvarDados') === '2'){} else {exibirErro('salvarDados')}},
    gerarlink: function (){this.link = `https://api.whatsapp.com/send/?phone=${this.pais+this.ddd+this.telefone}&text=${encodeURI(this.mensagem)}`},
    link: ''
}
    //↓↓ ENTRADAS & BOTÕES
    let entradaTelefone = document.querySelector('#numero_telefone')
    let entradaMensagem = document.querySelector('#mensagem')
    let botaoGerarLink = document.querySelector('#obter_link_btn')
    let saida = document.querySelector('#saida_link')

    //↓↓ EVENTOS
    botaoGerarLink.addEventListener('click',verificarEntradas)
    window.addEventListener('load', ()=>{
        if(Number(conferirPUAU('salvarDados')) >= 2){
            let dadosBrutos = pegarDadosLocais('dadosSalvos').split('||')
            let dados = dadosBrutos.map(item => item.split('=='))
                //dados[0] = telefone
                //dados[1] = mensagem
                //dados[n][1] = conteúdo

            entradaTelefone.value = dados[0][1]
        }
    })
    entradaTelefone.addEventListener('keyup', tecla => estilizarEntradaTelefone(tecla))
    entradaTelefone.addEventListener('keydown', tecla => estilizarEntradaTelefone(tecla))

    //↓↓ ATALHOS DE TECLADO
    document.querySelector('#numero_telefone').addEventListener('keyup', tecla => {tecla.code === 'Enter' ? document.querySelector('#mensagem').focus() : ''})
    document.querySelector('#mensagem').addEventListener('keyup', tecla => {tecla.code === 'Enter' ? document.querySelector('#obter_link_btn').click() : ''})

    //↓↓ ESTILIZAÇÃO DA ENTRADA DE TELEFONE
    function estilizarEntradaTelefone(tecla){
        let entrada = entradaTelefone
        let comprimento = entrada.value.length
        if(tecla.code === 'Backspace'){} else{
            if(comprimento>1){if(entrada.value.includes('(')){} else{entrada.value = `(${entrada.value}`}}
            if(comprimento==3){if(entrada.value.includes(')')){} else{entrada.value = `${entrada.value}) `}}
            if(comprimento>9){if(entrada.value.includes('-')){} else{entrada.value = `${entrada.value}-`}}
            if(comprimento>14){entrada.value = entrada.value.substr(0, 15)}
        }
    }

    //↓↓ CHECAGEM DE ENTRADAS
    function verificarEntradas(){
        LinkdeWhatsApp.ddd = entradaTelefone.value.replaceAll(/[^a-z0-9+]/g,'').substr(0,2)
        LinkdeWhatsApp.telefone = entradaTelefone.value.replaceAll(/[^a-z0-9+]/g,'').substr(2,entradaTelefone.value.length)
        LinkdeWhatsApp.mensagem = document.querySelector('#mensagem').value
    
        if(entradaTelefone.value === ''){exibirErro('campoVazio')}
        else if(LinkdeWhatsApp.dddsBrasil.indexOf(Number(LinkdeWhatsApp.ddd)) == -1){exibirErro('ddd')}
        else if(LinkdeWhatsApp.telefone.length >=8 && LinkdeWhatsApp.telefone.length <=9){LinkdeWhatsApp.gerarlink(); botaoGerarLink.removeEventListener('click', verificarEntradas); exibirLink();} else {exibirErro('telefone')}
    }

    //↓↓ EXIBIR LINK
    function exibirLink(){
        abrirPopup('popup_noti_link_sucesso')
        setTimeout(()=>{fecharPopup('popup_noti_link_sucesso')},1500)

        saida.style.display = 'flex'
        document.querySelector('#copiar_link_btn').style.display = 'block'
        document.querySelector('#link_gerado').value = LinkdeWhatsApp.link
        document.querySelector('#obter_link_btn').innerText = 'Gerar novo'

        document.querySelector('#ferramenta_entrada_telefone').style.display = 'none'
        document.querySelector('#ferramenta_entrada_mensagem').style.display = 'none'

        botaoGerarLink.addEventListener('click', gerarNovoLink)

        salvarDados()
    }

    //↓↓ GERAR NOVO LINK
    function gerarNovoLink(){
        saida.style.display = 'none'
        document.querySelector('#copiar_link_btn').style.display = 'none'

        document.querySelector('#ferramenta_entrada_telefone').style.display = 'flex'
        document.querySelector('#ferramenta_entrada_mensagem').style.display = 'flex'
        entradaTelefone.value = ''

        document.querySelector('#obter_link_btn').innerText = 'Obter link'
        botaoGerarLink.removeEventListener('click', gerarNovoLink)
        botaoGerarLink.addEventListener('click',verificarEntradas)
    }

    //↓↓ COPIAR LINK
    function copiarLink(){
        botao = document.querySelector('#copiar_link_btn')
        icone = document.querySelector('#copiar_link_btn > i')
        iconeCopiar = 'ph-clipboard-text-fill'
        iconeVerificado = 'ph-check-fill'

        navigator.clipboard.writeText(LinkdeWhatsApp.link)
        setTimeout(()=>{
            icone.classList.remove(iconeCopiar)
            icone.classList.add(iconeVerificado)
        },125)

        setTimeout(()=>{
            icone.classList.remove(iconeVerificado)
            icone.classList.add(iconeCopiar)
        },1500)
    }

    //↓↓ SALVAR DADOS
    function salvarDados(){
        if(Number(conferirPUAU('salvarDados')) >= 2){
            let dadosBrutos = pegarDadosLocais('dadosSalvos').split('||')
            let dados = dadosBrutos.map(item => item.split('=='))
                //dados[0] = telefone
                //dados[1] = mensagem
                //dados[n][1] = conteúdo

            dados[0][1] = entradaTelefone.value

            pegarDadosLocais('dadosSalvos', dados.join('').replace(',', '=='))
        } else{pegarDadosLocais('dadosSalvos', 'telefone==')}
    }

//↓↓ POPUPS
function exibirErro(tipo=null){
    //Elementos do popup
    const POPUP = document.querySelector('#popup_noti_erro')
    const popupTitulo = document.querySelector('#popup_noti_erro > div > h3')
    const popupTexto = document.querySelector('#popup_noti_erro > div > p')
    let titulo = ''
    let texto = ''

    //Mensagens de erro
    switch (tipo.toString()) {
        case 'campoVazio':
            texto = 'É preciso pelo menos menos do número de telefone para continuar.'
            break;
        
        case 'ddd':
            texto = 'Confira o DDD digitado e tente novamente.'
            break;

        case 'telefone':
            texto = 'Parece que você não digitou um número de telefone válido.'
            break;

        default:
            texto = 'Por favor, recarregue a página.'
            break;
    }

    //Exibir popup
    popupTexto.innerText = texto
    abrirPopup('popup_noti_erro')
    setTimeout(()=>{fecharPopup('popup_noti_erro')},2500)
}