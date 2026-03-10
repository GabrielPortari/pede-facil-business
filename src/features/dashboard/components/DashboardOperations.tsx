const OPERATION_MENU = [
  { key: "overview", label: "Visão geral" },
  { key: "orders-status", label: "Status dos pedidos" },
  { key: "finalized-report", label: "Relatório de finalizados" },
  { key: "order-items", label: "Itens dos pedidos" },
  { key: "products", label: "Produtos cadastrados" },
  { key: "promotions", label: "Promoções ativas" },
] as const;

export function DashboardOperations() {
  return (
    <section className="dashboard-operations" aria-label="Operação">
      <aside className="operations-sidebar" aria-label="Menu de operações">
        <h2>Operações</h2>
        <nav>
          {OPERATION_MENU.map((menuItem) => (
            <button
              key={menuItem.key}
              type="button"
              className="operations-menu-item"
              disabled
            >
              {menuItem.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="operations-content">
        <article className="dashboard-panel">
          <h2>Módulos em preparação</h2>
          <p>
            Os menus de operações foram mantidos sem ações para implementação
            gradual de cada funcionalidade.
          </p>
        </article>
      </div>
    </section>
  );
}
