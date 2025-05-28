



const impVeiculo = document.getElementById('impVeiculo');
const impCor = document.getElementById('impCor');
const impCliente = document.getElementById('impCliente');
const impItem = document.querySelector('.impItem');
const impDescricao = document.querySelector('.impDescricao');
const impValor = document.querySelector('.impValor');
const impTotal = document.getElementById('impTotal')



function retornarHome() {
    window.location.href = ("/orcamentos.html")
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

