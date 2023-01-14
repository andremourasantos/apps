"use strict"
//↓↓ ACIONADORES
document.querySelector('#pularParaFerramentas').addEventListener('click', ()=>{document.querySelector('#ferramentas').scrollIntoView()})

//↓↓ FECTHING DAS FERRAMENTAS
async function popularFerramentas() {
    /**
     * 1. A função copia o conteúdo do elemento template dentro de #fachada_de_ferramentas e adquira o JSON com as informações de todas as ferramentas.
     * 2. A função faz um loop por todas as entradas do JSON das ferramentas e, quando encontra uma ferramenta, cria um clone do modelo e altera os valores para os valores correspondentes ao da ferramenta, após isso, anexa o clone do modelo no documento.
     */
    
    const modelo = document.querySelector('#fachada_de_ferramentas > template').content.cloneNode(true)
    const ferramentas = await fetch('/ferramentas.json').then(res => res.json())

    for(const info of Object.entries(ferramentas)){
        if(info[1].id !== 'geral' && info[1].id !== 'inicial'){
            const ferramenta = info[1]
            let cartao = modelo.cloneNode(true)

            //Elementos do cartao
            cartao.querySelector('a').href = `/${ferramenta.id}/`
            cartao.querySelector('div').id = ferramenta.id
            cartao.querySelector('img').src = `/${ferramenta.id}/logo.png`
            cartao.querySelector('h3').textContent = ferramenta.nome
            cartao.querySelector('p').textContent = ferramenta.descrição
            
            document.querySelector('#fachada_de_ferramentas').appendChild(cartao)
        }
    }
}; popularFerramentas()