//↓↓ SCRIPTS PRIMORDIAIS
window.addEventListener('DOMContentLoaded', async () => {
    //IMPORTAR NOVIDADES GERAIS DA FERRAMENTA
    const NovidadesGerais = [
        ['Compartilhe facilmente', `Está mais fácil do que nunca compartilhar a página, basta clicar no <span class="interacao" onclick="compartilharPagina()" title="Compartilhar página">novo ícone de compartilhar</span> no cabeçalho da página!`],
    ]; NovidadesGerais.forEach(item => {Ferramenta.Info.novidades.push(item)})

    //IMPORTA OS PEDAÇOS E EXECUTA TODOS OS CÓDIGOS REFERNTES AOS ELEMENTOS IMPORTADOS
    await importarPedacos();
    atualizarPUAU(); autoAjustePUAU(); puauTrocarFonteParaSuperlegivel();
    
    //CHECAR VERSAO
    if(pegarDadosLocais('versao') != pegarDadosFerramenta('versao')){
        //EXIBIR POPUP NOVIDADES
        abrirPopup('popup_log_novidades')

        //ATUALIZAR ARMAZENAMENTO LOCAL
        pegarDadosLocais('versao', pegarDadosFerramenta('versao'))
    }

    //CONFERIR ARMAZENAMENTO LOCAL
    if(localStorage.getItem(`info${Ferramenta.nome}`) == null){}else{localStorage.clear()}
    if(localStorage.getItem(`info_${Ferramenta.nome}`) == null){localStorage.setItem(`info_${Ferramenta.nome}`, Ferramenta.info)}

    /*REFERÊNCIA DE TEMA*/
    /*
        Hierarquia do sistema: temaDoDispositivo > sincronizarTema
        
        Caso a opção de 'temaDoDispositivo' esteja ativada, ela sobrepõe as configurações da opção de 'sincronizarTema', mas sem alterar o armazenamento local dela 'localStorage.setItem('temaDaPagina')'.

        Deve ser possível obter dois casos distintos de uso: Uma página com a opção 'temaDoDispositivo' habilitada e no modo 'Escuro', por exemplo, enquanto outra página que não tem essa opção habilitada está com no modo 'Claro' e 'sincronizarTema' também está definido para o modo 'Claro'.
    */

   if (Number(conferirPUAU('temaDoDispositivo')) >=2) {
        //CONFERE TEMA DO DISPOSITIVO E APLICA
        window.matchMedia("(prefers-color-scheme: dark)").matches ? pegarDadosLocais('temaDaPagina', 'Escuro') : pegarDadosLocais('temaDaPagina', 'Claro'); alterarTema(0);
   } else {
        //CONFERE TEMA COMPARTILHADO E APLICA
        if (Number(conferirPUAU('sincronizarTema')) >=2) {
            if(localStorage.getItem('temaDaPagina') != null){pegarDadosLocais('temaDaPagina', localStorage.getItem('temaDaPagina')); alterarTema(0)}; 
        } else {
            //CONFERE TEMA DA PÁGINA EM QUESTÃO E APLICA
            if(pegarDadosLocais('temaDaPagina') != null){alterarTema(0);}
        }
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
        const observadorDeDimensoes = new ResizeObserver(function(elementos){ajustarTamanhos()}); observadorDeDimensoes.observe(document.querySelector("#ferramenta"))

        window.addEventListener('resize', ()=>{ajustarTamanhos()})
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
            document.querySelector('header h1').innerText = pegarDadosFerramenta('nome')
            document.querySelector('header p').innerText = pegarDadosFerramenta('descricao')
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
            document.querySelector('#popup_sobre p:first-of-type').innerHTML = Ferramenta.Info.sobre
        } catch (erro) {
            console.log(erro)
        }
    };

    const importarNovidades = async () => {
        try {
            const res = await fetch('/pedaco/popups/log_novidades.html')
            if(res.status != 200){throw new Error(res.status)}
            popups.innerHTML += (await res.text()).toString()

            Ferramenta.Info.novidades.forEach(item => {
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
        } catch (erro) {console.og(erro)}
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
            await importarInformacoesCookies();
            await importarPopupSobre();
            await importarNovidades();
            await importarPopupErroFetch();
            await importarPopupCompartilhar();
            await importarRodape();
            break;
    }
}

//↓↓ PAINEL UNIVERSAL DE AJUSTES DO USUÁRIO (PUAU)
function atualizarPUAU(){
    if(localStorage.getItem(`puau_${Ferramenta.nome}`) != null){
        const antigoPUAU = localStorage.getItem(`puau_${Ferramenta.nome}`).split(';').map(item => {return item.split(':')});

        const novoPUAU = Ferramenta.PUAU.split(';').map(item => {return item.split(':')});

        /*VERIFICA E MANTÉM OS AJUSTES EFETUADOS PELO USUÁRIO
        Verifica se os ajustes do novo PUAU contém alguma seção obrigatória que deve ser aplicada (cód. 0, representando obrigatóriamente desligado, e cód. 3, representando obrigatóriamente ligado).

        Descarta os códigos '0' e '3' caso eles venham do antigoPUAU, pois eles não representam uma ação de vontade do usuário, mas sim resultado das capacidades da ferramenta no passado.

        Caso não houvesse esse descarte, um bug ocorreria e uma vez que o usuário definisse uma preferência, seria impossível atualizar as opções que não eram suportadas anteriormente pela ferramenta, pois elas estariam marcadas como '0' ou '3' e assim permaneceriam.

        Graças ao descarte, quando a ferramenta recebe uma nova funcionalidade, antes não suportada (cód. '0' ou '3'), ela será atualizada e a nova funcionalidade poderá funcionar. Antes, o script leria o antigo PUAU e definiria que, mesmo que a agora a ferramenta suporte essa opção, como no passado ela não era suportada, ela continuaria não sendo suportada, devido à prioridade do antigo PUAU para com o novo.
        */
        antigoPUAU.forEach(item => {
            for(index=0;index<novoPUAU.length;index++){
                if(item[0] == novoPUAU[index][0]){
                    if(item[1] != '0' && item[1] != '3' && novoPUAU[index][1] != '0' && novoPUAU[index][1] != '3'){novoPUAU[index][1] = item[1];} else {}
                    break;
                }}
        })

        localStorage.setItem(`puau_${Ferramenta.nome}`, novoPUAU.join(';').replaceAll(',', ':'))
    }
}

function autoAjustePUAU(){
    //AJUSTAR TOGGLES
    document.querySelectorAll('#container_opcoes_PUAU input').forEach(opcao => {if(conferirPUAU(opcao.id) == 1){opcao.disabled = false} else if(conferirPUAU(opcao.id) == 2){opcao.disabled = false; opcao.checked = true;} else if(conferirPUAU(opcao.id) == 3){opcao.checked = true;};})

    //ACIONADORES
    document.querySelectorAll("#container_opcoes_PUAU > article.opcao_PUAU > div:nth-child(2) > input").forEach(opcao => document.querySelector(`#${opcao.id}`).addEventListener('click', ()=>{conferirPUAU(opcao.id, document.querySelector(`#${opcao.id}`).checked)}))

    //ACIONADORES ESPECIAIS
    document.querySelector('#acessibilidadeFonte').addEventListener('click', puauTrocarFonteParaSuperlegivel)
}

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

    //FUNÇÕES EXTRAS E DE ACESSIBILIDADE
    function puauTrocarFonteParaSuperlegivel() {
        let cssRoot = document.querySelector(':root')
        if(Number(conferirPUAU('acessibilidadeFonte'))>=2){
            /*FONTES DISPONÍVEIS
            As fontes utilizadas no projeto estão divididas entre '--texto_titulo', para todos os títulos, e '--texto_geral' para todos os parágrafos. Com a opção de acessibilidade, ambos títulos e parágrafos passarão a utilizar a mesma fonte, definida em '--texto_geral_acessibilidade'.

            Atualmente, as fontes são:
            --texto_titulo: 'Ubuntu', sans-serif
            --texto_geral: 'Albert Sans', sans-serif
            --texto_geral_acessibilidade: 'Atkinson Hyperlegible', monospace
            */
            cssRoot.style.setProperty('--texto_titulo', `'Atkinson Hyperlegible', monospace`)
            cssRoot.style.setProperty('--texto_geral', `'Atkinson Hyperlegible', monospace`)
        } else {
            cssRoot.style.setProperty('--texto_titulo', `'Ubuntu', sans-serif`)
            cssRoot.style.setProperty('--texto_geral', `'Albert Sans', sans-serif`)
        }
    }

//↓↓ ESTILO DA PÁGINA
function alterarTema(interacao=0){
    let icone = document.querySelector("#alteraTemaPagina > i")

    if(interacao===0){
        switch (pegarDadosLocais('temaDaPagina')) {
            case 'Escuro':
                document.body.classList.add('modo_escuro'); icone.className = 'ph-sun-fill'; icone.style.transform = 'scaleX(1)';

                //CONFERE HIERARQUIA DE TEMA DA PÁGINA
                Number(conferirPUAU('temaDoDispositivo')) >=2 ? '' : Number(conferirPUAU('sincronizarTema')) >=2 ? localStorage.setItem('temaDaPagina', 'Escuro') : ''
                break;
        
            default:
                document.body.classList.remove('modo_escuro'); icone.className = 'ph-moon-fill'; icone.style.transform = 'scaleX(-1)';

                //CONFERE HIERARQUIA DE TEMA DA PÁGINA
                Number(conferirPUAU('temaDoDispositivo')) >=2 ? '' : Number(conferirPUAU('sincronizarTema')) >=2 ? localStorage.setItem('temaDaPagina', 'Claro') : ''
                break;
        }
    } else {
        switch (pegarDadosLocais('temaDaPagina')) {
            case 'Escuro':
                document.body.classList.remove('modo_escuro'); pegarDadosLocais('temaDaPagina', 'Claro'); icone.className = 'ph-moon-fill'; icone.style.transform = 'scaleX(-1)';

                //CONFERE HIERARQUIA DE TEMA DA PÁGINA
                Number(conferirPUAU('temaDoDispositivo')) >=2 ? '' : Number(conferirPUAU('sincronizarTema')) >=2 ? localStorage.setItem('temaDaPagina', 'Claro') : ''
                break;
        
            default:
                document.body.classList.add('modo_escuro'); pegarDadosLocais('temaDaPagina', 'Escuro'); icone.className = 'ph-sun-fill'; icone.style.transform = 'scaleX(1)';

                //CONFERE HIERARQUIA DE TEMA DA PÁGINA
                Number(conferirPUAU('temaDoDispositivo')) >=2 ? '' : Number(conferirPUAU('sincronizarTema')) >=2 ? localStorage.setItem('temaDaPagina', 'Escuro') : ''
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

//↓↓ POPUPS
//↓↓ OBJETOS DE AGREGAÇÃO
/*OBJETO POPUPS
  Esse objeto deve irá substituir as funções abrirPopup() e fecharPopup() em uma futura atualização.  
*/
const Popups = {
    abrir: id => {
        //Fecha todos os Popups anteriores (evitar erros)
        document.querySelectorAll('*[id^="popup_"]').forEach(popup => {popup.style.display = 'none'})

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
    fechar: id => {
        //Aplica estilos ao respectivo Popup
        try {
            document.querySelector(`#${id}`).style.animation = 'popupDesaparecer 250ms ease-out';
        } catch (error) {
            document.querySelector('#container_popup').style.display = 'none';
            document.querySelector('html').style.overflow = 'scroll'
            return;
        }
    
        //Fecha o popup
        setTimeout(() => {
            document.querySelector(`#${id}`).style.display = 'none';
            document.querySelector('#container_popup').style.display = 'none';
            document.querySelector('html').style.overflow = 'scroll'
            document.querySelector(`#${id}`).style.animationName = 'popupAparecer'
        }, 250);
    },
    Minipopups: {
        abrir: (id, tempo=3000) => {
            Popups.abrir(id)

            if(tempo!=0){
                setTimeout(() => {
                    Popups.fechar(id)
                }, tempo);
            }
        },
        modificar: (id, tempo=3000, titulo, texto) => {
            if(typeof(titulo) == 'string'){document.querySelector(`#${id} h3`).innerText = titulo}
            if(typeof(texto) == 'string'){document.querySelector(`#${id} p`).innerText = texto}    
            
            Popups.abrir(id)
            setTimeout(() => {
                Popups.fechar(id)
            }, tempo);
        }
    }
}

function abrirPopup(id){
    id = `#${id}`

    //Fecha todos os Popups anteriores (evitar erros)
    document.querySelectorAll('*[id^="popup_"]').forEach(popup => {popup.style.display = 'none'})

    //Aplica os estilos ao respectivo Popup
    setTimeout(() => {
        try {
            document.querySelector('html').style.overflow = 'hidden';
            document.querySelector('#container_popup').style.display = 'flex';
            document.querySelector(id).style.display = 'block';
            document.querySelector(id).scrollTo(0,0)
        } catch (erro) {
            try {
                document.querySelector('#popup_erroFetch').style.display = 'block';
            } catch (erro) {
                alert(`Ocorreu um erro e não foi possível resgatar o recurso solicitado: ${id}`)
                document.querySelector('#container_popup').style.display = 'none';
                document.querySelector('html').style.overflow = 'scroll'
                return;
            }
        }
    }, 125);
}

function fecharPopup(id){
    id = `#${id}`

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
        for(i=0;i<info.length;i++){if(info[i][0] == item){info[i][1] = valor; return localStorage.setItem(`info_${Ferramenta.nome}`, info.join(';').replaceAll(',',':'))}}
    } else {
        for(i=0;i<info.length;i++){if(info[i][0] == item){return info[i][1]}}
    }
    return null;
}

//↓↓ ABRIR LINK
function abrirLink(link,delay=0,alvo='_blank'){setTimeout(()=>{window.open(`https://${link}`, `${alvo}`)},delay)}

//↓↓ COMPARTILHAR
async function compartilharPagina() {
    const Info = {
        title: Ferramenta.Info.nome,
        text: Ferramenta.Info.descricao,
        url: window.location.host
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
            Popups.Minipopups.modificar('popup_noti_erro', 3000, 'Ops, algo deu errado...', 'Não foi possível compartilhar pelo WhatsApp.')

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
            Popups.Minipopups.modificar('popup_noti_erro', 3000, 'Ops, algo deu errado...', 'Não foi possível copiar para área de transferência.')

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
/*function insercaoDeTags(){
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