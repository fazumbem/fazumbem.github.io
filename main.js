loadCampanhas();
loadInstituicoes();

document.getElementById('side-menu-button').addEventListener('click', showSideMenu);
document.getElementById('menu-close-button').addEventListener('click', hideSideMenu);

function showSideMenu() {
    document.getElementById('side-menu').style.width = '200px';
}

function hideSideMenu() {
    document.getElementById('side-menu').style.width = '0px';
}

function showModal() {
	let modalHtml = `
		<div id="modal-background" class="modal-background modal-hide">
			<div id="modal" class="modal">
                <a class="close-button modal-hide"></a>
                <div class="modal-content">
                    <div class="modal-content-header">
                        <h1>Fabricação de Máscaras</h1>
                        <p>Curso de moda do senai</p>
                        <p>Beneficiado</p>
                        <p>Local da Ação:</p>
                        <img src="images/campanha_lauduz.jpg"></img>
                        <p>Foto reprodução</p>
                    </div>
                    <div class="modal-content-card">
                        <h1 style="background-color: #2e343b">Como a ação vai ajudar?</h1>
                        <p>Texto de como a ação vai ajudar</p>
                    </div>
                    <div class="modal-content-card">
                        <h1 style="background-color: #a2cca7">Como ajudar?</h1>
                        <p>As doações podem ser entregues no Lar(Avenida Hélvio Basso, 1250, Bairro Duque de Caxias) ou em dinheiro</p>
                    </div>
                    <div class="modal-content-card">
                        <h1 style="background-color: #ec2950">O que doar?</h1>
                        <p>Com álcool gel e álcool para limpeza, fraldas geriátricas (G, GG e EG), papel higiênico, máscaras e luvas, 
                        água sanitária, de desinfetante e detergente, shampoo, condicionador, repelente, sabão em pó e desodorante roll on e alimentos
                        não perecíveis, como leite integral ou sem lactose, farinha de trigo, bolachas doces e salgadas, aveia, vinagre, arroz,
                        macarrão, feijão, açúcar, café em pó e gelatina.
                        </p>
                    </div>
                    <div class="modal-content-card">
                        <h1 style="background-color: #f6b064">Links úteis</h1>
                        <p>XYZ</p>
                    </div>
                </div>
			</div>
		</div>`
    document.body.innerHTML += modalHtml;
    document.getElementById('modal-background').addEventListener('click', e => {
        hideModal(e);
    });
}

function hideModal(e) {
    if(e.target.classList.contains('modal-hide')){
	    let modal = document.getElementById('modal-background');
        document.body.removeChild(modal);
    }
}

async function loadCampanhas() {
    const url = 'https://fazumbem.herokuapp.com/acao?tipo_request=all';
    const options = {
        method: 'GET',
        mode: 'cors'
    }
    try {   
        const acoes_json = await fetch(url, options);
        const acoes_response = await acoes_json.json();
        const acoes = acoes_response['data'];
        let grid = document.getElementById('grid-campanha');
        let html = '';
        for (acao of acoes) {
            html += 
            `<div class="card-campanha" onclick="showModal()">
                <img src="./images/campanha_lauduz.jpg" />
                <div>
                    <p>Instituição promotora</p>
                    <p class="instituicao-nome">${acao.nome_entidade}</p>
                    <p>Benefeciado:</p>
                    <button class="button-doar">Doar</button>
                </div>
            </div>`
        }
        grid.innerHTML = html;
    } catch(e) {
        console.log(e);
    }
}

async function loadInstituicoes() {
    const url = 'https://fazumbem.herokuapp.com/entidade?tipo_request=all';
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