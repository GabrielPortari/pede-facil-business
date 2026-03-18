import {
  OrderStatus,
  OrderStatusFilterValue,
  type BusinessOrder,
  type OrderStatusFilter,
} from "../types/order.type";

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PaymentPending]: "Pagamento pendente",
  [OrderStatus.PaidAwaitingDelivery]: "Pago, aguardando entrega",
  [OrderStatus.Delivered]: "Entregue",
  [OrderStatus.CustomerConfirmed]: "Confirmado pelo cliente",
  [OrderStatus.CustomerDeclined]: "Cliente não recebeu",
  [OrderStatus.CustomerCancelled]: "Cancelado pelo cliente",
  [OrderStatus.BusinessCancelled]: "Cancelado pelo estabelecimento",
};

const ORDER_STATUS_FILTER_OPTIONS: Array<{
  value: OrderStatusFilter;
  label: string;
}> = [
  { value: OrderStatusFilterValue.All, label: "Todos os status" },
  {
    value: OrderStatus.PaymentPending,
    label: ORDER_STATUS_LABELS[OrderStatus.PaymentPending],
  },
  {
    value: OrderStatus.PaidAwaitingDelivery,
    label: ORDER_STATUS_LABELS[OrderStatus.PaidAwaitingDelivery],
  },
  {
    value: OrderStatus.Delivered,
    label: ORDER_STATUS_LABELS[OrderStatus.Delivered],
  },
  {
    value: OrderStatus.CustomerConfirmed,
    label: ORDER_STATUS_LABELS[OrderStatus.CustomerConfirmed],
  },
  {
    value: OrderStatus.CustomerDeclined,
    label: ORDER_STATUS_LABELS[OrderStatus.CustomerDeclined],
  },
  {
    value: OrderStatus.CustomerCancelled,
    label: ORDER_STATUS_LABELS[OrderStatus.CustomerCancelled],
  },
  {
    value: OrderStatus.BusinessCancelled,
    label: ORDER_STATUS_LABELS[OrderStatus.BusinessCancelled],
  },
];

function formatOrderTimestamp(value: BusinessOrder["createdAt"]): string {
  const seconds = value?._seconds;
  const nanoseconds = value?._nanoseconds ?? 0;

  if (typeof seconds !== "number" || !Number.isFinite(seconds)) {
    return "-";
  }

  const timestampInMilliseconds =
    seconds * 1000 + Math.floor(nanoseconds / 1000000);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestampInMilliseconds));
}

function formatOrderTime(value: BusinessOrder["createdAt"]): string {
  const seconds = value?._seconds;
  const nanoseconds = value?._nanoseconds ?? 0;

  if (typeof seconds !== "number" || !Number.isFinite(seconds)) {
    return "-";
  }

  const timestampInMilliseconds =
    seconds * 1000 + Math.floor(nanoseconds / 1000000);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestampInMilliseconds));
}

interface OrdersPanelProps {
  orders: BusinessOrder[];
  isOrdersLoading: boolean;
  ordersError: string;
  onReloadOrders: () => void;
  orderStatusUpdateError: string;
  updatingOrderId: string | null;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  formatPrice: (amountInCents: number) => string;
  statusFilter: OrderStatusFilter;
  onStatusFilterChange: (value: OrderStatusFilter) => void;
  limit: number;
  onLimitChange: (value: number) => void;
}

interface OrderAction {
  label: string;
  description: string;
  nextStatus: OrderStatus;
  variant: "primary" | "danger";
}

function getOrderActionsByStatus(status: OrderStatus): OrderAction[] {
  if (status === OrderStatus.PaymentPending) {
    return [
      {
        label: "Marcar como pago",
        description: "Pagamento confirmado. Pedido segue para entrega.",
        nextStatus: OrderStatus.PaidAwaitingDelivery,
        variant: "primary",
      },
      {
        label: "Cancelar pedido",
        description: "Cancelar pedido com pagamento pendente.",
        nextStatus: OrderStatus.BusinessCancelled,
        variant: "danger",
      },
    ];
  }

  if (status === OrderStatus.PaidAwaitingDelivery) {
    return [
      {
        label: "Marcar como entregue",
        description:
          "Produto entregue ao cliente. Agora o cliente precisa confirmar o recebimento.",
        nextStatus: OrderStatus.Delivered,
        variant: "primary",
      },
      {
        label: "Cancelar pedido",
        description: "Cancelar pedido que estava aguardando entrega.",
        nextStatus: OrderStatus.BusinessCancelled,
        variant: "danger",
      },
    ];
  }

  if (status === OrderStatus.CustomerDeclined) {
    return [
      {
        label: "Cancelar pedido",
        description:
          "Cliente informou não recebimento. Cancele o pedido para finalizar o fluxo.",
        nextStatus: OrderStatus.BusinessCancelled,
        variant: "danger",
      },
    ];
  }

  return [];
}

