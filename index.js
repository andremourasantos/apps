//↓↓ CONFIGURAÇÕES
let Ferramenta = {
    nome: 'Inicial',
    info: 'versao:3;temaDaPagina:Claro',
    PUAU: 'salvarDados:0;sincronizarTema:0;habilitarCookies:0',
    temaDaPagina: null
}

//↓↓ CARREGAR ARQUIVOS
window.addEventListener('DOMContentLoaded', async ()=>{
    const rodape = document.querySelector('footer')
    const popups = document.querySelector('#container_popup')
    const mensagemErro = `<p>Não foi possível carregar este item :/</p>`

    //CARREGAMENTO DOS PEDAÇOS
        //RODAPÉ
        importarRodape = async () => {
            const res = await fetch('/pedaco/footer.html')
            if(res.status != 200){rodape.innerHTML = mensagemErro} else {
            rodape.innerHTML = (await res.text()).toString(); 
            }
        }
        importarRodape()
    
        //PUAU
        importarPUAU = async () => {
            const res = await fetch('/pedaco/puau.html');
            popups.innerHTML += (await res.text()).toString();
            autoAjustePUAU()
        }
        importarPUAU()
})



//↓↓ ACIONADORES
document.querySelector('#alteraTemaPagina').addEventListener('click', ()=>{alterarTema(1)})

document.querySelector('#link_github_popup').addEventListener('click', ()=>{setTimeout(()=>{window.open('https://github.com/andremourasantos', '_blank')},250)})

document.querySelector('#pularParaFerramentas').addEventListener('click', ()=>{document.querySelector('#ferramentas').scrollIntoView()})

//↓↓ LINKS
document.querySelector('#geradorLoremIpsum').addEventListener('click', ()=>{window.open('https://andremourasantos.com/loremipsum/', '_blank')})

document.querySelector('#linkDeWhatsApp').addEventListener('click', ()=>{window.open('https://andremourasantos.com/wplink/','_blank')})