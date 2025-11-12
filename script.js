const combinacoesFixas = [
  { nome: "Tayane", amigo: "Cristina" },
  { nome: "Cristina", amigo: "Ionara" },
  { nome: "Ionara", amigo: "Gabriela" },
  { nome: "Gabriela", amigo: "Mateus" },
  { nome: "Mateus", amigo: "Brenda" },
  { nome: "Brenda", amigo: "Adelar" },
  { nome: "Adelar", amigo: "Cecília" },
  { nome: "Cecília", amigo: "Poliany" },
  { nome: "Poliany", amigo: "Jaqueline" },
  { nome: "Jaqueline", amigo: "Rafael" },
  { nome: "Rafael", amigo: "Celimar Salu" },
  { nome: "Celimar Salu", amigo: "Leandro" },
  { nome: "Leandro", amigo: "Clari" },
  { nome: "Clari", amigo: "Marina" },
  { nome: "Marina", amigo: "Elton" },
  { nome: "Elton", amigo: "Bruno" },
  { nome: "Bruno", amigo: "Lidiane" },
  { nome: "Lidiane", amigo: "Milena" },
  { nome: "Milena", amigo: "Bruna Jaqueline" },
  { nome: "Bruna Jaqueline", amigo: "Ferrari" },
  { nome: "Ferrari", amigo: "Tayane" }
];

// Senhas fixas geradas aleatoriamente
const senhas = {
  "Tayane": "4821",
  "Cristina": "1937",
  "Ionara": "7264",
  "Gabriela": "8502",
  "Mateus": "6149",
  "Brenda": "2058",
  "Adelar": "7391",
  "Cecília": "9183",
  "Poliany": "3472",
  "Jaqueline": "5620",
  "Rafael": "1346",
  "Celimar Salu": "7810",
  "Leandro": "4065",
  "Clari": "9982",
  "Marina": "2304",
  "Elton": "6701",
  "Bruno": "5893",
  "Lidiane": "7430",
  "Milena": "3127",
  "Bruna Jaqueline": "8659",
  "Ferrari": "1094"
};

let usuarioAtual = null;

function entrar() {
  const nome = document.getElementById("nome").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!nome || !senha) {
    alert("Preencha nome e senha.");
    return;
  }

  const par = combinacoesFixas.find(p => p.nome.toLowerCase() === nome.toLowerCase());
  if (!par) {
    alert("Nome não encontrado nas combinações.");
    return;
  }

  const senhaCorreta = senhas[par.nome];
  if (senha !== senhaCorreta) {
    alert("Senha incorreta.");
    return;
  }

  const participantes = JSON.parse(localStorage.getItem("participantes") || "[]");
  if (participantes.find(p => p.nome === par.nome)) {
    alert("Você já participou!");
    return;
  }

  usuarioAtual = { nome: par.nome };
  const amigoSecreto = par.amigo;

  participantes.push(usuarioAtual);
  localStorage.setItem("participantes", JSON.stringify(participantes));

  document.getElementById("login").classList.add("hidden");
  document.getElementById("resultado").classList.remove("hidden");

  document.getElementById("mensagem").innerHTML = `
    Nome: <strong>${usuarioAtual.nome}</strong><br>
    Seu amigo secreto é: <strong>${amigoSecreto}</strong>
  `;

  gerarPDF(amigoSecreto);
  atualizarLista();
}

function gerarPDF(amigo) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(`Nome: ${usuarioAtual.nome}`, 10, 20);
  doc.text(`Amigo secreto: ${amigo}`, 10, 30);

  doc.save(`amigo_secreto_${usuarioAtual.nome}.pdf`);
}

function solicitarReset() {
  const senha = prompt("Digite a senha para resetar:");
  if (senha === "ghrdh27w@secreto") {
    localStorage.removeItem("participantes");
    alert("Sistema resetado com sucesso!");
    location.reload();
  } else {
    alert("Senha incorreta. Reset cancelado.");
  }
}

function atualizarLista() {
  const participantes = JSON.parse(localStorage.getItem("participantes") || "[]");
  const ul = document.getElementById("lista-participantes");
  ul.innerHTML = "";
  participantes.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.nome}`;
    ul.appendChild(li);
  });
}

// Inicialização
atualizarLista();
