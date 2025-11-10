let numerosUsados = JSON.parse(localStorage.getItem("numerosUsados") || "[]");

const colaboradores = [
  { numero: 1, nome: "Tayane" },
  { numero: 2, nome: "Cris" },
  { numero: 3, nome: "Ionara" },
  { numero: 4, nome: "Gabi" },
  { numero: 5, nome: "Mateus" },
  { numero: 6, nome: "Brenda" },
  { numero: 7, nome: "Adelar" },
  { numero: 8, nome: "Cecília" },
  { numero: 9, nome: "Poly" },
  { numero: 10, nome: "Jaqueline" },
  { numero: 11, nome: "Rafael" },
  { numero: 12, nome: "Salu" },
  { numero: 13, nome: "Leandro" },
  { numero: 14, nome: "Clari" },
  { numero: 15, nome: "Brenda" },
  { numero: 16, nome: "Marina" },
  { numero: 17, nome: "Elton" },
  { numero: 18, nome: "Bruno" },
  { numero: 19, nome: "Lidiane" },
  { numero: 20, nome: "Milena" },
  { numero: 21, nome: "Josefa" },
  { numero: 22, nome: "Bruna" },
  { numero: 23, nome: "Ferrari" },
];

let usuarioAtual = null;
let colaboradorSelecionado = null;

function sortearAmigos() {
  let valido = false;

  while (!valido) {
    const disponiveis = [...colaboradores];
    valido = true;

    for (let i = 0; i < colaboradores.length; i++) {
      const atual = colaboradores[i];

      // Filtra os disponíveis excluindo o próprio
      const candidatos = disponiveis.filter(c => c.nome !== atual.nome);

      if (candidatos.length === 0) {
        valido = false;
        break; // reinicia o sorteio
      }

      // Sorteia um candidato aleatório
      const escolhido = candidatos[Math.floor(Math.random() * candidatos.length)];
      atual.amigo = escolhido.nome;

      // Remove o escolhido da lista de disponíveis
      const index = disponiveis.findIndex(c => c.nome === escolhido.nome);
      disponiveis.splice(index, 1);
    }
  }
}

function entrar() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!nome || !email) {
    alert("Preencha nome e e-mail.");
    return;
  }

  const colaborador = colaboradores.find(c => c.nome.toLowerCase() === nome.toLowerCase());
  if (!colaborador) {
    alert("Nome não autorizado. Apenas colaboradores cadastrados podem participar.");
    return;
  }

  const participantes = JSON.parse(localStorage.getItem("participantes") || "[]");
  if (participantes.find(p => p.email === email)) {
    alert("Você já participou!");
    return;
  }

  const numeroDoUsuario = colaborador.numero;
  usuarioAtual = { nome: colaborador.nome, email };

  document.getElementById("login").classList.add("hidden");
  document.getElementById("jogo").classList.remove("hidden");

  atualizarLista(participantes);

  const container = document.getElementById("buttons-container");
  container.innerHTML = "";
  colaboradores.forEach(colab => {
    if (
      !numerosUsados.includes(colab.numero) &&
      colab.numero !== numeroDoUsuario
    ) {
      const btn = document.createElement("button");
      btn.className = "numero";
      btn.textContent = colab.numero;
      btn.setAttribute("data-numero", colab.numero);
      btn.onclick = () => revelar(colab);
      container.appendChild(btn);
    }
  });
}

function atualizarLista(participantes) {
  const ul = document.getElementById("lista-participantes");
  ul.innerHTML = "";
  participantes.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.nome} (${p.email})`;
    ul.appendChild(li);
  });
}

function revelar(colab) {
  colaboradorSelecionado = colab;

  numerosUsados.push(colab.numero);
  localStorage.setItem("numerosUsados", JSON.stringify(numerosUsados));

  const participantes = JSON.parse(localStorage.getItem("participantes") || "[]");
  participantes.push(usuarioAtual);
  localStorage.setItem("participantes", JSON.stringify(participantes));
  atualizarLista(participantes);

  document.getElementById("jogo").classList.add("hidden");
  document.getElementById("resultado").classList.remove("hidden");

  const colaboradorLogado = colaboradores.find(c => c.nome === usuarioAtual.nome);

  document.getElementById("mensagem").innerHTML = `
    Nome: <strong>${usuarioAtual.nome}</strong><br>
    E-mail: <strong>${usuarioAtual.email}</strong><br>
    Número escolhido: <strong>${colab.numero}</strong><br>
    Seu amigo secreto é: <strong>${colaboradorLogado.amigo}</strong>
  `;

  gerarPDF();
}

function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const colaboradorLogado = colaboradores.find(c => c.nome === usuarioAtual.nome);

  doc.setFontSize(16);
  doc.text(`Nome: ${usuarioAtual.nome}`, 10, 20);
  doc.text(`E-mail: ${usuarioAtual.email}`, 10, 30);
  doc.text(`Número escolhido: ${colaboradorSelecionado.numero}`, 10, 40);
  doc.text(`Amigo secreto: ${colaboradorLogado.amigo}`, 10, 50);

  doc.save(`amigo_secreto_${usuarioAtual.nome}.pdf`);
}

function solicitarReset() {
  const senha = prompt("Digite a senha para resetar:");
  if (senha === "ghrdh27w@secreto") {
    localStorage.removeItem("participantes");
    localStorage.removeItem("numerosUsados");
    alert("Sorteio resetado com sucesso!");
    location.reload();
  } else {
    alert("Senha incorreta. Reset cancelado.");
  }
}

// Inicialização
sortearAmigos();
const participantesIniciais = JSON.parse(localStorage.getItem("participantes") || "[]");
atualizarLista(participantesIniciais);
