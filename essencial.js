//↓↓ SCRIPTS PRIMORDIAIS
window.addEventListener('DOMContentLoaded', async () => {
    //IMPORTA OS PEDAÇOS E EXECUTA TODOS OS CÓDIGOS REFERNTES AOS ELEMENTOS IMPORTADOS
    await importarPedacos();
    await PUAU.atualizar(); await PUAU.autoAjuste(); await PUAU.opcoes.acessibilidadeFonte();

    //CONFERIR ARMAZENAMENTO LOCAL
    if(localStorage.getItem(`info_${(await Dados.conferirFerramenta()).id}`) == null){
        const string = `id:${(await Dados.conferirFerramenta()).id};versao:${(await Dados.conferirFerramenta()).versao};temaDaPagina:Claro`

        localStorage.setItem(`info_${(await Dados.conferirFerramenta()).id}`, string)
    }

    //CHECAR VERSAO
    if(await Dados.conferirDadosLocais('versao') != (await Dados.conferirFerramenta()).versao){
        //EXIBIR POPUP NOVIDADES
        abrirPopup('popup_log_novidades')

        //ATUALIZAR ARMAZENAMENTO LOCAL
        await Dados.conferirDadosLocais('versao', (await Dados.conferirFerramenta()).versao)
    }
    switch ((await PUAU.conferir('temaDoDispositivo') >= 2)) {
        /**
         * Hierarquia do sistema: temaDoDispositivo > sincronizarTema
         * 
         * Caso a opção de 'temaDoDispositivo' esteja ativada, ela sobrepõe as configurações da opção de 'sincronizarTema', mas sem alterar o armazenamento local dela 'localStorage.setItem('temaDaPagina')'.
         * 
         * Deve ser possível obter dois casos distintos de uso: Uma página com a opção 'temaDoDispositivo' habilitada e no modo 'Escuro', por exemplo, enquanto outra página que não tem essa opção habilitada está com no modo 'Claro' e 'sincronizarTema' também está definido para o modo 'Claro'.
         */
        case true:
            window.matchMedia("(prefers-color-scheme: dark)").matches ? await Dados.conferirDadosLocais('temaDaPagina', 'Escuro') : await Dados.conferirDadosLocais('temaDaPagina', 'Claro')
            alterarTema(false)
            break;
    
        default:
            switch ((await PUAU.conferir('sincronizarTema') >= 2)) {
                case true:
                    if(localStorage.getItem('temaDaPagina') != null){await Dados.conferirDadosLocais('temaDaPagina', localStorage.getItem('temaDaPagina'))}
                    alterarTema(false)
                    break;
            
                default:
                    if(await Dados.conferirDadosLocais('temaDaPagina') != null){alterarTema(false)}
                    break;
            }
            break;
    }
})

//↓↓ EVENTOS PÓS CARRAGAMENTO
window.addEventListener('load', async ()=>{
    //ADICIONAR CÓDIGO DO PHOSPHORICONS
    /*O código foi retirado do 'head' do HTML por motivos de desempenho de carregamento.*/
    const scriptPhosphorIcons = () => {
        let elemento = document.createElement('script')
        elemento.setAttribute('src', 'https://unpkg.com/phosphor-icons')
        document.body.appendChild(elemento)
    }; scriptPhosphorIcons();

    //↓↓CENTRALIZAÇÃO DA FERRAMENTA
    const ajustarTamanhos = () => {
        const Altura = {
            tela: window.innerHeight,
            ferramenta: document.querySelector('#ferramenta').clientHeight,
            cabecalho: document.querySelector('header').clientHeight,
            rodape: document.querySelector('footer').clientHeight
        }

        if(Altura.tela < (Altura.cabecalho + Altura.ferramenta + Altura.rodape)){document.querySelector('#container_ferramenta').style.height = 'auto'; return}

        document.querySelector('#container_ferramenta').style.height = `calc(${Altura.tela - (Altura.cabecalho + Altura.rodape)}px)`
    }

    //↓↓ ACIONADORES
    try {
        const observadorDeDimensoes = new ResizeObserver(function(elementos){ajustarTamanhos()}); observadorDeDimensoes.observe(document.querySelector("#ferramenta"))

        window.addEventListener('resize', ()=>{ajustarTamanhos()})
    } catch (erro) {
        console.log(erro)
    }
})

