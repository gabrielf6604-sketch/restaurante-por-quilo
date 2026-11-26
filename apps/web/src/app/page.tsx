"use client";

import { useMemo, useState } from "react";

type Pedido = { id: string; mesa: string; item: string; hora: string; status: "Recebido" | "Em preparo" | "Pronto" | "Entregue" };
type Mesa = { id: string; lugares: number; status: "Livre" | "Ocupada" | "Limpeza" };

const initialPedidos: Pedido[] = [
  { id: "BV-001", mesa: "M04", item: "Suco de laranja", hora: "12:42", status: "Em preparo" },
  { id: "BV-002", mesa: "M08", item: "Água sem gás", hora: "12:45", status: "Recebido" },
  { id: "BV-003", mesa: "M12", item: "Refrigerante lata", hora: "12:47", status: "Pronto" },
  { id: "BV-004", mesa: "M02", item: "Suco de abacaxi", hora: "12:51", status: "Recebido" },
];
const initialMesas: Mesa[] = Array.from({ length: 12 }, (_, i) => ({
  id: "M" + String(i + 1).padStart(2, "0"),
  lugares: i === 4 || i === 8 ? 6 : 4,
  status: (["Ocupada", "Ocupada", "Livre", "Ocupada", "Limpeza", "Livre", "Ocupada", "Ocupada", "Livre", "Ocupada", "Livre", "Ocupada"][i]) as Mesa["status"],
}));
const buffet = [
  { nome: "Picanha na brasa", grupo: "Grelhados", peso: "18,4 kg", nivel: 72, status: "Disponível" },
  { nome: "Frango grelhado", grupo: "Grelhados", peso: "12,1 kg", nivel: 48, status: "Atenção" },
  { nome: "Arroz branco", grupo: "Acompanhamentos", peso: "21,8 kg", nivel: 86, status: "Disponível" },
  { nome: "Salada tropical", grupo: "Saladas", peso: "8,2 kg", nivel: 32, status: "Reposição" },
];
const menu = ["Visão geral", "Mapa de mesas", "Pedidos", "Buffet", "Equipe"];

