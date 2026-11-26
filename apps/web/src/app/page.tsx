const metrics = [
  { label: "Saída estimada do buffet", value: "84,6 kg", detail: "Dados demonstrativos" },
  { label: "Custo estimado", value: "R$ 1.248", detail: "Calculado por ingrediente" },
  { label: "Pedidos em andamento", value: "07", detail: "Recebidos + em preparo" },
  { label: "Mesas ocupadas", value: "12/20", detail: "60% de ocupação" }
];

const ingredients = [
  { name: "Carne assada", weight: "28,4 kg", cost: "R$ 908,80", status: "Monitorado" },
  { name: "Arroz branco", weight: "31,2 kg", cost: "R$ 265,20", status: "Monitorado" },
  { name: "Batata assada", weight: "25,0 kg", cost: "R$ 350,00", status: "Reposição" }
];

const orders = [
  { table: "M04", item: "Suco natural", time: "12:42", status: "Em preparo" },
  { table: "M08", item: "Água sem gás", time: "12:45", status: "Recebido" },
  { table: "M12", item: "Refrigerante lata", time: "12:47", status: "Recebido" }
];

export default function Home() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">quilo<span>.</span></div>
        <p className="eyebrow" style={{ marginTop: 8 }}>Controle inteligente</p>
        <nav className="nav" aria-label="Navegação principal">
          <a className="active" href="#visao-geral">▦ Visão geral</a>
          <a href="#buffet">◉ Buffet e pesagem</a>
          <a href="#pedidos">▤ Pedidos</a>
          <a href="#mesas">▦ Mapa de mesas</a>
          <a href="#equipe">♧ Equipe</a>
        </nav>
        <div style={{ marginTop: 42 }} className="card">
          <p className="eyebrow">Piloto</p>
          <p style={{ fontSize: 13, lineHeight: 1.5 }}>Comece com poucas cubas e mesas. Valide os dados antes de ampliar.</p>
        </div>
      </aside>

      <main className="main" id="visao-geral">
        <header className="topbar">
          <div>
            <p className="eyebrow">Painel do gestor / operação</p>
            <h1>Visão geral</h1>
            <p className="subtitle">Acompanhe buffet, salão e pedidos em um só lugar.</p>
          </div>
          <span className="pill">● AMBIENTE DE DEMONSTRAÇÃO</span>
        </header>

        <section className="grid" aria-label="Indicadores principais">
          {metrics.map((metric) => (
            <article className="card" key={metric.label}>
              <div className="card-label">{metric.label}</div>
              <div className="metric">{metric.value}</div>
              <div className="delta">{metric.detail}</div>
            </article>
          ))}
        </section>

        <div className="section-title" id="buffet">
          <h2>Saída por ingrediente</h2>
          <span>Exemplo fictício · turno almoço</span>
        </div>
        <section className="content-grid">
          <article className="card">
            <table className="table">
              <thead><tr><th>Ingrediente</th><th>Saída</th><th>Custo estimado</th><th>Situação</th></tr></thead>
              <tbody>
                {ingredients.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td><td>{item.weight}</td><td>{item.cost}</td>
                    <td><span className={item.status === "Reposição" ? "status warn" : "status"}>{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="notice">A balança mede a variação de peso da cuba. O valor não representa consumo individual nem confirma que o alimento chegou ao prato.</p>
          </article>

          <article className="card">
            <h2 style={{ fontSize: 14, margin: 0 }}>Distribuição ilustrativa da saída</h2>
            <div className="bars">
              <div className="bar-row"><span>Arroz</span><div className="track"><div className="fill" style={{ width: "78%" }} /></div><b>78%</b></div>
              <div className="bar-row"><span>Carne</span><div className="track"><div className="fill" style={{ width: "66%" }} /></div><b>66%</b></div>
              <div className="bar-row"><span>Batata</span><div className="track"><div className="fill" style={{ width: "52%" }} /></div><b>52%</b></div>
            </div>
            <p className="notice">Valores ilustrativos para demonstrar a visualização. Conectar ao PostgreSQL/Supabase para dados reais.</p>
          </article>
        </section>

        <div className="section-title" id="pedidos">
          <h2>Pedidos de bebidas</h2>
          <span>Atualização em tempo real prevista via Supabase Realtime</span>
        </div>
        <section className="card">
          <table className="table">
            <thead><tr><th>Mesa</th><th>Pedido</th><th>Horário</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.table}>
                  <td>{order.table}</td><td>{order.item}</td><td>{order.time}</td>
                  <td><span className={order.status === "Em preparo" ? "status warn" : "status gray"}>{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <p className="notice" id="mesas">Mapa de mesas, área da equipe, autenticação e integração com sensores serão conectados em etapas posteriores. Este painel utiliza somente dados fictícios.</p>
      </main>
    </div>
  );
}