//↓↓ SCRIPTS DE IMPORTAÇÃO
async function importarPedacos(pedaco){
    const rodape = document.querySelector('footer')
    const popups = document.querySelector('#container_popup')

    //PEDAÇOS DISPONÍVEIS PARA IMPORTAÇÃO
    const importarCabecalho = async () => {
        try {
            const res = await fetch('/pedaco/cabecalho.html')
            if(res.status =! 200){throw new Error(res.status)}
            document.querySelector('header').innerHTML = (await res.text()).toString()

            //Preenchimento das informações
            if((await fetch('logo.png')).status != 200){document.querySelector('header img').remove()}
            document.querySelector('header h1').innerText = await (await Dados.conferirFerramenta()).nome
            document.querySelector('header p').innerText = await (await Dados.conferirFerramenta()).descricao
        } catch (erro) {
            console.log(erro)
        }
    };

    const importarPUAU = async () => {
        try {
            const res = await fetch('/pedaco/popups/puau.html')
            if(res.status != 200){throw new Error(res.status)}
            popups.innerHTML += (await res.text()).toString()
        } catch (erro) {
            console.log(erro)
        }      
    };

    const importarInformacoesCookies = async () => {
        try {
            const res = await fetch('/pedaco/popups/informacoes_cookies.html');
            if(res.status != 200){throw new Error(res.status)}
            popups.innerHTML += (await res.text()).toString();
        } catch (erro) {
            console.log(erro)
        }
    };

    const importarPopupSobre = async () => {
        try {
            const res = await fetch('/pedaco/popups/sobre.html')
            if(res.status != 200){throw new Error(res.status)}
            popups.innerHTML += (await res.text()).toString()
            document.querySelector('#popup_sobre p:first-of-type').innerHTML = await (await Dados.conferirFerramenta()).sobre
        } catch (erro) {
            console.log(erro)
        }
    };

    const importarNovidades = async () => {
        try {
            const res = await fetch('/pedaco/popups/log_novidades.html')
            if(res.status != 200){throw new Error(res.status)}
            popups.innerHTML += (await res.text()).toString()

            const Info = await (await Dados.conferirFerramenta()).novidades
            const InfoGeral = await fetch('/ferramentas.json').then(res => res.json())

            for(obj of InfoGeral){
                if(obj.id === 'geral'){
                   obj.novidades.forEach(novidade => {Info.push(novidade)})
                }
            }

            Info.forEach(item => {
                const icone = document.createElement('i')
                const titulo = document.createElement('strong')
                const descricao = document.createElement('p')

                if(item[0] === 'Acessibilidade'){
                    icone.classList.add('ph-person-simple-bold')
                    titulo.classList.add('puau_acessibilidade')
                    titulo.appendChild(icone)
                }

                titulo.innerHTML += `${item[0]}:`
                descricao.appendChild(titulo)
                descricao.innerHTML += ` ${item[1].includes('Painel Universal de Ajustes do Usuário') ? item[1].replace('Painel Universal de Ajustes do Usuário', `<span class="interacao" onclick="abrirPopup('popup_puau')" title="Abrir Painel Universal de Ajustes do Usuário">Painel Universal de Ajustes do Usuário</span>`) : item[1]}`

                document.querySelector('#popup_log_novidades div:first-of-type').appendChild(descricao)
            })
        } catch (erro) {
            console.log(erro)
        }
    }

    const importarRodape = async () => {
        try {
            const res = await fetch('/pedaco/footer.html');
            if(res.status != 200){throw new Error(res.status)}
            rodape.innerHTML = (await res.text()).toString()
        } catch (erro) {
            console.log(erro)
        }
    };

    const importarPopupErroFetch = async () => {
        if(! document.querySelector('#popup_erroFetch')){
            try {
                const res = await fetch('/pedaco/minipopups/erro_fetch.html')
                if(res.status != 200){throw new Error(res.status)}
                popups.innerHTML += (await res.text()).toString()
            } catch (erro) {
                console.log(erro)
            }
        }
    };

    const importarPopupCompartilhar = async () => {
        try {
            const res = await fetch('/pedaco/popups/compartilhar.html')
            if(res.status != 200){throw new Error(res.status)}
            popups.innerHTML += (await res.text()).toString()

            const res2 = await fetch('/pedaco/minipopups/compartilhar.html')
            if(res.status != 200){throw new Error(res2.status)}
            popups.innerHTML += (await res2.text()).toString()
        } catch (erro) {console.log(erro)}
    };

    const importarPopupErro = async () => {
        if(! document.querySelector('#popup_noti_erro')){
            try {
                const res = await fetch('/pedaco/minipopups/erro.html')
                if(res.status != 200){throw new Error(res.status)}
                popups.innerHTML += (await res.text()).toString()
            } catch (erro) {console.log(erro)}
        }
    }

    switch (pedaco) {
        case 'importarCabecalho':
            await importarCabecalho();
            break;

        case 'importarPUAU':
            await importarPUAU();
            break;

        case 'importarPopupSobre':
            await importarPopupSobre();
            break;

        case 'importarNovidades':
            await importarNovidades();
            break;

        case 'importarInformacoesCookies':
            await importarInformacoesCookies();
            break;

        case 'importarRodape':
            await importarRodape();
            break;

        case 'importarPopupErroFetch':
            await importarPopupErroFetch();
            break;

        case 'importarPopupCompartilhar':
            await importarPopupCompartilhar();
            break;

        case 'importarPopupErro':
            await importarPopupErro();
            break;

        default:
            await importarCabecalho();
            await importarPUAU();
            await importarPopupSobre();
            await importarNovidades();
            await importarPopupErroFetch();
            await importarPopupCompartilhar();
            await importarRodape();
            break;
    }
}

