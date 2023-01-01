//↓↓ EVENTOS PRIMORDIAIS
window.addEventListener('load', ()=>{
    document.querySelector('#requisicao').focus()
    QRCode.ParametrosURL.obter()
})

//↓↓ CONFIGURAÇÕES
let QRCode = {
    gerarURL: (requisicao)=>{return 'https://chart.googleapis.com/chart?chs=512x512&cht=qr&chl=' + encodeURIComponent(requisicao)},
    checarEntradas: async () => {
        /**
         * 1. Checa se as informações inseridas pelo usuário no campos de requisição são válidas (no momento, apenas aceita URLs).
            * Em caso afirmativo, continua com a criação do QR Code.
            * Em caso negativo, cancela a operação e avisa o usuário sobre o a URL inválida.
         */

        setTimeout(async ()=>{
            try {
                new URL(requisicao.value)
                QRCode.criarQRCode()
                return
            } catch(erro) {
                console.log(erro)
                await importarPedacos('importarPopupErro')
                Popups.Minipopups.abrir('popup_noti_erro', 'URL inválida', 'Confira e tente novamente.')
                return
            }},250)
    },
    criarQRCode: () => {
        //Elementos
        let entradas = document.querySelectorAll("#ferramenta > section:nth-child(1), #ferramenta > section:nth-child(2)")

        //Estilos
        entradas.forEach(item => {item.style.display = 'none'})
        document.querySelectorAll('#ferramenta button.btn_menu_icone').forEach(btn => btn.style.display = 'block')
        saida.style.display = 'flex'

        //Ações
        QRCode.saida.src = QRCode.gerarURL(requisicao.value)
        requisicao.value = ''
        btnacao.removeEventListener('click', QRCode.checarEntradas)
        btnacao.addEventListener('click', QRCode.recriarQRCode)
        btnacao.innerText = 'Criar novo'
    },
    recriarQRCode: () => {
        //Elementos
        let entradas = document.querySelector("#ferramenta > section:nth-child(2)")

        //Estilos
        saida.style.display = 'none'
        document.querySelectorAll('#ferramenta button.btn_menu_icone').forEach(btn => btn.style.display = 'none')
        entradas.style.display = 'flex'

        //Ações
        requisicao.focus()
        btnacao.removeEventListener('click', QRCode.criarQRCode)
        btnacao.addEventListener('click', QRCode.checarEntradas)
        btnacao.innerText = 'Criar QRCode' 
    },
    ParametrosURL: {
        /**
         * OBS: Para utilliza o parâmetro `url` para criação de QR Codes, é necessário passar a URL pela função `encodeURIComponent`, caso contrário, a URL poderá não ser totalmente inserida na criação do QR Code.
         * 
         * 1. Checa se a URL contém algum parâmetro.
            * Em caso negativo, encerra o código.
         * 2. Divide a URL e cria um vetor de vetores com o nome e valor dos parãmetros.
         * 3. Checa pela existência do parâmetro `url` e, caso o encontre, define `requisicao.value` como o `decodeURIComponent` do seu valor e chama `QRCode.criarQRCode()`.
         */
        obter: ()=>{
            if(window.location.href.includes('?')){
                let parametrosURL = window.location.href.split('?')[1].split('&').map(parm => {return parm.split('=')})

                for(parm of parametrosURL){if(parm[0] === 'url'){requisicao.value = decodeURIComponent(parm[1]); QRCode.criarQRCode(); break;}}
            }
        }
    },
    Acoes: {
        baixar: async () => {
            try {
                //IMAGEM DO QR CODE
                const img = await fetch(QRCode.saida.src).then(res => res.blob())
            
                // CRIA UM OBJECTURL
                const objectURL = URL.createObjectURL(img);
                
                // CRIA O LINK DE DOWNLOAD
                const link = document.createElement('a');
                link.href = objectURL;
                link.download = 'QRCode';
                document.body.appendChild(link);
                link.click();
                
                // REMOVE O LINK E DELETA O OBJECTURL
                document.body.removeChild(link);
                URL.revokeObjectURL(objectURL);
            } catch (erro) {
                await importarPedacos('importarPopupErro')
                Popups.Minipopups.abrir('popup_noti_erro', 'Ocorreu um erro', 'Não foi possível baixar a imagem.')
                QRCode.botoes.baixar.disabled = true
                console.log(erro)
                return
            }
        },
        compartilhar: async () => {
            /**
             * 1. Usa a API Fetch para requisitar as informações da URL do QR Code e converte-as em blob.
             * 2. Cria a constante `imagem` cujo conteúdo é um objeto Arquivo com as informações do fetch.
             * 3. Chama a API de compartilhamento.
                * Em caso afirmativo, o processo de compartilhamento segue
                * Em caso negativo (sem suporte), o processo é encerrado, uma mensagem de erro é exibida ao usuário e o botão gatilho deste método é desabilitado.
             */

            const imagemBlob = await fetch(QRCode.saida.src).then(res => res.blob());
            const imagem = new File([imagemBlob], 'image.png', { type: 'image/png' });
            
            if (navigator.share) {
                navigator.share({
                files: [imagem],
                title: 'QR Code',
                text: 'Confira o QR Code que eu criei em https://apps.andremourasantos.com/gerador-de-qrcode'
                });
            } else {
                await importarPedacos('importarPopupErro')
                Popups.Minipopups.abrir('popup_noti_erro', 'Navegador sem suporte', 'Seu navegador atual não suporta essa função.')
                QRCode.botoes.compartilhar.disabled = true
                return
            }
        }
    },
    botoes: {
        baixar: document.querySelector('#baixarQRCode'),
        compartilhar: document.querySelector('#compartilharQRCode')
    },
    saida: document.querySelector('#QRCode')
}

let btnacao = document.querySelector('#criarQRCode')
let requisicao = document.querySelector('#requisicao')
let saida = document.querySelector("#ferramenta > section:nth-child(3)")

//↓↓ ACIONADORES
btnacao.addEventListener('click', QRCode.checarEntradas);
//requisicao.addEventListener('keyup', (key)=>{key.key === 'Enter' ? btnacao.click() : ''})
QRCode.botoes.baixar.addEventListener('click', QRCode.Acoes.baixar)
QRCode.botoes.compartilhar.addEventListener('click', QRCode.Acoes.compartilhar)