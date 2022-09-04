//↓↓ CONFIGURAÇÕES
let FERRAMENTA = {
    nome: 'Inicial',
    versao: '1.0',
}

//↓↓ CARREGAR ARQUIVOS
window.addEventListener('DOMContentLoaded', ()=>{
    const rodape = document.querySelector('footer')
    const mensagemErro = `<p>Não foi possível carregar este item :/</p>`

    //CARREGAMENTO DOS PEDAÇOS
    fetch('/pedaco/footer.html').then(res=>{
        if(res.status == 404){throw new Error(404)} else {
            res = res.text().then(data => rodape.innerHTML = data)}
    }).catch(erro => {rodape.innerHTML = mensagemErro})
})

//↓↓ ACIONADORES
document.querySelector('#alteraTemaPagina').addEventListener('click', ()=>{alterarTema(1)})

document.querySelector('#link_github_popup').addEventListener('click', ()=>{setTimeout(()=>{window.open('https://github.com/andremourasantos', '_blank')},250)})

document.querySelector('#pularParaFerramentas').addEventListener('click', ()=>{document.querySelector('#ferramentas').scrollIntoView()})

//↓↓ LINKS
document.querySelector('#geradorLoremIpsum').addEventListener('click', ()=>{window.open('https://andremourasantos.com/loremipsum/', '_blank')})

document.querySelector('#linkDeWhatsApp').addEventListener('click', ()=>{window.open('https://andremourasantos.com/wplink/','_blank')})