//↓↓ PAINEL UNIVERSAL DE AJUSTES DO USUÁRIO (PUAU)
const PUAU = {
    atualizar: async () => {
        /**
         * @returns
         * 
         * 1. Confere se já existe algum ajutes do usuário salvo no armazenamento local.
            *Em caso afirmativo, transforma o valor do armazenamento local em um vetor separado de vetores que contém o nome da opcao e seu valor.
                    * Ex: [['acessibilidadeFonte','1'],['salvarDados','0'],['sincronizarTema','2']]
            * Em caso negativo, a função é encerrada.
         * 2. Verifica se os ajustes do novo PUAU contém alguma seção obrigatória que deve ser aplicada (cód. 0: obrigatóriamente desligado, cód. 3: obrigatóriamente ligado).
            * Em caso afirmativo, substituiu o valor do item do `antigoPUAU` pelo valor do `novoPUAU`.
            * Em caso negativo, nenhuma alteração é executada no `novoPUAU`.
        * 3. Descarta os códigos '0' e '3' caso eles venham do antigoPUAU, pois eles não representam uma ação de vontade do usuário, mas sim resultado das capacidades da ferramenta no passado.
        * 4. Salva o `novoPUAU` no armazenamento local.
         */
        const id = (await Dados.conferirFerramenta()).id
        const novoPUAU = Object.entries((await Dados.conferirFerramenta()).PUAU)

        if(localStorage.getItem(`puau_${id}`) != null){
            const antigoPUAU = localStorage.getItem(`puau_${id}`).split(';').map(item => {return item.split(':')});

            antigoPUAU.forEach(itemAntigo => {
                for(itemNovo of novoPUAU){
                    if(itemNovo[0] == itemAntigo[0]){if(itemAntigo[1] != '0' && itemAntigo[1] != '3' && itemNovo[1] != '0' && itemNovo[1] != '3'){itemNovo[1] = itemAntigo[1]}}
                }
            })
    
            return localStorage.setItem(`puau_${id}`, novoPUAU.join(';').replaceAll(',', ':'))
        } return;
    },
    autoAjuste: async () => {
        /**
         * 1. Seleciona todos os inputs em `#container_opcoes_PUAU input` e confere o id de cada um através da função `PUAU.conferir()`.
            * Caso 1: A opção está desligada por padrão, mas pode ser alterada pelo usuário.
            * Caso 2: A opção está ligada por padrão, mas pode ser alterada pelo usuário.
            * Caso 3: A opção está ligada por padrão e não pode ser alterada pelo usuário.
            * Padrão: A opções está desligada por padrão e não pode ser alterada pelo usuário.
        * 2. Após a configurações dos interruptores, é adicionado uma ação para atualizar o PUAU de acordo com as alterações do usuário, através da função `PUAU.conferir()`.
         */

        //AJUSTAR INTERRUPTORES
        document.querySelectorAll('#container_opcoes_PUAU input').forEach(async (opcao) => {
            switch (await PUAU.conferir(opcao.id)) {
                case 1:
                    opcao.disabled = false
                    break;

                case 2:
                    opcao.disabled = false
                    opcao.checked = true
                    break;

                case 3:
                    opcao.checked = true
                    break;
            
                default:
                    break;
            }
        })

        //ADICIONAR ACIONADORES
        document.querySelectorAll('#container_opcoes_PUAU input').forEach(async (opcao) => {
            opcao.addEventListener('click', ()=>{PUAU.conferir(opcao.id, opcao.checked)})
        })

        //ACIONADORES ESPECIAIS
        document.querySelector('#acessibilidadeFonte').addEventListener('click', await PUAU.opcoes.acessibilidadeFonte)
        
    },
    conferir: async (opcao, status=null) => {
         /**
          * @param {string} opcao - id da opção do PUAU.
          * @param {boolean} status - novo status a ser passado para a opção em questão.
          * @returns {number | string} - retorna um número ou "OK" em caso de execução bem sucedida e "NÃO ENCONTRADO" em caso de falha.
          * 
          * 1. A função confere se já existe algum ajuste do usuário (que fica salvo no armazenamento local).
                * Em caso afirmativo, transforma o valor do armazenamento local em um vetor separado de vetores que contém o nome da opcao e seu valor.
                    * Ex: [['acessibilidadeFonte','1'],['salvarDados','0'],['sincronizarTema','2']]
                * Em caso negativo, recupera as informações do PUAU da página e executa o mesmo processo comentado anteriormente (porém os números agora não são transformados em string).
                    * Ex: [['acessibilidadeFonte',1],['salvarDados',0],['sincronizarTema',2]]
          * 2. Após, a função confere se o parâmetro `opcao` existe no vetor `puau`.
                * Em caso afirmativo, continua a execução do código.
                * Em caso negativo, retorna "NÃO ENCONTRADO". 
          * 3. A função então checa se o parâmetro `status` foi passado.
                * Em caso afirmativo, atualiza o valor do parâmetro `opcao` e salva as alterações no `puau` no armazenamento local.
                * Em caso negativo, retorna o valor do parâmetro `opcao` em `puau`. 
          */
        
        const id = (await Dados.conferirFerramenta()).id

        if(localStorage.getItem(`puau_${id}`) != null){
            var puau = localStorage.getItem(`puau_${id}`).split(';').map(item => {return item.split(':')})
        } else {
            var puau = Object.entries((await Dados.conferirFerramenta()).PUAU)
        }

        if(puau.some(vetor => vetor[0]===opcao)){
            switch (status) {
                case null:
                    for(vetor of puau){if(vetor[0] === opcao){return Number(vetor[1])}}
            
                default:
                    for(vetor of puau){if(vetor[0] === opcao){vetor[1] = (status === true) ? 2 : 1}}
                    localStorage.setItem(`puau_${id}`, puau.join(';').replaceAll(',',':'))
                    return 'OK'
            }
        } else {return 'NÃO ENCONTRADO'}
    },
    opcoes: {
        acessibilidadeFonte: async () => {
            /**
             * 1. A funçção confere se a opção `acessibilidadeFonte` está atividada no PUAU.
                * Em caso afirmativo, a função altera as fontes do `:root` do `universal.css` para Atkinson Hyperlegible.
                * Em caso negativo, a função retorna as fontes para as definições padrão, sendo Ubuntu para `--texto_titulo` e Albert Sans para `--texto_geral`.
             */
            let cssRoot = document.querySelector(':root')
            await PUAU.conferir('acessibilidadeFonte') //Chama a função antes para dar tempo de carregar a alteração feita pelo usuário. Caso contrário, na primeira ativação, a fonte não seria alterada, apenas a partir da segunda em diante.
            switch ((await PUAU.conferir('acessibilidadeFonte')) >= 2) {
                case true:
                    cssRoot.style.setProperty('--texto_titulo', `'Atkinson Hyperlegible', monospace`)
                    cssRoot.style.setProperty('--texto_geral', `'Atkinson Hyperlegible', monospace`)
                    break;
            
                default:
                    cssRoot.style.setProperty('--texto_titulo', `'Ubuntu', sans-serif`)
                    cssRoot.style.setProperty('--texto_geral', `'Albert Sans', sans-serif`)
                    break;
            }
        },
    }
}

