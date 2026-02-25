import { useDashboardSummary } from "../hooks/useDashboardSummary";
import SummaryCard from "../components/SummaryCard";
import PageContainer from "../../../shared/ui/PageContainer";
import SectionCard from "../../../shared/ui/SectionCard";
import { formatDate } from "../../../shared/lib/formatDate";

function DashboardPage() {
  const { data, isLoading } = useDashboardSummary();

  return (
    <PageContainer
      title="Painel de Controle"
      subtitle={`Visão geral de hoje (${formatDate()})`}
    >
      <SectionCard title="Resumo do negócio">
        {isLoading ? (
          <p>Carregando dados...</p>
        ) : (
          <div className="summary-grid">
            <SummaryCard label="Pedidos em aberto" value={data.openOrders} />
            <SummaryCard label="Clientes ativos" value={data.totalCustomers} />
            <SummaryCard label="Faturamento hoje" value={data.revenueToday} />
          </div>
        )}
      </SectionCard>
    </PageContainer>
  );
}

export default DashboardPage;
