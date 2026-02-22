// =========================
//  STORAGE
// =========================
const STORAGE_KEYS = {
  clientes: 'clientes',
  ordens: 'ordens'
};

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// =========================
//  STATE
// =========================
let clientes = readStorage(STORAGE_KEYS.clientes, []);
let ordens = readStorage(STORAGE_KEYS.ordens, []);

// filtros em memória
let filtroMes = '';
let filtroData = '';
let buscaTexto = '';
let filtroPagamento = '';

// =========================
//  HELPERS
// =========================
function moneyBR(value) {
  const n = Number(value) || 0;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarDataHora(dataISO) {
  if (!dataISO) return '-';
  const data = new Date(dataISO);
  if (isNaN(data.getTime())) return '-';

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
}

function sameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function ordemEditavel(ordem) {
  // regra: se estiver PAGO, não pode editar
  return (ordem?.pagamentoStatus || 'Pendente') !== 'Pago';
}

function getOrdemStatusBadge(status) {
  const s = (status || '').trim();

  if (s === 'Concluído') return { cls: 'success', icon: 'fa-circle-check', label: 'Concluído' };
  if (s === 'Pendente') return { cls: 'warning', icon: 'fa-clock', label: 'Pendente' };
  if (s === 'Cancelado') return { cls: 'danger', icon: 'fa-circle-xmark', label: 'Cancelado' };
  return { cls: 'info', icon: 'fa-circle-info', label: s || '—' };
}

function getPagamentoBadge(pagamentoStatus) {
  const p = (pagamentoStatus || 'Pendente').trim();
  if (p === 'Pago') return { cls: 'success', icon: 'fa-money-bill-wave', label: 'Pago' };
  return { cls: 'warning', icon: 'fa-hourglass-half', label: 'Pendente' };
}

function normalizarPagamento(ordem) {
  // compatibilidade: se existirem ordens antigas, garante campos
  if (!ordem.pagamentoStatus) ordem.pagamentoStatus = 'Pendente';
  if (typeof ordem.formaPagamento !== 'string') ordem.formaPagamento = '';
}

// =========================
//  CLIENTES
// =========================
const formCliente = document.getElementById('formCliente');
const tabelaClientesBody = document.querySelector('#tabelaClientes tbody');
const clienteSelect = document.getElementById('clienteSelect');
const enderecoClienteInput = document.getElementById('enderecoCliente');

formCliente.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const email = document.getElementById('email').value.trim();
  const endereco = document.getElementById('endereco').value.trim();

  if (!nome || !telefone || !email || !endereco) {
    alert('Preencha todos os campos do cliente!');
    return;
  }

  clientes.push({
    id: Date.now(),
    nome,
    telefone,
    email,
    endereco
  });

  writeStorage(STORAGE_KEYS.clientes, clientes);
  renderizarClientes();
  atualizarSelectClientes();
  atualizarKPIs();
  formCliente.reset();
});