//↓↓ ESTILO DA PÁGINA
async function alterarTema(interacao=true){
    /**
     * @param {boolean} interacao - diz se a função está sendo executada pelo usuário ou pelas configurações automáticas do PUAU.
     * 
     * 1. A função confere se, através do parâmetro `interacao`, se foi está sendo executada pelo usuário ou pelas configurações automáticas do PUAU.
     * 2. Após, a função confere qual o tema da página, através da função `Dados.conferirDadosLocais()`, podendo ser tanto "Escuro" quanto "Claro".
     * 3. 
     * 4. A função altera a cor da guia do navegador.
     */
    let icone = document.querySelector("#alteraTemaPagina > i")

    if(interacao==false){
        switch (await Dados.conferirDadosLocais('temaDaPagina')) {
            case 'Escuro':
                document.body.classList.add('modo_escuro'); icone.className = 'ph-sun-fill'; icone.style.transform = 'scaleX(1)';

                //CONFERE HIERARQUIA DE TEMA DA PÁGINA
                Number(await PUAU.conferir('temaDoDispositivo')) >=2 ? '' : Number(await PUAU.conferir('sincronizarTema')) >=2 ? localStorage.setItem('temaDaPagina', 'Escuro') : ''
                break;
        
            default:
                document.body.classList.remove('modo_escuro'); icone.className = 'ph-moon-fill'; icone.style.transform = 'scaleX(-1)';

                //CONFERE HIERARQUIA DE TEMA DA PÁGINA
                Number(await PUAU.conferir('temaDoDispositivo')) >=2 ? '' : Number(await PUAU.conferir('sincronizarTema')) >=2 ? localStorage.setItem('temaDaPagina', 'Claro') : ''
                break;
        }
    } else {
        switch (await Dados.conferirDadosLocais('temaDaPagina')) {
            case 'Escuro':
                document.body.classList.remove('modo_escuro'); await Dados.conferirDadosLocais('temaDaPagina', 'Claro'); icone.className = 'ph-moon-fill'; icone.style.transform = 'scaleX(-1)';

                //CONFERE HIERARQUIA DE TEMA DA PÁGINA
                Number(await PUAU.conferir('temaDoDispositivo')) >=2 ? '' : Number(await PUAU.conferir('sincronizarTema')) >=2 ? localStorage.setItem('temaDaPagina', 'Claro') : ''
                break;
        
            default:
                document.body.classList.add('modo_escuro'); await Dados.conferirDadosLocais('temaDaPagina', 'Escuro'); icone.className = 'ph-sun-fill'; icone.style.transform = 'scaleX(1)';

                //CONFERE HIERARQUIA DE TEMA DA PÁGINA
                Number(await PUAU.conferir('temaDoDispositivo')) >=2 ? '' : Number(await PUAU.conferir('sincronizarTema')) >=2 ? localStorage.setItem('temaDaPagina', 'Escuro') : ''
                break;
        }
    }
    
    switch(await Dados.conferirDadosLocais('temaDaPagina')){
        case 'Escuro':
            document.querySelectorAll('meta').forEach(meta => {if(meta.name === 'theme-color'){meta.content = '#333333'}})
            break;
        
        default:
            document.querySelectorAll('meta').forEach(meta => {if(meta.name === 'theme-color'){meta.content = '#FDFBEE'}})
            break;
    }
}

