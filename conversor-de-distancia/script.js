"use stric"

//↓↓ TIPOS DE CONVERSÃO
const CONVERSOES = {
    KM: {
        mi: (distancia) => {return distancia * 0.621371},
        ft: (distancia) => {return distancia * 3281},
        nm: (distancia) => {return distancia * 0.539957},
        m: (distancia) => {return distancia * 1000}
    },
    MI: {
        km: (distancia) => {return distancia * 1.60934},
        ft: (distancia) => {return distancia * 5280},
        nm: (distancia) => {return distancia * 0.868976},
        m: (distancia) => {return distancia * 1609.34}
    },
    FT: {
        km: (distancia) => {return distancia / 3281},
        mi: (distancia) => {return distancia / 5280},
        nm: (distancia) => {return distancia / 6076.115485564304},
        m: (distancia) => {return distancia / 3.28083989501312}
    },
    NM: {
        km: (distancia) => {return distancia * 1.852},
        mi: (distancia) => {return distancia * 1.150779},
        ft: (distancia) => {return distancia * 6076.12},
        m: (distancia) => {return distancia * 1852}
    },
    M: {
        km: (distancia) => {return distancia * 1000},
        mi: (distancia) => {return distancia / 1609.34},
        ft: (distancia) => {return distancia * 3.28083989501312},
        nm: (distancia) => {return distancia / 1852}
    }
}

//↓↓ OBJETO DA PÁGINA (FERRAMENTA)
const FERRAMENTA = {
    botao: document.querySelector('#converter'),
    saida: document.querySelector('#saida'),
    converter: () => {
        const distancia = document.querySelector('#distancia').value
        const unidadeDeMedida = document.querySelector('#unidadeDeMedida').value.toUpperCase()
        const unidadeDeConversao = document.querySelector('#unidadeDeConversao').value

        let valor = new Intl.NumberFormat().format(CONVERSOES[unidadeDeMedida][unidadeDeConversao](distancia))

        FERRAMENTA.saida.value = `${valor} ${unidadeDeConversao}`
    },
    atualizarSeletores: () => {
        const seletoresUnidadeDeConversao = Array.from(document.querySelector('#unidadeDeConversao').childNodes).filter(elemento => {return elemento.nodeName == 'OPTION'})

        for(elemento of seletoresUnidadeDeConversao){
            if(elemento.value == document.querySelector('#unidadeDeMedida').value){elemento.setAttribute('disabled', 'disabled')} else {elemento.removeAttribute('disabled')}
        }
    }
}

//ACIONADORES
FERRAMENTA.botao.addEventListener('click', FERRAMENTA.converter)
document.querySelector('#unidadeDeMedida').addEventListener('change', FERRAMENTA.atualizarSeletores)