export default function Home() {
  const [pagina, setPagina] = useState("Visão geral");
  const [pedidos, setPedidos] = useState(initialPedidos);
  const [mesas, setMesas] = useState(initialMesas);
  const [busca, setBusca] = useState("");
  const [aviso, setAviso] = useState("");
  const [novoPedido, setNovoPedido] = useState({ mesa: "M03", item: "Suco de laranja" });
  const ocupadas = mesas.filter((m) => m.status === "Ocupada").length;
  const emAberto = pedidos.filter((p) => p.status !== "Entregue").length;
  const pedidosFiltrados = useMemo(() => pedidos.filter((p) => (p.id + p.mesa + p.item).toLowerCase().includes(busca.toLowerCase())), [pedidos, busca]);

  function avancarPedido(id: string) {
    const fluxo: Pedido["status"][] = ["Recebido", "Em preparo", "Pronto", "Entregue"];
    setPedidos((lista) => lista.map((p) => {
      if (p.id !== id) return p;
      const status = fluxo[Math.min(fluxo.indexOf(p.status) + 1, fluxo.length - 1)];
      setAviso(id + " atualizado para: " + status);
      return { ...p, status };
    }));
  }
  function alterarMesa(id: string) {
    setMesas((lista) => lista.map((m) => {
      if (m.id !== id) return m;
      const status: Mesa["status"] = m.status === "Livre" ? "Ocupada" : m.status === "Ocupada" ? "Limpeza" : "Livre";
      setAviso(id + " agora está: " + (status === "Limpeza" ? "Aguardando limpeza" : status));
      return { ...m, status };
    }));
  }
  function criarPedido() {
    const id = "BV-" + String(pedidos.length + 1).padStart(3, "0");
    setPedidos((lista) => [{ id, mesa: novoPedido.mesa, item: novoPedido.item, hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), status: "Recebido" }, ...lista]);
    setAviso("Pedido " + id + " criado para a mesa " + novoPedido.mesa + ".");
    setPagina("Pedidos");
  }

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><span className="brand-symbol">B</span><span><b>BOVINU’S</b><small>GRILL & BEER · AUGUSTA</small></span></div>
      <p className="nav-caption">OPERAÇÃO DA UNIDADE</p>
      <nav>{menu.map((item, i) => <button key={item} onClick={() => { setPagina(item); setAviso(""); }} className={pagina === item ? "nav-link selected" : "nav-link"}><span>{["▦", "▤", "♧", "◉", "♙"][i]}</span>{item}</button>)}</nav>
      <div className="side-bottom"><span className="live-dot"/> Protótipo local<br/><small>Unidade Augusta · dados de exemplo</small></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="mobile-brand">BOVINU’S <span>· AUGUSTA</span></div><div className="crumb">Bovinu’s Grill & Beer <span>/</span> {pagina}</div><span className="demo-pill">● AMBIENTE DE DEMONSTRAÇÃO</span></header>
      {aviso && <div className="toast" role="status">{aviso}<button onClick={() => setAviso("")}>×</button></div>}

      {pagina === "Visão geral" && <section className="content">
        <div className="heading"><div><p className="eyebrow">UNIDADE AUGUSTA · OPERAÇÃO</p><h1>Visão geral</h1><p className="muted">Acompanhe o movimento e a operação do restaurante.</p></div><span className="shift">● Turno de almoço</span></div>
        <div className="metrics">
          <Metric label="Faturamento do dia" value="R$ 8.420,00" note="Valor fictício para demonstração" />
          <Metric label="Pedidos em aberto" value={String(emAberto).padStart(2, "0")} note="Pedidos de bebidas" />
          <Metric label="Mesas ocupadas" value={ocupadas + "/" + mesas.length} note={Math.round(ocupadas / mesas.length * 100) + "% de ocupação"} />
          <Metric label="Itens no buffet" value="04" note="Pesos demonstrativos" />
        </div>
        <div className="section-title"><div><h2>Movimento da unidade</h2><p>Resumo operacional da demonstração</p></div><button className="subtle-button" onClick={() => setPagina("Mapa de mesas")}>Abrir mapa de mesas →</button></div>
        <div className="two-columns">
          <article className="panel"><PanelHeader title="Pedidos recentes" subtitle="Acompanhe o preparo e a entrega" action="Ver pedidos" onClick={() => setPagina("Pedidos")}/>{pedidos.slice(0, 4).map((p) => <div className="order-row" key={p.id}><div className="order-icon">♧</div><div className="order-details"><b>{p.item}</b><small>{p.id} · Mesa {p.mesa} · {p.hora}</small></div><Status value={p.status}/></div>)}</article>
          <article className="panel"><PanelHeader title="Resumo do buffet" subtitle="Nível ilustrativo dos itens" action="Ver buffet" onClick={() => setPagina("Buffet")}/>{buffet.slice(0, 3).map((f) => <div className="stock" key={f.nome}><div><b>{f.nome}</b><span>{f.nivel}%</span></div><progress value={f.nivel} max="100"/><small>{f.status}</small></div>)}</article>
        </div>
        <div className="info-box"><b>Protótipo para validação com a equipe</b><p>Os números e nomes desta demonstração são fictícios. Use as telas para testar os fluxos e discutir como a operação da unidade deve funcionar.</p></div>
      </section>}

      {pagina === "Mapa de mesas" && <section className="content">
        <PageHeading eyebrow="SALÃO · UNIDADE AUGUSTA" title="Mapa de mesas" subtitle="Selecione uma mesa para avançar sua situação operacional."/>
        <div className="legend"><span><i className="free-dot"/> Livre</span><span><i className="busy-dot"/> Ocupada</span><span><i className="clean-dot"/> Aguardando limpeza</span></div>
        <div className="table-grid">{mesas.map((m) => <button key={m.id} className={"table-tile " + (m.status === "Livre" ? "free" : m.status === "Ocupada" ? "busy" : "clean")} onClick={() => alterarMesa(m.id)}><b>{m.id}</b><strong>{m.status === "Limpeza" ? "Aguardando limpeza" : m.status}</strong><small>{m.lugares} lugares</small><em>Clique para alterar</em></button>)}</div>
        <p className="footnote">Fluxo demonstrativo: Livre → Ocupada → Aguardando limpeza → Livre. Em uma operação real, a mesa só deve ser liberada após a equipe confirmar a limpeza.</p>
      </section>}

      {pagina === "Pedidos" && <section className="content">
        <PageHeading eyebrow="ATENDIMENTO · PEDIDOS" title="Pedidos de bebidas" subtitle="Simule pedidos e acompanhe cada etapa até a entrega."/>
        <article className="panel create-order"><div><h2>Novo pedido de demonstração</h2><p>Registre uma solicitação como se tivesse chegado pelo QR Code da mesa.</p></div><div className="create-controls"><select value={novoPedido.mesa} onChange={(e) => setNovoPedido({ ...novoPedido, mesa: e.target.value })} aria-label="Mesa do pedido">{mesas.map((m) => <option key={m.id} value={m.id}>{m.id}</option>)}</select><select value={novoPedido.item} onChange={(e) => setNovoPedido({ ...novoPedido, item: e.target.value })} aria-label="Bebida">{["Suco de laranja", "Suco de abacaxi", "Água sem gás", "Água com gás", "Refrigerante lata", "Cerveja sem álcool"].map((item) => <option key={item}>{item}</option>)}</select><button className="primary-button" onClick={criarPedido}>＋ Criar pedido</button></div></article>
        <div className="toolbar"><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por pedido, mesa ou bebida..." aria-label="Buscar pedidos"/><span>{pedidosFiltrados.length} pedidos</span></div>
        <div className="panel table-wrap"><table><thead><tr><th>CÓDIGO</th><th>MESA</th><th>PRODUTO</th><th>HORÁRIO</th><th>STATUS</th><th>AÇÃO</th></tr></thead><tbody>{pedidosFiltrados.map((p) => <tr key={p.id}><td><b>{p.id}</b></td><td>{p.mesa}</td><td>{p.item}</td><td>{p.hora}</td><td><Status value={p.status}/></td><td><button className="action-button" disabled={p.status === "Entregue"} onClick={() => avancarPedido(p.id)}>{p.status === "Pronto" ? "Marcar entregue" : p.status === "Entregue" ? "Concluído" : "Avançar etapa"}</button></td></tr>)}</tbody></table></div>
      </section>}

      {pagina === "Buffet" && <section className="content">
        <PageHeading eyebrow="BUFFET · MONITORAMENTO" title="Buffet e pesagem" subtitle="Acompanhe níveis ilustrativos e necessidades de reposição."/>
        <div className="food-grid">{buffet.map((f) => <article className="panel food-card" key={f.nome}><div className="food-top"><span>♨</span><Status value={f.status}/></div><small>{f.grupo}</small><h2>{f.nome}</h2><b className="weight">{f.peso}</b><progress value={f.nivel} max="100"/><p>Nível estimado: {f.nivel}%</p></article>)}</div>
        <div className="info-box"><b>O que a pesagem representa?</b><p>O sensor mede a variação de peso da cuba. Isso indica saída ou reposição de alimento no recipiente, não consumo individual confirmado por cliente.</p></div>
      </section>}

      {pagina === "Equipe" && <section className="content">
        <PageHeading eyebrow="PESSOAS · OPERAÇÃO" title="Equipe da unidade" subtitle="Exemplo de organização dos papéis no restaurante."/>
        <div className="team-grid">{[["MA","Mariana Alves","Gerente de salão","Salão"],["RC","Rafael Costa","Atendimento","Salão"],["JP","João Pedro","Bar e bebidas","Bar"],["LS","Lucas Santos","Cozinha","Cozinha"]].map((p) => <article className="panel team-card" key={p[0]}><span className="avatar">{p[0]}</span><div><b>{p[1]}</b><p>{p[2]}</p><small>{p[3]} · Perfil fictício</small></div></article>)}</div>
      </section>}
      <footer>Protótipo acadêmico e demonstrativo · Sem conexão com sistemas, sensores ou dados reais do Bovinu’S Grill & Beer.</footer>
    </main>
  </div>;
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) { return <article className="panel metric-card"><small>{label}</small><strong>{value}</strong><em>{note}</em></article>; }
function PageHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) { return <div className="heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="muted">{subtitle}</p></div></div>; }
function PanelHeader({ title, subtitle, action, onClick }: { title: string; subtitle: string; action: string; onClick: () => void }) { return <div className="panel-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="subtle-button" onClick={onClick}>{action}</button></div>; }
function Status({ value }: { value: string }) { return <span className={"status status-" + value.toLowerCase().replaceAll(" ", "-")}>{value}</span>; }