//↓↓ POPUPS
//↓↓ OBJETOS DE AGREGAÇÃO
/*OBJETO POPUPS
  Esse objeto deve irá substituir as funções abrirPopup() e fecharPopup() em uma futura atualização.  
*/
const Popups = {
    abrir: id => {
        //Fecha todos os Popups anteriores (evitar erros)
        document.querySelectorAll('*[id^="popup_"]').forEach(popup => {
            popup.style.animation = 'popupDesaparecer 125ms ease-out';
            setTimeout(()=>{popup.style.display = 'none'; popup.style.animation = ''},125)
        })

        //Aplica os estilos ao respectivo Popup
        setTimeout(async () => {
            try {
                document.querySelector('html').style.overflow = 'hidden';
                document.querySelector('#container_popup').style.display = 'flex';
                document.querySelector(`#${id}`).style.display = 'block';
                document.querySelector(`#${id}`).scrollTo(0,0)
            } catch (erro) {
                try {
                    await importarPedacos('importarPopupErroFetch')
                    document.querySelector('#popup_erroFetch').style.display = 'block';
                } catch (erro) {
                    alert(`Ocorreu um erro e não foi possível resgatar o recurso solicitado: #${id}`)
                    document.querySelector('#container_popup').style.display = 'none';
                    document.querySelector('html').style.overflow = 'scroll'
                    return;
                }
            }
        }, 125);
    },
    fechar: () => {
        const btn = event.currentTarget
        let elementoPai = btn.parentNode

        while (!(elementoPai.id.startsWith('popup'))) {elementoPai = elementoPai.parentNode}

        const id = `#${elementoPai.id}`

        //Aplica estilos ao respectivo Popup
        try {
            document.querySelector(id).style.animation = 'popupDesaparecer 250ms ease-out';
        } catch (error) {
            document.querySelector('#container_popup').style.display = 'none';
            document.querySelector('html').style.overflow = 'scroll'
            return;
        }
    
        //Fecha o popup
        setTimeout(() => {
            document.querySelector(id).style.display = 'none';
            document.querySelector('#container_popup').style.display = 'none';
            document.querySelector('html').style.overflow = 'scroll'
            document.querySelector(id).style.animationName = 'popupAparecer'
        }, 250);
    },
    Minipopups: {
        abrir: (id, titulo, texto) => {
            if(typeof(titulo) === 'string'){document.querySelector(`#${id} h3`).innerText = titulo}
            if(typeof(texto) === 'string'){document.querySelector(`#${id} p`).innerText = texto}

            Popups.abrir(id)
        }
    }
}

