//↓↓ ACIONADORES
window.addEventListener('load', function(){
    document.querySelector('#numero_telefone').focus()
    document.querySelector("#gerar_QRCode").addEventListener('click', LinkdeWhatsApp.Acoes.gerarQRCode)
    document.querySelector("#copiar_link_btn").addEventListener('click', LinkdeWhatsApp.Acoes.copiar)

    LinkdeWhatsApp.Acoes.inserirDadosSalvos()
})

//↓↓ FERRAMENTA
let LinkdeWhatsApp = {
    pais: '55',
    ddd: '',
    dddsBrasil: [11,12,13,14,15,16,17,18,19,21,22,24,27,28,31,32,33,34,35,37,38,41,42,43,44,45,46,47,48,49,51,53,54,55,61,62,63,64,65,66,67,68,69,71,73,74,75,77,79,81,82,83,84,85,86,87,88,89,91,92,93,94,95,96,97,98,99],
    telefone: '',
    mensagem: '',
    gerarlink: function (){this.link = `https://api.whatsapp.com/send/?phone=${this.pais+this.ddd+this.telefone}&text=${encodeURIComponent(this.mensagem)}`},
    link: '',
    Acoes: {
        salvar: async () => {
            switch ((await PUAU.conferir('salvarDados')) >= 2) {
            case true:
                const id = (await Dados.conferirFerramenta()).id
                const telefone = entradaTelefone.value
                const mensagem = encodeURIComponent(LinkdeWhatsApp.mensagem)
                const dadosSalvos = `telefone=${telefone}&mensagem=${mensagem}`

                if(await Dados.conferirDadosLocais('dadosSalvos') == null){
                    localStorage.setItem(`info_${id}`, localStorage.getItem(`info_${id}`) + ';dadosSalvos:' + dadosSalvos)
                } else {
                    await Dados.conferirDadosLocais('dadosSalvos', dadosSalvos)
                }
                break;
        
            default:
                if(await Dados.conferirDadosLocais('dadosSalvos') != null){await Dados.conferirDadosLocais('dadosSalvos', '')}
                break;
        }
        },
        inserirDadosSalvos: async () => {
            switch ((await PUAU.conferir('salvarDados')) >= 2) {
                case true:
                    switch ((await Dados.conferirDadosLocais('dadosSalvos')) != null) {
                        case true:
                            const dadosSalvos = (await Dados.conferirDadosLocais('dadosSalvos')).split('&').map(dado => {return dado.split('=')})

                            entradaTelefone.value = dadosSalvos[0][1]
                            entradaMensagem.value = decodeURIComponent(dadosSalvos[1][1])
                            break;
                    
                        default:
                            break;
                    }
                    break;
            
                default:
                    break;
            }
        },
        copiar: () => {
            //ÍCONES
            botao = document.querySelector("#copiar_link_btn > i")
            const Icones = {
                copiar: 'ph-clipboard-text-fill',
                copiado: 'ph-check-bold',
                erro: 'ph-x-bold',
                novo: ''
            }
    
            try {
                navigator.clipboard.writeText(LinkdeWhatsApp.link)
                Icones.novo = Icones.copiado
            } catch (erro) {
                Icones.novo = Icones.erro
                exibirErro('copiarTxt')
            }
            
            botao.classList = Icones.novo
            setTimeout(() => {
                botao.classList = Icones.copiar
            }, 1500);
        },
        gerarQRCode: () => {
            window.open(`/gerador-de-qrcode/index.html?url=${encodeURIComponent(LinkdeWhatsApp.link)}`,'_blank')
        }
    }
}
    //↓↓ ENTRADAS & BOTÕES
    let entradaTelefone = document.querySelector('#numero_telefone')
    let entradaMensagem = document.querySelector('#mensagem')
    let botaoGerarLink = document.querySelector('#obter_link_btn')
    let saida = document.querySelector('#saida_link')

    //↓↓ EVENTOS
    botaoGerarLink.addEventListener('click',verificarEntradas)
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
        Popups.abrir('popup_noti_link_sucesso')
        setTimeout(()=>{
            //Aplica estilos ao respectivo Popup
        try {
            document.querySelector('#popup_noti_link_sucesso').style.animation = 'popupDesaparecer 250ms ease-out';
        } catch (error) {
            document.querySelector('#container_popup').style.display = 'none';
            document.querySelector('html').style.overflow = 'scroll'
            return;
        }
    
        //Fecha o popup
        setTimeout(() => {
            document.querySelector('#popup_noti_link_sucesso').style.display = 'none';
            document.querySelector('#container_popup').style.display = 'none';
            document.querySelector('html').style.overflow = 'scroll'
            document.querySelector('#popup_noti_link_sucesso').style.animationName = 'popupAparecer'
        }, 250);
        },1500)

        saida.style.display = 'flex'
        document.querySelectorAll('#ferramenta button.btn_menu_icone').forEach(btn => btn.style.display = 'block')
        document.querySelector('#link_gerado').value = LinkdeWhatsApp.link
        document.querySelector('#obter_link_btn').innerText = 'Gerar novo'

        document.querySelector('#ferramenta_entrada_telefone').style.display = 'none'
        document.querySelector('#ferramenta_entrada_mensagem').style.display = 'none'

        botaoGerarLink.addEventListener('click', gerarNovoLink)

        LinkdeWhatsApp.Acoes.salvar()
    }

    //↓↓ GERAR NOVO LINK
    function gerarNovoLink(){
        saida.style.display = 'none'
        document.querySelectorAll('#ferramenta button.btn_menu_icone').forEach(btn => btn.style.display = 'none')

        document.querySelector('#ferramenta_entrada_telefone').style.display = 'flex'
        document.querySelector('#ferramenta_entrada_mensagem').style.display = 'flex'
        entradaTelefone.value = ''
        entradaMensagem.value = ''

        document.querySelector('#obter_link_btn').innerText = 'Obter link'
        botaoGerarLink.removeEventListener('click', gerarNovoLink)
        botaoGerarLink.addEventListener('click',verificarEntradas)
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
            texto = 'Insira um número de telefone.'
            break;
        
        case 'ddd':
            texto = 'Confira o DDD digitado e tente novamente.'
            break;

        case 'telefone':
            texto = 'Parece que você não digitou um número de telefone válido.'
            break;

        case 'copiarTxt':
            texto = 'Não foi possível copiar para área de transferência.'
            break;

        default:
            texto = 'Por favor, recarregue a página.'
            break;
    }

    //Exibir popup
    popupTexto.innerText = texto
    Popups.abrir('popup_noti_erro')
}