

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

        const total = parseFloat(impTotal.value)


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
        const response = await fetch(`https://orcamento-api-node.vercel.app/orcamento/${id}`, {
            method: "GET"
        })

        if (!response.ok) {
            const erroText = await response.text()
            throw new Error("Erro ao gerar PDF: " + response.status - erroText);
        }
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a')
        a.href = url;
        a.download = `orcamento-${id}.pdf`;
        document.body.appendChild(a)
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url)
    } catch (error) {
        console.error("Erro ao tentar gerar PDF: ", error);
        alert('Erro ao gerar pdf do orçamento')

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