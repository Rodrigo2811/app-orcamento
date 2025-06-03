
// imputs orcamento
const listaOrcamento = document.querySelector('.listaOrcamentos');


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
                <i class="bi bi-pencil" data-bs-toggle="modal" data-bs-target="#editarOrcamento" onclick="editar('${element._id}')"></i> 
                <i class="bi bi-trash" onclick="deletar('${element._id}')"></i> 
                <i class="bi bi-file-arrow-down" onclick="gerarPDF('${element._id}')">
                </td>
            
                </tr>`
      });
    })
}

async function gerarPDF(id) {
  try {

    const response = await fetch(`https://orcamento-api-node.vercel.app/orcamento/${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar orçamento");
    }
    const orcamento = await response.json();

    //  Gerar conteúdo HTML para o PDF
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

    // Configurar o html2pdf.js
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
    window.location.href = ('/index.html')
    return
  }

}


async function editar(id) {

  const listaEdicao = document.querySelector("#tabela-servicos-Edit")
  listaEdicao.innerHTML = ""

  try {
    const response = await fetch(`https://orcamento-api-node.vercel.app/orcamento/${id}`)

    if (!response.ok) {
      throw new Error("Erro ao buscar orçamento para edição.")
    }
    const orcamento = await response.json()

    document.querySelector('#impEditVeiculo').value = orcamento.veiculo
    document.querySelector('#impEditCor').value = orcamento.cor
    document.querySelector('#impEditCliente').value = orcamento.cliente

    document.querySelector('#btnSalvarEdicao').setAttribute('data-orcamento-id', orcamento._id)

    orcamento.servico.map((item) => {
      listaEdicao.innerHTML += `
        <tr>
          <td> <input class="item-edit" value="${item.item}"></td>
          <td> <input class="descricao-edit" value="${item.descricao}"></td>
          <td><input class="valor-edit" value="R$ ${Number(item.valor).toFixed(2)}"></td>
            
        </tr>
      
      `


    })

  } catch (error) {
    console.error(error)
  }

}

async function salvarEdicao(id) {
  const veiculo = document.querySelector('#impEditVeiculo').value;
  const cor = document.querySelector('#impEditCor').value;
  const cliente = document.querySelector('#impEditCliente').value;

  const servicosEditados = [];
  const linhasServico = document.querySelectorAll("#tabela-servicos-Edit tr");

  linhasServico.forEach(linha => {
    const serviceId = linha.getAttribute('data-service-id'); // Pega o _id do serviço
    const item = linha.querySelector(".item-edit").value;
    const descricao = linha.querySelector(".descricao-edit").value;
    // Remove "R$" e substitui vírgula por ponto para parseFloat
    const valorString = linha.querySelector(".valor-edit").value.replace('R$', '').replace(',', '.').trim();
    const valor = parseFloat(valorString);

    if (item && descricao && !isNaN(valor)) {
      const service = {
        item,
        descricao,
        valor
      };
      // Adiciona o _id se ele existir (para itens existentes)
      if (serviceId) {
        service._id = serviceId;
      }
      servicosEditados.push(service);
    }
  });

  const total = servicosEditados.reduce((sum, service) => sum + service.valor, 0);

  const dadosAtualizados = {
    veiculo,
    cor,
    cliente,
    servico: servicosEditados,
    total
  };

  try {
    // Certifique-se de que o ID está sendo passado corretamente, se você estiver usando um botão de salvar
    // O 'id' no parâmetro da função deve vir do clique no botão de edição,
    // ou você pode pegar do atributo data-orcamento-id no botão de salvar.
    const orcamentoIdParaAtualizar = id || document.querySelector('#btnSalvarEdicao').getAttribute('data-orcamento-id');

    if (!orcamentoIdParaAtualizar) {
      throw new Error("ID do orçamento para atualização não encontrado.");
    }

    const response = await fetch(`https://orcamento-api-node.vercel.app/orcamento/${orcamentoIdParaAtualizar}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosAtualizados)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro desconhecido ao salvar edição.");
    }

    alert("Orçamento atualizado com sucesso!");
    const myModalEl = document.getElementById('editarOrcamento');
    const modal = bootstrap.Modal.getInstance(myModalEl);
    if (modal) {
      modal.hide();
    }

    renderOrcamentos(); // Recarrega a lista de orçamentos para mostrar as alterações
  } catch (error) {
    console.error("Erro ao salvar edição:", error);
    alert(`Erro ao salvar edição: ${error.message}`);
  }
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