export function OrdersPanel({
  orders,
  isOrdersLoading,
  ordersError,
  onReloadOrders,
  orderStatusUpdateError,
  updatingOrderId,
  onUpdateOrderStatus,
  formatPrice,
  statusFilter,
  onStatusFilterChange,
  limit,
  onLimitChange,
}: OrdersPanelProps) {
  return (
    <article className="dashboard-panel">
      <div className="dashboard-products-header">
        <div>
          <h2>Pedidos</h2>
          <p className="dashboard-products-subtitle">
            Lista de pedidos baseada no payload retornado pela API.
          </p>
        </div>

        <div className="dashboard-products-actions orders-filters">
          <div className="dashboard-filter-group orders-status-filter">
            <select
              className="orders-status-select"
              value={statusFilter}
              onChange={(event) =>
                onStatusFilterChange(event.target.value as OrderStatusFilter)
              }
              aria-label="Filtrar pedidos por status"
            >
              {ORDER_STATUS_FILTER_OPTIONS.map((statusOption) => (
                <option key={statusOption.value} value={statusOption.value}>
                  {statusOption.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field field-small orders-limit-field">
            <label htmlFor="orders-limit">Limite</label>
            <div className="orders-limit-select-wrap">
              <select
                id="orders-limit"
                className="orders-limit-select"
                value={limit}
                onChange={(event) => onLimitChange(Number(event.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            className="dashboard-secondary-button"
            onClick={onReloadOrders}
            disabled={isOrdersLoading}
          >
            {isOrdersLoading ? "Atualizando..." : "Atualizar lista"}
          </button>
        </div>
      </div>

      {ordersError ? (
        <div className="dashboard-products-feedback dashboard-products-feedback-error">
          <p>{ordersError}</p>
        </div>
      ) : null}

      {orderStatusUpdateError ? (
        <div className="dashboard-products-feedback dashboard-products-feedback-error">
          <p>{orderStatusUpdateError}</p>
        </div>
      ) : null}

      {!ordersError && isOrdersLoading ? (
        <div className="dashboard-products-feedback">
          <p>Carregando pedidos...</p>
        </div>
      ) : null}

      {!ordersError && !isOrdersLoading && !orders.length ? (
        <div className="dashboard-products-feedback">
          <p>Nenhum pedido encontrado.</p>
        </div>
      ) : null}

      {orders.length ? (
        <div className="orders-list">
          {orders.map((order) => {
            const orderActions = getOrderActionsByStatus(order.status);

            return (
              <article key={order.id} className="orders-card">
                <div className="orders-card-top">
                  <div>
                    <h3>Pedido {order.clientOrderId}</h3>
                  </div>
                  <span className="orders-status">
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>

                <dl className="orders-meta">
                  <div>
                    <dt>Cliente</dt>
                    <dd>{order.userName?.trim() || order.userId}</dd>
                  </div>
                  <div>
                    <dt>Hora do pedido</dt>
                    <dd>{formatOrderTime(order.createdAt)}</dd>
                  </div>
                  <div>
                    <dt>Método de pagamento</dt>
                    <dd>{order.paymentMethod}</dd>
                  </div>
                  <div>
                    <dt>Total</dt>
                    <dd>{formatPrice(order.totalPrice.amount)}</dd>
                  </div>
                </dl>

                <div className="orders-items">
                  <h4>Itens</h4>
                  <div className="orders-items-list">
                    {order.items.map((item) => (
                      <article
                        key={`${order.id}-${item.productId}-${item.name}`}
                        className="orders-item"
                      >
                        <p className="orders-item-title">{item.name}</p>
                        <dl>
                          <div>
                            <dt>Quantidade</dt>
                            <dd>{item.quantity}</dd>
                          </div>
                          <div>
                            <dt>Unitário</dt>
                            <dd>{formatPrice(item.unitPrice.amount)}</dd>
                          </div>
                          <div>
                            <dt>Subtotal</dt>
                            <dd>{formatPrice(item.subtotal.amount)}</dd>
                          </div>
                        </dl>
                      </article>
                    ))}
                  </div>
                </div>

                <dl className="orders-notes">
                  <div>
                    <dt>Observações</dt>
                    <dd>{order.observations ?? "-"}</dd>
                  </div>
                  <div>
                    <dt>Última atualização</dt>
                    <dd>{formatOrderTimestamp(order.updatedAt)}</dd>
                  </div>
                </dl>

                {orderActions.length ? (
                  <div className="orders-action-row">
                    <p className="orders-action-description">
                      {orderActions[0].description}
                    </p>

                    <div className="orders-action-buttons">
                      {orderActions.map((action) => (
                        <button
                          key={`${order.id}-${action.nextStatus}`}
                          type="button"
                          className={
                            action.variant === "danger"
                              ? "dashboard-danger-button"
                              : "dashboard-primary-button"
                          }
                          onClick={() =>
                            onUpdateOrderStatus(order.id, action.nextStatus)
                          }
                          disabled={updatingOrderId === order.id}
                        >
                          {updatingOrderId === order.id
                            ? "Atualizando..."
                            : action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : null}
    </article>
  );
}