function renderizarClientes() {
  tabelaClientesBody.innerHTML = '';

  clientes.forEach(cliente => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${cliente.nome}</td>
      <td>${cliente.telefone}</td>
      <td>${cliente.email}</td>
      <td>${cliente.endereco}</td>
      <td>
        <div class="actions">
          <button class="btn" type="button" onclick="editarCliente(${cliente.id})">
            <i class="fa-solid fa-pen"></i> Editar
          </button>
          <button class="btn" type="button" onclick="excluirCliente(${cliente.id})">
            <i class="fa-solid fa-trash"></i> Excluir
          </button>
        </div>
      </td>
    `;
    tabelaClientesBody.appendChild(tr);
  });
}

function atualizarSelectClientes() {
  clienteSelect.innerHTML = '<option value="">Selecione um cliente</option>';

  clientes.forEach(cliente => {
    const option = document.createElement('option');
    option.value = cliente.nome;
    option.textContent = cliente.nome;
    option.dataset.endereco = cliente.endereco;
    clienteSelect.appendChild(option);
  });
}

clienteSelect.addEventListener('change', () => {
  const selectedOption = clienteSelect.options[clienteSelect.selectedIndex];
  const endereco = selectedOption?.dataset?.endereco || '';
  enderecoClienteInput.value = endereco;
});

window.editarCliente = function editarCliente(id) {
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) return;

  const novoNome = prompt('Editar nome:', cliente.nome);
  if (novoNome === null) return;

  const novoTelefone = prompt('Editar telefone:', cliente.telefone);
  if (novoTelefone === null) return;

  const novoEmail = prompt('Editar email:', cliente.email);
  if (novoEmail === null) return;

  const novoEndereco = prompt('Editar endereço:', cliente.endereco);
  if (novoEndereco === null) return;

  const nomeTrim = novoNome.trim();
  const telTrim = novoTelefone.trim();
  const emailTrim = novoEmail.trim();
  const endTrim = novoEndereco.trim();

  if (!nomeTrim || !telTrim || !emailTrim || !endTrim) {
    alert('Não deixe campos vazios.');
    return;
  }

  const nomeAntigo = cliente.nome;

  cliente.nome = nomeTrim;
  cliente.telefone = telTrim;
  cliente.email = emailTrim;
  cliente.endereco = endTrim;

  // atualiza ordens com o nome antigo
  ordens = ordens.map(o => {
    if (o.cliente === nomeAntigo) return { ...o, cliente: nomeTrim, endereco: endTrim };
    return o;
  });

  writeStorage(STORAGE_KEYS.clientes, clientes);
  writeStorage(STORAGE_KEYS.ordens, ordens);

  renderizarClientes();
  atualizarSelectClientes();
  renderizarOrdens();
  atualizarKPIs();
};

window.excluirCliente = function excluirCliente(id) {
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) return;

  const ok = confirm(`Tem certeza que deseja excluir o cliente "${cliente.nome}"?`);
  if (!ok) return;

  clientes = clientes.filter(c => c.id !== id);
  writeStorage(STORAGE_KEYS.clientes, clientes);

  renderizarClientes();
  atualizarSelectClientes();
  atualizarKPIs();
};

// =========================
//  ORDENS
// =========================
const formOrdem = document.getElementById('formOrdem');
const tabelaOrdensBody = document.querySelector('#tabelaOrdens tbody');

formOrdem.addEventListener('submit', (e) => {
  e.preventDefault();

  const cliente = document.getElementById('clienteSelect').value;
  const endereco = document.getElementById('enderecoCliente').value.trim();
  const servico = document.getElementById('servico').value;

  const valorRaw = document.getElementById('valor').value;
  const valor = Number(valorRaw);

  const tipo = document.getElementById('tipo').value;
  const dataHora = document.getElementById('dataHora').value;

  const responsavel = document.getElementById('responsavel').value.trim();
  const status = document.getElementById('statusOrdem').value;

  const concluidoPor = document.getElementById('concluidoPor').value.trim();
  const assinaturaCliente = document.getElementById('assinaturaCliente').value.trim();

  if (!cliente || !endereco || !servico || !valorRaw || !tipo || !dataHora || !responsavel || !status || !assinaturaCliente) {
    alert('Preencha todos os campos da ordem!');
    return;
  }

  const novaOrdem = {
    id: Date.now(),
    cliente,
    endereco,
    servico,
    valor: Number.isFinite(valor) ? Number(valor.toFixed(2)) : 0,
    tipo,
    dataHora,
    responsavel,
    assinaturaCliente,
    status,
    concluidoPor: concluidoPor || '',

    // PAGAMENTO (novos campos)
    pagamentoStatus: 'Pendente',
    formaPagamento: ''
  };

  ordens.push(novaOrdem);
  writeStorage(STORAGE_KEYS.ordens, ordens);

  formOrdem.reset();
  enderecoClienteInput.value = '';

  renderizarOrdens();
  atualizarKPIs();
});

window.excluirOrdem = function excluirOrdem(id) {
  const ordem = ordens.find(o => o.id === id);
  if (!ordem) return;

  const ok = confirm('Tem certeza que deseja excluir esta ordem?');
  if (!ok) return;

  ordens = ordens.filter(o => o.id !== id);
  writeStorage(STORAGE_KEYS.ordens, ordens);

  renderizarOrdens();
  atualizarKPIs();
};

window.editarOrdem = function editarOrdem(id) {
  const ordem = ordens.find(o => o.id === id);
  if (!ordem) return;

  normalizarPagamento(ordem);

  if (!ordemEditavel(ordem)) {
    alert('Esta ordem está PAGA e está bloqueada para edição.');
    return;
  }

  const novoServico = prompt('Editar serviço:', ordem.servico);
  if (novoServico === null) return;

  const novoValor = prompt('Editar valor (ex: 150.50):', String(ordem.valor));
  if (novoValor === null) return;

  const novaData = prompt('Editar data/hora (AAAA-MM-DDTHH:MM):', ordem.dataHora);
  if (novaData === null) return;

  const novoResponsavel = prompt('Responsável pela atividade:', ordem.responsavel);
  if (novoResponsavel === null) return;

  const novaAssinatura = prompt('Assinatura do cliente:', ordem.assinaturaCliente);
  if (novaAssinatura === null) return;

  const novoStatus = prompt('Status (Pendente, Concluído, Cancelado):', ordem.status);
  if (novoStatus === null) return;

  const novoConcluidoPor = prompt('Concluído por (opcional):', ordem.concluidoPor || '');
  if (novoConcluidoPor === null) return;

  const v = Number(String(novoValor).replace(',', '.'));
  if (!Number.isFinite(v)) {
    alert('Valor inválido.');
    return;
  }

  const statusLimpo = (novoStatus || '').trim();
  if (!['Pendente', 'Concluído', 'Cancelado'].includes(statusLimpo)) {
    alert('Status inválido. Use: Pendente, Concluído ou Cancelado.');
    return;
  }

  ordem.servico = novoServico.trim() || ordem.servico;
  ordem.valor = Number(v.toFixed(2));
  ordem.dataHora = novaData.trim() || ordem.dataHora;
  ordem.responsavel = novoResponsavel.trim() || ordem.responsavel;
  ordem.assinaturaCliente = novaAssinatura.trim() || ordem.assinaturaCliente;
  ordem.status = statusLimpo;
  ordem.concluidoPor = (novoConcluidoPor || '').trim();

  writeStorage(STORAGE_KEYS.ordens, ordens);
  renderizarOrdens();
  atualizarKPIs();
};

// ✅ NOVO: Alternar Pagamento (Pago/Pendente) + método
window.alternarPagamento = function alternarPagamento(id) {
  const ordem = ordens.find(o => o.id === id);
  if (!ordem) return;

  normalizarPagamento(ordem);

  if (ordem.pagamentoStatus === 'Pago') {
    const ok = confirm('Esta ordem está como PAGA. Deseja voltar para PENDENTE?');
    if (!ok) return;

    ordem.pagamentoStatus = 'Pendente';
    ordem.formaPagamento = '';
    writeStorage(STORAGE_KEYS.ordens, ordens);
    renderizarOrdens();
    return;
  }

  // Se está pendente, pede método
  const metodo = prompt('Forma de pagamento (Pix / Dinheiro / Cartão):', 'Pix');
  if (metodo === null) return;

  const m = metodo.trim().toLowerCase();
  let metodoFinal = '';

  if (m === 'pix') metodoFinal = 'Pix';
  else if (m === 'dinheiro') metodoFinal = 'Dinheiro';
  else if (m === 'cartao' || m === 'cartão') metodoFinal = 'Cartão';

  if (!metodoFinal) {
    alert('Forma inválida. Digite: Pix, Dinheiro ou Cartão.');
    return;
  }

  ordem.pagamentoStatus = 'Pago';
  ordem.formaPagamento = metodoFinal;

  writeStorage(STORAGE_KEYS.ordens, ordens);
  renderizarOrdens();
};

window.gerarPDF = function gerarPDF(id) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const ordem = ordens.find(o => o.id === id);
  if (!ordem) return;

  normalizarPagamento(ordem);

  // Moldura
  doc.setDrawColor(0);
  doc.setLineWidth(0.6);
  doc.rect(8, 8, 194, 281);

  // Cabeçalho
  doc.setFontSize(18);
  doc.text("ORDEM DE SERVIÇO", 105, 22, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.text("Loja de Ar Condicionado TGS", 105, 30, { align: "center" });
  doc.text("Av. Nossa Senhora do Desterro 185 - Uberaba/MG", 105, 36, { align: "center" });
  doc.text("Tel: (34) 99931-9991", 105, 42, { align: "center" });

  doc.setTextColor(0);
  doc.setLineWidth(0.3);
  doc.line(12, 48, 198, 48);

  // Dados
  const y0 = 58;
  const line = 9;

  doc.setFontSize(12);
  doc.text(`Cliente: ${ordem.cliente}`, 12, y0);
  doc.text(`Endereço: ${ordem.endereco}`, 12, y0 + line);
  doc.text(`Responsável: ${ordem.responsavel}`, 12, y0 + line * 2);
  doc.text(`Serviço: ${ordem.servico}`, 12, y0 + line * 3);

  doc.text(`Valor: ${moneyBR(ordem.valor)}`, 12, y0 + line * 4);
  doc.text(`Data/Hora: ${formatarDataHora(ordem.dataHora)}`, 12, y0 + line * 5);
  doc.text(`Tipo: ${ordem.tipo === 'entrada' ? 'Entrada' : 'Saída'}`, 12, y0 + line * 6);
  doc.text(`Status Ordem: ${ordem.status}`, 12, y0 + line * 7);

  // Pagamento
  doc.text(`Pagamento: ${ordem.pagamentoStatus}`, 12, y0 + line * 8);
  doc.text(`Método: ${ordem.formaPagamento || '-'}`, 12, y0 + line * 9);

  if (ordem.concluidoPor) {
    doc.text(`Concluído por: ${ordem.concluidoPor}`, 12, y0 + line * 10);
  }

  // Assinaturas
  const yAss = 185;
  doc.setLineWidth(0.3);
  doc.line(12, yAss, 96, yAss);
  doc.text("Assinatura do Cliente", 12, yAss + 7);

  doc.line(114, yAss, 198, yAss);
  doc.text("Assinatura do Responsável", 114, yAss + 7);

  // Rodapé
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.line(12, 286, 198, 286);
  doc.text("Documento gerado pelo sistema de Controle Financeiro - TGS", 105, 292, { align: "center" });

  doc.save(`ordem_${id}.pdf`);
};

// =========================
//  FILTROS + BUSCA
// =========================
const formFiltroMes = document.getElementById('formFiltroMes');
const formFiltroData = document.getElementById('formFiltroData');
const inputFiltroMes = document.getElementById('filtroMes');
const inputFiltroData = document.getElementById('filtroData');
const inputBuscaTexto = document.getElementById('buscaTexto');
const selectFiltroPagamento = document.getElementById('filtroPagamento');

const btnLimparFiltros = document.getElementById('btnLimparFiltros');
const btnMesAnterior = document.getElementById('btnMesAnterior');

formFiltroMes.addEventListener('submit', (e) => {
  e.preventDefault();
  filtroMes = inputFiltroMes.value || '';
  renderizarOrdens();
});

formFiltroData.addEventListener('submit', (e) => {
  e.preventDefault();
  filtroData = inputFiltroData.value || '';
  renderizarOrdens();
});

btnMesAnterior.addEventListener('click', () => {
  const hoje = new Date();
  const mesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
  const mes = String(mesAnterior.getMonth() + 1).padStart(2, '0');
  const ano = mesAnterior.getFullYear();
  filtroMes = `${ano}-${mes}`;
  inputFiltroMes.value = filtroMes;
  renderizarOrdens();
});

inputBuscaTexto.addEventListener('input', () => {
  buscaTexto = (inputBuscaTexto.value || '').trim().toLowerCase();
  renderizarOrdens();
});

selectFiltroPagamento.addEventListener('change', () => {
  filtroPagamento = selectFiltroPagamento.value || '';
  renderizarOrdens();
});

btnLimparFiltros.addEventListener('click', () => {
  filtroMes = '';
  filtroData = '';
  buscaTexto = '';
  filtroPagamento = '';

  inputFiltroMes.value = '';
  inputFiltroData.value = '';
  inputBuscaTexto.value = '';
  selectFiltroPagamento.value = '';

  renderizarOrdens();
});

// =========================
//  RENDER ORDENS + KPIs
// =========================
function aplicarFiltrosOrdens(lista) {
  let result = [...lista];

  // mês YYYY-MM
  if (filtroMes) {
    const [anoFiltro, mesFiltro] = filtroMes.split('-');
    result = result.filter(ordem => {
      const d = new Date(ordem.dataHora);
      if (isNaN(d.getTime())) return false;
      const mesOrdem = String(d.getMonth() + 1).padStart(2, '0');
      const anoOrdem = String(d.getFullYear());
      return anoOrdem === String(anoFiltro) && mesOrdem === String(mesFiltro);
    });
  }

  // data específica
  if (filtroData) {
    const dataSelecionada = new Date(filtroData);
    if (!isNaN(dataSelecionada.getTime())) {
      dataSelecionada.setHours(0, 0, 0, 0);
      result = result.filter(ordem => {
        const d = new Date(ordem.dataHora);
        if (isNaN(d.getTime())) return false;
        return sameDay(d, dataSelecionada);
      });
    }
  }

  // busca texto
  if (buscaTexto) {
    result = result.filter(ordem => {
      const hay = `${ordem.cliente} ${ordem.servico} ${ordem.responsavel} ${ordem.status}`.toLowerCase();
      return hay.includes(buscaTexto);
    });
  }

  // filtro pagamento
  if (filtroPagamento) {
    result = result.filter(ordem => {
      normalizarPagamento(ordem);
      return (ordem.pagamentoStatus || 'Pendente') === filtroPagamento;
    });
  }

  return result;
}

function renderizarOrdens() {
  tabelaOrdensBody.innerHTML = '';

  // garante compatibilidade em ordens antigas
  ordens.forEach(normalizarPagamento);

  const listaFiltrada = aplicarFiltrosOrdens(ordens);

  let totalEntrada = 0;
  let totalSaida = 0;

  listaFiltrada.forEach(ordem => {
    const valor = Number(ordem.valor) || 0;
    if (ordem.tipo === 'entrada') totalEntrada += valor;
    else totalSaida += valor;

    const badgeStatus = getOrdemStatusBadge(ordem.status);
    const badgePag = getPagamentoBadge(ordem.pagamentoStatus);

    const podeEditar = ordemEditavel(ordem);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${ordem.cliente || '-'}</td>
      <td>${ordem.responsavel || '-'}</td>
      <td>${ordem.servico || '-'}</td>
      <td>${moneyBR(valor)}</td>
      <td>${formatarDataHora(ordem.dataHora)}</td>
      <td>${ordem.tipo === 'entrada' ? '💰 Entrada' : '💸 Saída'}</td>

      <td>
        <span class="badge ${badgeStatus.cls}">
          <i class="fa-solid ${badgeStatus.icon}"></i> ${badgeStatus.label}
        </span>
      </td>

      <td>
        <span class="badge ${badgePag.cls}">
          <i class="fa-solid ${badgePag.icon}"></i> ${badgePag.label}
        </span>
      </td>

      <td>${ordem.formaPagamento || '-'}</td>

      <td>
        <div class="actions">
          <button class="btn" type="button" onclick="alternarPagamento(${ordem.id})">
            <i class="fa-solid fa-credit-card"></i> ${ordem.pagamentoStatus === 'Pago' ? 'Voltar Pendente' : 'Marcar Pago'}
          </button>

          <button class="btn" type="button" onclick="editarOrdem(${ordem.id})" ${!podeEditar ? 'disabled title="Ordem paga: edição bloqueada"' : ''}>
            <i class="fa-solid fa-pen"></i> Editar
          </button>

          <button class="btn" type="button" onclick="excluirOrdem(${ordem.id})">
            <i class="fa-solid fa-trash"></i> Excluir
          </button>

          <button class="btn" type="button" onclick="gerarPDF(${ordem.id})">
            <i class="fa-solid fa-file-pdf"></i> PDF
          </button>
        </div>
      </td>
    `;

    tabelaOrdensBody.appendChild(tr);
  });

  document.getElementById('totalEntrada').textContent = moneyBR(totalEntrada);
  document.getElementById('totalSaida').textContent = moneyBR(totalSaida);
  document.getElementById('saldo').textContent = moneyBR(totalEntrada - totalSaida);
}

function atualizarKPIs() {
  document.getElementById('kpiClientes').textContent = String(clientes.length);
  document.getElementById('kpiOrdens').textContent = String(ordens.length);
}

// =========================
//  LIMPAR DADOS
// =========================
document.getElementById('btnLimparDados').addEventListener('click', () => {
  const ok = confirm('Isso vai apagar TODOS os clientes e ordens do navegador. Deseja continuar?');
  if (!ok) return;

  clientes = [];
  ordens = [];

  writeStorage(STORAGE_KEYS.clientes, clientes);
  writeStorage(STORAGE_KEYS.ordens, ordens);

  filtroMes = '';
  filtroData = '';
  buscaTexto = '';
  filtroPagamento = '';

  document.getElementById('filtroMes').value = '';
  document.getElementById('filtroData').value = '';
  document.getElementById('buscaTexto').value = '';
  document.getElementById('filtroPagamento').value = '';

  renderizarClientes();
  atualizarSelectClientes();
  renderizarOrdens();
  atualizarKPIs();
});

// =========================
//  INIT
// =========================
renderizarClientes();
atualizarSelectClientes();
renderizarOrdens();
atualizarKPIs();