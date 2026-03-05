interface DashboardHeaderProps {
  onOpenProductModal: () => void;
  onOpenPromotionModal: () => void;
}

export function DashboardHeader({
  onOpenProductModal,
  onOpenPromotionModal,
}: DashboardHeaderProps) {
  return (
    <section className="dashboard-header">
      <div className="dashboard-header-top">
        <div>
          <h1>Dashboard da loja</h1>
          <p>Gerencie seu negócio e cadastre novos produtos.</p>
        </div>
        <div className="dashboard-header-actions">
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
    </section>
  );
}