//↓↓ CONFERIR E ALTERAR DADOS LOCAIS
const Dados = {
    conferirFerramenta: async () => {
        /**
         * @returns {object}
         * 
         * 1. A função carrega as informações do arquivo JSON contendo as informações de todas as ferramentas.
         * 2. Após, a função identifica qual o `id` da página através da URL (o caminho das ferramentas é o mesmo que o seu `id`) e salva apenas os dados da ferramenta com o `id` correspondente.
            * Caso a URL não tenha nenhuma `id` (como na página inicial ou de erro 404), a função define-o como `inicial`.
        * 3. Por fim, a função retorna um objeto contendo todas as informações da ferramenta.
         */
        const Info = await fetch('/ferramentas.json').then(res => res.json())
        let id = window.location.href.split('/')[3].includes('-') ? window.location.href.split('/').slice(3)[0] : 'inicial'
        let Ferramenta =''
        
        Info.forEach(obj => {if(obj.id === id){Ferramenta = obj}})

        return {
            id: Ferramenta.id,
            nome: Ferramenta.nome,
            descricao: Ferramenta.descrição,
            versao: Ferramenta.versão,
            sobre: Ferramenta.sobre,
            PUAU: Ferramenta.PUAU,
            novidades: Ferramenta.novidades
        }
    },
    conferirDadosLocais: async (nome, novoValor=null) => {
        /**
         * @param {string} nome - nome da variável a procurar no armazenamento local.
         * @param {string} novoValor - novo valor da variável.
         * @returns {string}
         *
         * 1. A função inicialmente coleta os dados do armazenamento local salvos e cria um vetor com vetores, separando cada valor.
             * Exemplo: "id:gerador-de-qr-code;versao:1;temaDaPagina:Claro;" VIRA [[id,gerador-de-qr-code],[versao,1],[temaDaPagina,Claro]].
         * 2. Após, a função checa se o parâmetro `nome` existe dentro de algum dos vetores.
         * 3. Caso não existe, a função retorna o erro `null` e o loga no console.
         * 4. Ao confirmar que o parâmetro `nome` existe dentro de algum dos vetores, a função checa se o parâmetro `novoValor` é diferente de `null`, em caso negativo, ela retorna o valor do parâmetro `nome`.
         * 5. Caso o parâmetro `novoValor` não seja nulo, a função então pega o index correspondente ao vetor de `nome` e altera o segundo valor do vetor (1) para o valor passado em `novoValor`. Após isso, o vetor de vetores é convertido novamente em uma string e salva no armazenamento local.
        */

        try {
            const valores = localStorage.getItem(`info_${(await Dados.conferirFerramenta()).id}`).split(';').map(valor => {return valor.split(':')})

            for(vetor of valores){
                if(vetor[0] == nome){
                    if(novoValor != null){
                        vetor[1] = novoValor
                        localStorage.setItem(`info_${(await Dados.conferirFerramenta()).id}`, valores.join(';').replaceAll(',', ':'))
                        return
                    } else{return vetor[1]}
                }
            }

            throw new Error(null)
        } catch (erro) {console.log(erro)}
    }
}

