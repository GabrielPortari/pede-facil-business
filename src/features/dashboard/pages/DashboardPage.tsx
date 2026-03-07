import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  DashboardHeader,
  DashboardOperations,
  DashboardSummary,
  ProductModal,
  PromotionModal,
} from "../components";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useUpdateProductPromotion } from "../hooks/useUpdateProductPromotion";
import type { PromotionType } from "../types/product.type";
import "./DashboardPage.css";

function formatPriceInput(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  const normalizedDigits = digits.replace(/^0+(?=\d)/, "");
  const integerRaw = normalizedDigits.slice(0, -2);
  const integerPart = integerRaw.replace(/^0+(?=\d)/, "") || "0";
  const decimalPart = normalizedDigits.slice(-2).padStart(2, "0");

  return `R$ ${integerPart},${decimalPart}`;
}

function parsePriceToCents(formattedPrice: string): number {
  const digits = formattedPrice.replace(/\D/g, "");

  if (!digits) {
    return Number.NaN;
  }

  return Number(digits);
}

function formatPercentageInput(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, "");

  if (!digits) {
    return "0";
  }

  const normalizedDigits = digits.replace(/^0+(?=\d)/, "");

  if (!normalizedDigits) {
    return "0";
  }

  const value = Math.min(100, Math.max(0, Number(normalizedDigits)));
  return String(value);
}

function formatCentsToBrl(amountInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountInCents / 100);
}

