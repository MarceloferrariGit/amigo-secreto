const combinacoesFixas = [
  { nome: "Tayane", amigo: "Elton" },
  { nome: "Cristina", amigo: "Milena" },
  { nome: "Ionara", amigo: "Mateus" },
  { nome: "Gabriela", amigo: "Ferrari" },
  { nome: "Mateus", amigo: "Gabriela" },
  { nome: "Brenda", amigo: "Cristina" },
  { nome: "Adelar", amigo: "Poliany" },
  { nome: "Cecília", amigo: "Bruno" },
  { nome: "Poliany", amigo: "Brenda" },
  { nome: "Jaqueline", amigo: "Cecília" },
  { nome: "Rafael", amigo: "Jaqueline" },
  { nome: "Celimar Salu", amigo: "Clari" },
  { nome: "Leandro", amigo: "Rafael" },
  { nome: "Clari", amigo: "Celimar Salu" },
  { nome: "Marina", amigo: "Ionara" },
  { nome: "Elton", amigo: "Lidiane" },
  { nome: "Bruno", amigo: "Tayane" },
  { nome: "Lidiane", amigo: "Leandro" },
  { nome: "Milena", amigo: "Adelar" },
  { nome: "Bruna Jaqueline", amigo: "Marina" },
  { nome: "Ferrari", amigo: "Bruna Jaqueline" }
];

let usuarioAtual = null;

function entrar() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!nome || !email) {
    alert("Preencha nome e e-mail.");
    return;
  }

  const par = combinacoesFixas.find(p => p.nome.toLowerCase() === nome.toLowerCase());
  if (!par) {
    alert("Nome não encontrado nas combinações.");
    return;
  }

  const participantes = JSON.parse(localStorage.getItem("participantes") || "[]");
  if (participantes.find(p => p.email === email)) {
    alert("Você já participou!");
    return;
  }

  usuarioAtual = { nome: par.nome, email };
  const amigoSecreto = par.amigo;

  participantes.push(usuarioAtual);
  localStorage.setItem("participantes", JSON.stringify(participantes));

  document.getElementById("login").classList.add("hidden");
  document.getElementById("resultado").classList.remove("hidden");

  document.getElementById("mensagem").innerHTML = `
    Nome: <strong>${usuarioAtual.nome}</strong><br>
    E-mail: <strong>${usuarioAtual.email}</strong><br>
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
  doc.text(`E-mail: ${usuarioAtual.email}`, 10, 30);
  doc.text(`Amigo secreto: ${amigo}`, 10, 40);

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
    li.textContent = `${p.nome} (${p.email})`;
    ul.appendChild(li);
  });
}

// Inicialização
atualizarLista();