//↓↓ ABRIR LINK
function abrirLink(link,delay=0,alvo='_blank'){setTimeout(()=>{window.open(`https://${link}`, `${alvo}`)},delay)}

//↓↓ COMPARTILHAR
async function compartilharPagina() {
    const Info = {
        title: (await Dados.conferirFerramenta()).nome,
        text: (await Dados.conferirFerramenta()).descricao,
        url: (window.location.href.includes('?')) ?  window.location.href.split('?')[0] : window.location.href
    }

    //PRIMEIRA OPÇÃO DE COMPARTILHAMENTO: API NAVIGATOR.SHARE()
    try {
        await navigator.share(Info)
        const agradecimento = () => {
            if(document.visibilityState === 'visible') {
                document.removeEventListener('visibilitychange', agradecimento)

                setTimeout(() => {
                    Popups.Minipopups.abrir('popup_compartilhar_agradecimento')
                }, 1000);
            }
        }

        setTimeout(() => {
            document.addEventListener('visibilitychange', agradecimento)
        }, 500);
    } catch (erro) {
        if(erro.toString().includes('canceled')){return}
        Popups.abrir('popup_compartilhar')
    }

    //OPÇÕES DO POPUP DE COMPARTILHAMENTO (CASO API ANTERIOR NÃO SEJA SUPORTADA)
    //OPÇÃO 1: COMPARTILHAR PELO WHATSAPP
    const compartilharWhatsApp = async ()=>{
        document.querySelector("#popup_compartilhar > aside > div:nth-child(3) > button:nth-child(1)").removeEventListener('click', compartilharWhatsApp)

        try {
            window.open(`https://api.whatsapp.com/send/?phone=&text=${Info.url}`)
            Popups.fechar('popup_compartilhar')
            const agradecimento = ()=>{
                if(document.visibilityState === 'visible'){
                    document.removeEventListener('visibilitychange', agradecimento)
                    setTimeout(() => {
                        Popups.Minipopups.abrir('popup_compartilhar_agradecimento')
                    }, 250);
                }
            }
            setTimeout(() => {
                document.addEventListener('visibilitychange', agradecimento)
            }, 500);
        } catch (erro) {
            await importarPedacos('importarPopupErro');
            Popups.Minipopups.abrir('popup_noti_erro', 'Ops, algo deu errado...', 'Não foi possível compartilhar pelo WhatsApp.')

            document.querySelector("#popup_compartilhar > aside > div:nth-child(3) > button:nth-child(1)").disabled = true
        }
    }

    //OPÇÃO 2: COPIAR PARA ÁREA DE TRANSFERÊNCIA
    const copiarLink = async ()=>{
        try {
            document.querySelector("#popup_compartilhar > aside > div:nth-child(3) > button:nth-child(2)").removeEventListener('click', copiarLink)

            navigator.clipboard.writeText(`${Info.text.replace('.', ':')} ${Info.url}`)

            Popups.Minipopups.abrir('popup_compartilhar_agradecimento')
        } catch (erro) {
            await importarPedacos('importarPopupErro');
            Popups.Minipopups.abrir('popup_noti_erro', 'Ops, algo deu errado...', 'Não foi possível copiar para área de transferência.')

            document.querySelector("#popup_compartilhar > aside > div:nth-child(3) > button:nth-child(2)").disabled = true
        }
    }

    /*CÓDIGO EM TESTE: NÃO ESTÁ ATIVADO DEVIDO AO RESULTADO OBTIDO NÃO TER SEIDOA NIMADOR COMO O ESPERADO.
    const vibrar = ()=>{
        try {
            setTimeout(()=>{navigator.vibrate([375, 187.5, 187.5, 25]);},250)
            //O INTERVALO DE EXECUÇÃO É PARA COINCIDIR COM A EXECUÇÃO DA ANIMAÇÃO NO CSS.
        } catch (error) {return}
    }*/

    //ACIONADORES
    document.querySelector("#popup_compartilhar > aside > div:nth-child(3) > button:nth-child(1)").addEventListener('click', compartilharWhatsApp)
    document.querySelector("#popup_compartilhar > aside > div:nth-child(3) > button:nth-child(2)").addEventListener('click', copiarLink)
}

//↓↓ INSERÇÃO DOS CÓDIGOS DE TAGS E AFINS
/*
function insercaoDeTags(){
    const GTM = {
        head: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','TESTE');`,
        body: `<iframe src="https://www.googletagmanager.com/ns.html?id=TESTE" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
    }

    const insercao = (nome, origem, elemento='script', alocacao='head') => {
        let elementoCriado = document.createElement(elemento)
        elementoCriado.innerHTML = origem

        document.querySelector(alocacao).innerHTML += `<!-- ${nome} -->`
        document.querySelector(alocacao).appendChild(elementoCriado)
        document.querySelector(alocacao).innerHTML += `<!-- ${nome} -->`
    }; insercao('GOOGLE TAG MANAGER', GTM.head); insercao('GOOGLE TAG MANAGER (NONSCRIPT)', GTM.body, 'noscript', 'body')
}*/