const MOCK_REGISTERED_PRODUCTS = [
  {
    id: "prod-001",
    name: "Café preto",
    priceInCents: 1099,
    useStock: true,
    stock: 12,
  },
  {
    id: "prod-002",
    name: "Cappuccino",
    priceInCents: 2450,
    useStock: true,
    stock: 6,
  },
  {
    id: "prod-003",
    name: "Mocha",
    priceInCents: 800,
    useStock: false,
    stock: 0,
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [available, setAvailable] = useState(true);
  const [useStock, setUseStock] = useState(false);
  const [stock, setStock] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [promotionProductId, setPromotionProductId] = useState("");
  const [promotionType, setPromotionType] =
    useState<PromotionType>("percentage");
  const [promotionPercentage, setPromotionPercentage] = useState("0");
  const [promotionAmount, setPromotionAmount] = useState("R$ 0,00");
  const [usePromotionStock, setUsePromotionStock] = useState(false);
  const [promotionStock, setPromotionStock] = useState("");
  const [isPromotionSubmitted, setIsPromotionSubmitted] = useState(false);

  const {
    isLoading,
    serverError,
    successMessage,
    submitProduct,
    setSuccessMessage,
  } = useCreateProduct();

  const {
    isLoading: isPromotionLoading,
    serverError: promotionServerError,
    successMessage: promotionSuccessMessage,
    submitPromotion,
    setSuccessMessage: setPromotionSuccessMessage,
  } = useUpdateProductPromotion();

  const parsedPrice = parsePriceToCents(price);
  const parsedStock = Number(stock);
  const parsedPromotionPercentage = Number(promotionPercentage);
  const parsedPromotionAmount = parsePriceToCents(promotionAmount);
  const parsedPromotionStock = Number(promotionStock);

  const isProductNameValid = Boolean(name.trim());
  const isProductPriceValid = Number.isInteger(parsedPrice) && parsedPrice >= 0;
  const isProductStockValid =
    !useStock || (Number.isInteger(parsedStock) && parsedStock >= 0);
  const isProductFormValid =
    isProductNameValid && isProductPriceValid && isProductStockValid;

  const selectedPromotionProduct = MOCK_REGISTERED_PRODUCTS.find(
    (product) => product.id === promotionProductId,
  );
  const hasRealStockControl = Boolean(selectedPromotionProduct?.useStock);
  const isPromotionProductSelected = Boolean(selectedPromotionProduct);

  const isPromotionPercentageValid =
    Number.isInteger(parsedPromotionPercentage) &&
    parsedPromotionPercentage >= 0 &&
    parsedPromotionPercentage <= 100;

  const isPromotionAmountValid =
    Number.isInteger(parsedPromotionAmount) &&
    parsedPromotionAmount >= 0 &&
    (selectedPromotionProduct
      ? parsedPromotionAmount <= selectedPromotionProduct.priceInCents
      : false);

  const isPromotionStockValid =
    !usePromotionStock ||
    (Number.isInteger(parsedPromotionStock) &&
      parsedPromotionStock >= 0 &&
      (!hasRealStockControl ||
        parsedPromotionStock <= (selectedPromotionProduct?.stock ?? 0)));

  const isPromotionDiscountValid =
    promotionType === "percentage"
      ? isPromotionPercentageValid
      : isPromotionAmountValid;

  const isPromotionFormValid =
    isPromotionProductSelected &&
    isPromotionDiscountValid &&
    isPromotionStockValid;

  const nameError =
    isSubmitted && !name.trim() ? "Informe o nome do produto." : "";
  const priceError =
    isSubmitted && (!Number.isInteger(parsedPrice) || parsedPrice < 0)
      ? "Informe um preço válido no formato BRL."
      : "";
  const stockError =
    isSubmitted &&
    useStock &&
    (!Number.isInteger(parsedStock) || parsedStock < 0)
      ? "Informe um estoque válido."
      : "";

  const promotionProductIdError =
    isPromotionSubmitted && !promotionProductId.trim()
      ? "Selecione um produto."
      : "";

  const promotionPercentageError =
    isPromotionSubmitted &&
    promotionType === "percentage" &&
    (!Number.isInteger(parsedPromotionPercentage) ||
      parsedPromotionPercentage < 0 ||
      parsedPromotionPercentage > 100)
      ? "Informe uma porcentagem entre 0 e 100."
      : "";

  const promotionAmountError =
    isPromotionSubmitted &&
    promotionType === "fixed" &&
    (!Number.isInteger(parsedPromotionAmount) ||
      parsedPromotionAmount < 0 ||
      (selectedPromotionProduct
        ? parsedPromotionAmount > selectedPromotionProduct.priceInCents
        : false))
      ? "O valor fixo não pode ser maior que o preço original do produto."
      : "";

  const promotionStockError =
    isPromotionSubmitted &&
    usePromotionStock &&
    (!Number.isInteger(parsedPromotionStock) ||
      parsedPromotionStock < 0 ||
      (hasRealStockControl &&
        parsedPromotionStock > (selectedPromotionProduct?.stock ?? 0)))
      ? hasRealStockControl
        ? "O estoque promocional não pode ser maior que o estoque real do produto."
        : "Informe um estoque promocional válido."
      : "";

  const discountedPriceInCents = selectedPromotionProduct
    ? promotionType === "percentage" && !promotionPercentageError
      ? Math.max(
          0,
          selectedPromotionProduct.priceInCents -
            Math.round(
              (selectedPromotionProduct.priceInCents *
                parsedPromotionPercentage) /
                100,
            ),
        )
      : promotionType === "fixed" && !promotionAmountError
        ? Math.max(
            0,
            selectedPromotionProduct.priceInCents - parsedPromotionAmount,
          )
        : null
    : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
    setSuccessMessage("");

    if (
      nameError ||
      priceError ||
      stockError ||
      isLoading ||
      !isProductFormValid
    ) {
      return;
    }

    const result = await submitProduct({
      name: name.trim(),
      description: description.trim() || undefined,
      price: {
        amount: parsedPrice,
        currency: "BRL",
      },
      imageUrl: imageUrl.trim() || undefined,
      available,
      useStock,
      stock: useStock ? parsedStock : undefined,
    });

    if (result.ok) {
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setAvailable(true);
      setUseStock(false);
      setStock("");
      setIsSubmitted(false);
      setIsProductModalOpen(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    navigate("/login", { replace: true });
  }

  async function handlePromotionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPromotionSubmitted(true);
    setPromotionSuccessMessage("");

    const hasPromotionErrors = Boolean(
      promotionProductIdError ||
      promotionPercentageError ||
      promotionAmountError ||
      promotionStockError,
    );

    if (hasPromotionErrors || isPromotionLoading || !isPromotionFormValid) {
      return;
    }

    const payload = {
      active: true,
      type: promotionType,
      percentage:
        promotionType === "percentage" ? parsedPromotionPercentage : undefined,
      amount:
        promotionType === "fixed"
          ? { amount: parsedPromotionAmount, currency: "BRL" }
          : undefined,
      usePromotionStock,
      promotionStock: usePromotionStock ? parsedPromotionStock : undefined,
    };

    const result = await submitPromotion(promotionProductId.trim(), payload);

    if (result.ok) {
      setPromotionProductId("");
      setPromotionType("percentage");
      setPromotionPercentage("0");
      setPromotionAmount("R$ 0,00");
      setUsePromotionStock(false);
      setPromotionStock("");
      setIsPromotionSubmitted(false);
      setIsPromotionModalOpen(false);
    }
  }

  return (
    <main className="dashboard-page">
      <DashboardHeader
        onOpenProductModal={() => setIsProductModalOpen(true)}
        onOpenPromotionModal={() => setIsPromotionModalOpen(true)}
        onLogout={handleLogout}
      />

      <DashboardSummary />

      <DashboardOperations />

      <ProductModal
        isOpen={isProductModalOpen}
        isLoading={isLoading}
        serverError={serverError}
        successMessage={successMessage}
        name={name}
        description={description}
        price={price}
        imageUrl={imageUrl}
        available={available}
        useStock={useStock}
        stock={stock}
        nameError={nameError}
        priceError={priceError}
        stockError={stockError}
        isProductFormValid={isProductFormValid}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleSubmit}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onPriceChange={(value) => setPrice(formatPriceInput(value))}
        onImageUrlChange={setImageUrl}
        onAvailableChange={setAvailable}
        onUseStockChange={setUseStock}
        onStockChange={setStock}
      />

      <PromotionModal
        isOpen={isPromotionModalOpen}
        isLoading={isPromotionLoading}
        serverError={promotionServerError}
        successMessage={promotionSuccessMessage}
        promotionProductId={promotionProductId}
        promotionType={promotionType}
        promotionPercentage={promotionPercentage}
        promotionAmount={promotionAmount}
        usePromotionStock={usePromotionStock}
        promotionStock={promotionStock}
        promotionProductIdError={promotionProductIdError}
        promotionPercentageError={promotionPercentageError}
        promotionAmountError={promotionAmountError}
        promotionStockError={promotionStockError}
        hasRealStockControl={hasRealStockControl}
        selectedPromotionProduct={selectedPromotionProduct}
        discountedPriceInCents={discountedPriceInCents}
        isPromotionFormValid={isPromotionFormValid}
        products={MOCK_REGISTERED_PRODUCTS}
        onClose={() => setIsPromotionModalOpen(false)}
        onSubmit={handlePromotionSubmit}
        onProductChange={setPromotionProductId}
        onTypeChange={(value) => {
          setPromotionType(value);
          setPromotionPercentage("0");
          setPromotionAmount("R$ 0,00");
        }}
        onPercentageChange={(value) =>
          setPromotionPercentage(formatPercentageInput(value))
        }
        onAmountChange={(value) => setPromotionAmount(formatPriceInput(value))}
        onUsePromotionStockChange={setUsePromotionStock}
        onPromotionStockChange={setPromotionStock}
        formatCentsToBrl={formatCentsToBrl}
      />
    </main>
  );
}
