interface DashboardOverviewProps {
  totalProducts: number;
  availableProducts: number;
  promotedProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  ordersToday: number;
  operationalOrders: number;
  cancelledOrders: number;
  pendingPaymentOrders: number;
  revenueInCents: number;
  averageTicketInCents: number;
  onOpenProductModal: () => void;
  onOpenPromotionModal: () => void;
  onRefreshOverview: () => void;
  isRefreshingOverview: boolean;
}

function formatBrl(amountInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountInCents / 100);
}

export function DashboardOverview({
  totalProducts,
  availableProducts,
  promotedProducts,
  lowStockProducts,
  outOfStockProducts,
  ordersToday,
  operationalOrders,
  cancelledOrders,
  pendingPaymentOrders,
  revenueInCents,
  averageTicketInCents,
  onOpenProductModal,
  onOpenPromotionModal,
  onRefreshOverview,
  isRefreshingOverview,
}: DashboardOverviewProps) {
  return (
    <article className="dashboard-panel" aria-label="Visão geral">
      <div className="dashboard-products-header">
        <div>
          <h2>Visão geral</h2>
          <p className="dashboard-products-subtitle">
            Painel rápido para acompanhar cadastro de produtos, promoções e
            estoque.
          </p>
        </div>

        <div className="dashboard-products-actions dashboard-overview-actions">
          <button
            type="button"
            className="dashboard-secondary-button"
            onClick={onRefreshOverview}
            disabled={isRefreshingOverview}
          >
            {isRefreshingOverview ? "Atualizando..." : "Atualizar dados"}
          </button>
          <button
            type="button"
            className="dashboard-primary-button"
            onClick={onOpenProductModal}
          >
            Cadastrar produto
          </button>
          <button
            type="button"
            className="dashboard-primary-button"
            onClick={onOpenPromotionModal}
          >
            Aplicar promoção
          </button>
        </div>
      </div>

      <section className="overview-topic" aria-label="Tópico catálogo">
        <header className="overview-topic-header">
          <h3>Catálogo</h3>
          <p>Resumo rápido do que está disponível para venda.</p>
        </header>
        <div className="dashboard-grid">
          <article className="dashboard-card">
            <h2>Produtos cadastrados</h2>
            <strong>{totalProducts}</strong>
          </article>
          <article className="dashboard-card">
            <h2>Disponíveis</h2>
            <strong>{availableProducts}</strong>
          </article>
          <article className="dashboard-card">
            <h2>Promoções ativas</h2>
            <strong>{promotedProducts}</strong>
          </article>
        </div>
      </section>

      <section className="overview-topic" aria-label="Tópico pedidos">
        <header className="overview-topic-header">
          <h3>Pedidos</h3>
          <p>Pontos essenciais do fluxo operacional atual.</p>
        </header>
        <div className="dashboard-grid">
          <article className="dashboard-card">
            <h2>Pedidos hoje</h2>
            <strong>{ordersToday}</strong>
          </article>
          <article className="dashboard-card">
            <h2>Em operação</h2>
            <strong>{operationalOrders}</strong>
          </article>
          <article className="dashboard-card">
            <h2>Aguardando pagamento</h2>
            <strong>{pendingPaymentOrders}</strong>
          </article>
        </div>
      </section>

      <section className="overview-topic" aria-label="Tópico financeiro">
        <header className="overview-topic-header">
          <h3>Financeiro</h3>
          <p>Indicadores principais de faturamento e ticket.</p>
        </header>
        <div className="dashboard-grid">
          <article className="dashboard-card">
            <h2>Faturamento</h2>
            <strong>{formatBrl(revenueInCents)}</strong>
          </article>
          <article className="dashboard-card">
            <h2>Ticket médio</h2>
            <strong>{formatBrl(averageTicketInCents)}</strong>
          </article>
        </div>
      </section>

      <section className="overview-topic" aria-label="Tópico alertas">
        <header className="overview-topic-header">
          <h3>Alertas</h3>
          <p>Itens que merecem atenção imediata.</p>
        </header>
        <section className="status-grid" aria-label="Alertas de operação">
          <article className="status-card">
            <span>Sem estoque</span>
            <strong>{outOfStockProducts}</strong>
          </article>
          <article className="status-card">
            <span>Estoque baixo</span>
            <strong>{lowStockProducts}</strong>
          </article>
          <article className="status-card">
            <span>Cancelados</span>
            <strong>{cancelledOrders}</strong>
          </article>
        </section>
      </section>
    </article>
  );
}
