interface DashboardOverviewProps {
  totalProducts: number;
  availableProducts: number;
  unavailableProducts: number;
  promotedProducts: number;
  productsWithoutPromotion: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  noStockControlProducts: number;
  onOpenProductModal: () => void;
  onOpenPromotionModal: () => void;
  onRefreshProducts: () => void;
  isRefreshingProducts: boolean;
}

export function DashboardOverview({
  totalProducts,
  availableProducts,
  unavailableProducts,
  promotedProducts,
  productsWithoutPromotion,
  lowStockProducts,
  outOfStockProducts,
  noStockControlProducts,
  onOpenProductModal,
  onOpenPromotionModal,
  onRefreshProducts,
  isRefreshingProducts,
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
            onClick={onRefreshProducts}
            disabled={isRefreshingProducts}
          >
            {isRefreshingProducts ? "Atualizando..." : "Atualizar dados"}
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

      <section className="dashboard-grid" aria-label="Indicadores principais">
        <article className="dashboard-card">
          <h2>Produtos cadastrados</h2>
          <strong>{totalProducts}</strong>
        </article>
        <article className="dashboard-card">
          <h2>Disponíveis</h2>
          <strong>{availableProducts}</strong>
        </article>
        <article className="dashboard-card">
          <h2>Indisponíveis</h2>
          <strong>{unavailableProducts}</strong>
        </article>
        <article className="dashboard-card">
          <h2>Promoções ativas</h2>
          <strong>{promotedProducts}</strong>
        </article>
      </section>

      <section className="status-grid" aria-label="Saúde do catálogo">
        <article className="status-card">
          <span>Sem promoção</span>
          <strong>{productsWithoutPromotion}</strong>
        </article>
        <article className="status-card">
          <span>Estoque baixo</span>
          <strong>{lowStockProducts}</strong>
        </article>
        <article className="status-card">
          <span>Sem estoque</span>
          <strong>{outOfStockProducts}</strong>
        </article>
        <article className="status-card">
          <span>Sem controle de estoque</span>
          <strong>{noStockControlProducts}</strong>
        </article>
      </section>
    </article>
  );
}
