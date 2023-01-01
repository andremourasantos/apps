//↓↓ INFO DA FERRAMENTA
let Ferramenta = {
    PUAU: 'acessibilidadeFonte:1;salvarDados:0;sincronizarTema:2;temaDoDispositivo:1;habilitarCookies:0'
}

//↓↓ FERRAMENTA
const Gerador = {
    Interacoes: {
        removerUm: document.querySelector('#removerQuantidadeTxt'),
        adicionarUm: document.querySelector('#adicionarQuantidadeTxt'),
        gerar: document.querySelector('#gerar_lorem'),
        saida: document.querySelector('#saida_txt'),
        copiarSaida: document.querySelector('#copiar_txt')
    },
    quantidadeTexto: document.querySelector('#quantidade_txt').value,
    tipoTexto: document.querySelector('#tamanho_txt').value,
    textoBase: [
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores iste in, nesciunt vitae nihil itaque facere laborum quae consequatur reiciendis corrupti facilis nulla aspernatur tempore repellendus cum voluptatem praesentium optio sit, maxime illo laboriosam molestiae?',
        'Hic distinctio nisi, corporis deserunt est esse facere quasi saepe! Aliquam repellat ratione natus enim molestiae cupiditate, beatae quas eligendi?',
        'Et odit, nobis natus perferendis, iure atque mollitia similique dolorem repellendus enim nostrum veritatis doloremque sit numquam nulla molestiae!',
        'Voluptas, veritatis dolore. Nesciunt iure temporibus delectus, dolor earum ullam possimus veniam repellat quia laudantium doloremque optio neque obcaecati omnis itaque ea harum animi minus et quibusdam distinctio a provident corporis enim.',
        'Ea ipsam officiis quas modi quae earum quis qui, minus temporibus sed voluptates amet adipisci quos fuga asperiores animi explicabo expedita ipsa quia dolor, nulla, saepe neque?',
        'Necessitatibus delectus cupiditate itaque soluta beatae quo corrupti, neque optio nam tempora quaerat? Nihil incidunt, reiciendis ullam ex recusandae assumenda alias quas repellendus eos.',
        'Rem non ratione distinctio impedit velit, odio, explicabo recusandae, cumque adipisci quia amet qui. Dicta reiciendis error nemo velit cum quasi ea in omnis?',
        'Dolor natus optio esse voluptates deleniti? Minus dolore sapiente voluptate molestiae beatae eos consectetur dignissimos nesciunt, reprehenderit, velit temporibus iusto voluptatum quaerat asperiores maxime neque architecto culpa molestias eum, blanditiis fugiat?',
        'Repellat vitae dolore iste necessitatibus, fugit eius quo sunt libero eaque iure aliquam magni optio alias eligendi, qui nam praesentium voluptatum autem delectus culpa omnis ipsa hic sed quia?',
        'Ipsum, quae? Iusto obcaecati exercitationem aspernatur suscipit explicabo eum!'
    ],
    gerar: (quantidade, tipo)=>{
        const numerosSorteados = Array.from(new Array(Number(quantidade)), Math.random).map(valor => {return Math.round(Number(valor*10))})
        for(i=0;i<quantidade;i++){if(numerosSorteados[i]>=Gerador.textoBase.length){numerosSorteados[i]=1}}

        let texto = ''
        switch (tipo) {
            case 'palavra':
                
                for(i=0;i<Gerador.textoBase.length;i++){
                    if(Gerador.textoBase[numerosSorteados[i]].replaceAll(/[.,!?]/g, '').split(' ').length >= quantidade){texto = Gerador.textoBase[numerosSorteados[i]].split(' '); break;}
                }

                for(i=0;i<quantidade;i++){
                    if(i==0){Gerador.Interacoes.saida.value += texto[i]}
                    else if(i<quantidade-1){Gerador.Interacoes.saida.value += ` ${texto[i]}`}
                    else {if(/[.,!?]/g.test(texto[i])){Gerador.Interacoes.saida.value += ` ${texto[i].replace(/[.,!?]/g,'.')}`} else {Gerador.Interacoes.saida.value += ` ${texto[i]}. `}}
                }
                break;
        
            case 'frase':
                for(i=0;i<quantidade;i++){
                    texto = Gerador.textoBase[numerosSorteados[i]].split(/[.!?]/g)
                    Gerador.Interacoes.saida.value += `${texto[0]}.\n\n`
                }
                break;

            case 'paragrafo':
                for(i=0;i<quantidade;i++){
                    texto = Gerador.textoBase[numerosSorteados[i]]
                    Gerador.Interacoes.saida.value += `${texto}\n\n`
                }
                break;

            default:
                break;
        }
    },
    copiar: ()=>{
        //ÍCONES
        botao = Gerador.Interacoes.copiarSaida
        const Icones = {
            copiar: 'ph-clipboard-text-fill',
            copiado: 'ph-check-bold',
            erro: 'ph-x-bold',
            novo: ''
        }

        try {
            navigator.clipboard.writeText(Gerador.Interacoes.saida.value)
            Icones.novo = Icones.copiado
        } catch (erro) {
            Icones.novo = Icones.erro
        }
        
        botao.classList = Icones.novo
        setTimeout(() => {
            botao.classList = Icones.copiar
        }, 1500);
    },
    /*
    salvar: ()=>{
        const dados = Array.from(pegarDadosFerramenta('dadosSalvos').split(',')).map(item => {return item.split('=')})

        dados[0][1] = Gerador.quantidadeTexto
        dados[1][1] = Gerador.tipoTexto

        dados[0] = dados[0].join('=')
        dados[1] = dados[1].join('=')
        pegarDadosLocais('dadosSalvos', dados.join(','))
    }*/
}

//↓↓ ADICONADORES
Gerador.Interacoes.removerUm.addEventListener('click', ()=>{document.querySelector('#quantidade_txt').stepDown()})
Gerador.Interacoes.adicionarUm.addEventListener('click', ()=>{document.querySelector('#quantidade_txt').stepUp()})
Gerador.Interacoes.gerar.addEventListener('click', ()=>{Gerador.quantidadeTexto = document.querySelector('#quantidade_txt').value; Gerador.tipoTexto = document.querySelector('#tamanho_txt').value; Gerador.gerar(Gerador.quantidadeTexto, Gerador.tipoTexto)})
Gerador.Interacoes.copiarSaida.addEventListener('click', ()=>{Gerador.copiar()})