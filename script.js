let topicos = JSON.parse(localStorage.getItem("topicos")) || [];

/* SALVAR */
function salvar() {
  localStorage.setItem("topicos", JSON.stringify(topicos));
}

/* CRIAR TÓPICO */
function criarTopico() {
  const titulo = document.getElementById("titulo").value;
  const conteudo = document.getElementById("conteudo").value;
  const autorInput = document.getElementById("autor");
  const autor = autorInput ? autorInput.value || "Anônimo" : "Anônimo";

  if (!titulo || !conteudo) {
    alert("Preencha todos os campos");
    return;
  }

  topicos.unshift({
    id: Date.now(),
    titulo,
    conteudo,
    autor,
    data: new Date().toLocaleString(),
    comentarios: [],
    likes: 0
  });

  salvar();
  location.reload();
}

/* LISTAR TÓPICOS */
function listarTopicos() {
  const area = document.getElementById("topicos");
  if (!area) return;

  area.innerHTML = "";

  topicos.forEach(t => {
    area.innerHTML += `
      <div class="card">
        <h3>${t.titulo}</h3>
        <p>${t.conteudo.substring(0, 100)}...</p>
        <small>👤 ${t.autor} • ${t.data}</small>

        <div class="acoes">
          <span>💬 ${t.comentarios.length}</span>
          <button onclick="curtir(${t.id})">❤️ ${t.likes}</button>
          <a href="topic.html?id=${t.id}">Ver tópico</a>
          <button onclick="apagarTopico(${t.id})">🗑</button>
        </div>
      </div>
    `;
  });
}

/* CURTIR */
function curtir(id) {
  const t = topicos.find(t => t.id === id);
  if (!t) return;

  t.likes++;
  salvar();
  listarTopicos();
}

/* BUSCAR */
function buscar() {
  const termo = document.getElementById("busca").value.toLowerCase();
  const area = document.getElementById("topicos");
  area.innerHTML = "";

  topicos
    .filter(t => t.titulo.toLowerCase().includes(termo))
    .forEach(t => {
      area.innerHTML += `
        <div class="card">
          <h3>${t.titulo}</h3>
          <p>${t.conteudo.substring(0, 100)}...</p>
          <small>👤 ${t.autor} • ${t.data}</small>

          <div class="acoes">
            <span>💬 ${t.comentarios.length}</span>
            <button onclick="curtir(${t.id})">❤️ ${t.likes}</button>
            <a href="topic.html?id=${t.id}">Ver tópico</a>
          </div>
        </div>
      `;
    });
}

/* ORDENAR */
function ordenar(tipo) {
  if (tipo === "curtidos") {
    topicos.sort((a, b) => b.likes - a.likes);
  } else {
    topicos.sort((a, b) => b.id - a.id);
  }

  salvar();
  listarTopicos();
}

/* CARREGAR TÓPICO */
function carregarTopico() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const topico = topicos.find(t => t.id === id);
  if (!topico) return;

  const area = document.getElementById("conteudo-topico");
  if (!area) return;

  area.innerHTML = `
    <div class="card">
      <h2>${topico.titulo}</h2>
      <p>${topico.conteudo}</p>
      <small>👤 ${topico.autor} • ${topico.data}</small><br><br>
      <button onclick="curtir(${topico.id})">❤️ ${topico.likes}</button>
    </div>
  `;

  topico.comentarios.forEach(c => {
    area.innerHTML += `
      <div class="card">
        <p>${c.texto}</p>
        <small>${c.data}</small>
      </div>
    `;
  });
}

/* COMENTAR */
function comentar() {
  const texto = document.getElementById("comentario").value;
  if (!texto) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const topico = topicos.find(t => t.id === id);
  if (!topico) return;

  topico.comentarios.push({
    texto,
    data: new Date().toLocaleString()
  });

  salvar();
  location.reload();
}

/* APAGAR */
function apagarTopico(id) {
  if (!confirm("Tem certeza que deseja apagar este tópico?")) return;

  topicos = topicos.filter(t => t.id !== id);
  salvar();
  listarTopicos();
}

/* INICIAR */
listarTopicos();
carregarTopico();
