//variáveis
var campanhas =  null;
var instituicoes = null;
var campanhaIcon = L.icon({
    iconUrl: 'images/map-marker-campanha.png',
    iconSize:     [30, 39], // size of the icon
    iconAnchor:   [15, 39], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

//chamada das funções que carregam o conteúdo da página
map = loadMap();
loadCampanhas();
loadInstituicoes();

//menu lateral
document.getElementById('side-menu-button').addEventListener('click', showSideMenu);
document.getElementById('menu-close-button').addEventListener('click', hideSideMenu);

function showSideMenu() {
    document.getElementById('side-menu').style.width = '200px';
}

function hideSideMenu() {
    document.getElementById('side-menu').style.width = '0px';
}

//modal
function showModal(i) {
    let acao = acoes[i];
	let modalHtml = `
			<div id="modal" class="modal">
                <a class="close-button modal-hide"></a>
                <div id="modal-content" class="modal-content">
                    <div class="modal-content-header">
                        <h1>${acao.nome_acao}</h1>
                        <p>${acao.nome_entidade}</p>
                        <!--img src="images/acoes/${acao.imagem_acao}"></img-->
                        <img src="images/campanha_lauduz.jpg"></img>
                        <!--p>Local da Ação:</p-->
                    </div>
                    ${acao.descricao ?
                        `<div class="modal-content-card">
                            <h1 style="background-color: #2e343b">Descrição</h1>
                            <p>${acao.descricao}</p>
                        </div>` : ''
                    }
                    ${acao.contato ?
                        `<div class="modal-content-card">
                            <h1 style="background-color: #a2cca7">Contato</h1>
                            <p>${acao.contato}</p>
                        </div>` : ''
                    }
                </div>
			</div>`
    let divModal = document.createElement('div');
    divModal.id = 'modal-background';
    divModal.className = 'modal-background modal-hide';
    divModal.innerHTML = modalHtml;
    divModal.onclick = function(e){hideModal(e, divModal)};
    document.body.appendChild(divModal);
    if(window.innerWidth > 900){
        let modal = document.getElementById('modal-content');
        let height = 0;
        for(let child of modal.children){
            console.log(child.offsetHeight);
            height += child.offsetHeight + 40;
        }
        console.log('height: ' + height + ' modal offset: ' + modal.offsetHeight);
        modal.parentElement.style.width = String(parseInt(height / modal.offsetHeight + 1) * 360) + 'px';
    }
}

function hideModal(e, modal) {
    if(e.target.classList.contains('modal-hide')){
        document.body.removeChild(modal);
    }
}

//funções que carregam o conteúdo da página

async function loadCampanhas() {
//    const url = 'https://fazumbem.herokuapp.com/acao?tipo_request=all';
    const url = 'https://fazumbem-api.herokuapp.com/acao?tipo_request=all';
    const options = {
        method: 'GET',
        mode: 'cors'
    }
    try {   
        const acoes_json = await fetch(url, options);
        const acoes_response = await acoes_json.json();
        acoes = acoes_response['data'];

        let grid = document.getElementById('grid-campanha');
        let html = '';
        for (const [i, acao] of acoes.entries()) {
            // <div class="card-campanha-titulo">Nome de campanha</div>
            // <div class="card-campanha-filter"></div>
            let nome_acao_pretty = acao.nome_acao;
            if(acao.nome_acao.length > 80){
                nome_acao_pretty = acao.nome_acao.slice(0, 80);
                nome_acao_pretty = nome_acao_pretty + "...";
            }
            
            html += 
            `<div class="card-campanha">
                <img class="card-campanha-img" src="images/acoes/${acao.imagem_acao}" />
                <div class="card-campanha-filter"></div>
                <div class="card-campanha-risco"></div>
                <p class="card-campanha-titulo">${nome_acao_pretty}</p>
                <img class="card-campanha-folhapequena" src="images/folha_pequena.svg" >
                <img class="card-campanha-cabopequeno" src="images/cabo_pequeno.svg" >
                <img class="card-campanha-folhagrande" src="images/folha_grande.svg" >
                <img class="card-campanha-cabogrande" src="images/cabo_grande.svg" >
                
                <div>
                    <p>Instituição promotora</p>
                    <p class="instituicao-nome">${acao.nome_entidade}</p>
                    <button class="button-vermais" onclick="showModal(${i})">Ver +</button>
                </div>
            </div>`
            for(localizacao of acao.localizacoes){
                if(localizacao.latitude && localizacao.longitude){
                    let marker = new L.marker([Number(localizacao.latitude), Number(localizacao.longitude)], {icon: campanhaIcon, title: acao.nome_acao})
                    .on('click', function(e){showModal(i)})
                    .addTo(map);
                }
            }
        }
        grid.innerHTML = html;
    } catch(e) {
        console.log(e);
    }
}

async function loadInstituicoes() {
//    const url = 'https://fazumbem.herokuapp.com/entidade?tipo_request=all';
    const url = 'https://fazumbem-api.herokuapp.com/entidade?tipo_request=all';
    const options = {
        method: 'GET',
        mode: 'cors'
    }
    try {   
        const entidades_json = await fetch(url, options);
        const entidades_response = await entidades_json.json();
        const entidades = entidades_response['data'];
        let grid = document.getElementById('grid-instituicoes');
        let html = '';
        for (entidade of entidades) {
            let nome_entidade = entidade.nome;
            if(nome_entidade.length > 40){
                let nome_entidade_cut = nome_entidade.substring(0, 40);
                nome_entidade = nome_entidade_cut + nome_entidade.substring(40, nome_entidade.length).split(' ')[0];
                nome_entidade = nome_entidade + '...';
            }
            html += 
            `<div class="card-instituicao">
                <img src="./images/campanha_lauduz.jpg"/>
                <p>${nome_entidade}</p>
                <p>Santa Maria</p>
            </div>`
        }
        grid.innerHTML = html;
    } catch(e) {
        console.log(e);
    }
}

function loadMap(){
    var map = L.map('map').setView([-29.688196, -53.812421], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZmVsaXBlbWFyaW4iLCJhIjoiY2s5ajM2MzY4MDBwcjNtcHVnZjBhM2hiYiJ9.zQ-vU2StF9PScFnzd6vT3w', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.pk.eyJ1IjoiZmVsaXBlbWFyaW4iLCJhIjoiY2s5ajM2MzY4MDBwcjNtcHVnZjBhM2hiYiJ9.zQ-vU2StF9PScFnzd6vT3w'
    }).addTo(map);
    return map;
}
