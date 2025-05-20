

const listaOrcamento = document.querySelector('.listaOrcamentos');

const impVeiculo = document.getElementById('impVeiculo');
const impCor = document.getElementById('impCor');
const impCliente = document.getElementById('impCliente');
const impItem = document.querySelector('.impItem');
const impDescricao = document.querySelector('.impDescricao');
const impValor = document.querySelector('.impValor');
const impTotal = document.getElementById('impTotal')

function retornarHome() {
    window.location.href = ("/index.html")
}

window.addEventListener('load', renderOrcamentos)

async function renderOrcamentos() {
    const renderOrcamentos = await fetch("https://orcamento-api-node.vercel.app/orcamento")
        .then((Response) => Response.json())
        .then((data) => {
            listaOrcamento.innerHTML = ""
            data.forEach((element) => {
                listaOrcamento.innerHTML += `<tr style="border-bottom: 1px solid grey; height: 40px;">
                 <td>${element.cliente}</td>
                <td>${element.veiculo}</td>
                <td>R$ ${Number(element.total).toFixed(2)}</td>
                <td>
                <i class="bi bi-pencil" onclick="editar('${element._id}')"></i> 
                <i class="bi bi-trash" onclick="deletar('${element._id}')"></i> 
                <i class="bi bi-file-arrow-down" onclick="gerarPDF('${element._id}')">
                </td>
            
                </tr>`
            });
        })
}

function criarServico() {
    const tbody = document.querySelector('#tabela-servicos')
    const newRow = tbody.insertRow();

    const itemCell = newRow.insertCell();
    itemCell.innerHTML = `<input type="text" placeholder="item" class="impItem">`;
    const descricaoCell = newRow.insertCell();
    descricaoCell.innerHTML = `<input type="text" placeholder="descrição" class="impDescricao">`;
    const valorCell = newRow.insertCell();
    valorCell.innerHTML = `<input type="text" placeholder="Preço" class="impValor">`;

}

async function salvar() {
    if (impVeiculo.value !== "" && impCor.value !== "" && impVeiculo.value !== "") {
        const servicosInputs = document.querySelectorAll('#tabela-servicos tr')
        const servicos = []

        servicosInputs.forEach(row => {
            const itemInput = row.querySelector('.impItem');
            const descricaoInput = row.querySelector('.impDescricao');
            const valorInput = row.querySelector('.impValor');

            if (itemInput && descricaoInput && valorInput) {
                servicos.push({
                    item: itemInput.value,
                    descricao: descricaoInput.value,
                    valor: parseFloat(valorInput.value) || 0
                })
            }
        })

        const total = servicos.reduce((acc, servico) => acc + (servico.valor || 0), 0);


        const orcamento = {
            veiculo: impVeiculo.value,
            cor: impCor.value,
            cliente: impCliente.value,
            servico: servicos,
            total: total

        }

        try {
            const response = await fetch('https://orcamento-api-node.vercel.app/orcamento', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orcamento),
            });

            if (response.ok) {
                alert('Adcionado com sucesso')
                return
            } else {
                alert('Erro ao salvar orcamento')
            }
        } catch (error) {
            console.log(error)
        }
    }
}

function resetar() {
    document.querySelector('#impVeiculo').value = ""
    document.querySelector('#impCor').value = ""
    document.querySelector('#impCliente').value = ""
}

async function gerarPDF(id) {
    try {
        // 1. Requisição para buscar o orçamento pelo ID
        const response = await fetch(`https://orcamento-api-node.vercel.app/orcamento/${id}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar orçamento");
        }
        const orcamento = await response.json();

        // 2. Gerar conteúdo HTML para o PDF
        const container = document.createElement('div');
        container.innerHTML = `
     <header>
            <h2>R.F.R Oficina, Funilaria e Pintura EIRELE - ME</h2>
            <p>Rua Boa Esperança, Nº 112, Centro Dias D’Ávila-BA CEP: 42.80-000 <br> Tel.(71) 9 8162-3273 EMAIL:
              oficinabelcarrfr@yahoo.com.br </br> CNPJ: 28.042.796/0001-64 - Inscrição Estadual - 141.459.169 ME
            </p>

            <span ><img class="logo" src="/src/images/logo.jpg" alt="logo-belcar"></span>
          </header >
          
            <h1>Orçamento</h1>

            <p><strong>Veículo:</strong> ${orcamento.veiculo}</p>
            <p><strong>Cor:</strong> ${orcamento.cor}</p>
            <p><strong>Cliente:</strong> ${orcamento.cliente}</p>

            <h2>Serviços</h2>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                ${orcamento.servico.map(item => `
                  <tr>
                    <td>${item.item}</td>
                    <td>${item.descricao}</td>
                    <td>R$ ${Number(item.valor).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" class="total">Total:</td>
                  <td class="total">R$ ${Number(orcamento.total).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            <footer>

                <span>Cliente</span>
                <span>Bel Car</span>

            </footer>
    `;

        // 3. Configurar o html2pdf.js
        const opt = {
            margin: 0.5,
            filename: `orcamento-${orcamento.cliente.replace(/\s+/g, '-')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // 4. Gerar o PDF
        html2pdf().set(opt).from(container).save();

    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        alert("Erro ao gerar PDF do orçamento");
    }
}

function encerrar() {
    const status = confirm("Deeseja Fechar janela?")

    if (status === true) {
        window.location.href = ('https://www.google.com.br')
        return
    }

}


function editar(posicao) {
    console.log(posicao)
}

async function deletar(id) {
    try {
        const response = await fetch(`https://orcamento-api-node.vercel.app/orcamento/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Erro ao deletar orçamento")
        }
        alert("Orçamento deletado com sucesso")
        renderOrcamentos()
    } catch (error) {
        console.error(error)
    }
}