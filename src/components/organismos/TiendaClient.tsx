import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card";
import Button from "../atomos/Button";
import { ShoppingBag, Plus, Minus, Trash2, MessageCircle } from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

const products: Product[] = [
  {
    id: "remera",
    name: "Remera Simi Sumaq",
    description: "Remera de algodon con el logo de la Asociacion.",
    price: 8000,
    image: "https://picsum.photos/seed/simisumaq-remera/640/480",
  },
  {
    id: "taza",
    name: "Taza Solidaria",
    description: "Taza ceramica con frase inspiradora.",
    price: 6500,
    image: "https://picsum.photos/seed/simisumaq-taza/640/480",
  },
  {
    id: "gorra",
    name: "Gorra Bordada",
    description: "Gorra ajustable con bordado frontal.",
    price: 9000,
    image: "https://picsum.photos/seed/simisumaq-gorra/640/480",
  },
  {
    id: "bolsa",
    name: "Bolsa Ecologica",
    description: "Bolsa reutilizable para tus compras solidarias.",
    price: 4500,
    image: "https://picsum.photos/seed/simisumaq-bolsa/640/480",
  },
];

const TiendaClient: React.FC = () => {
  const [cart, setCart] = React.useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const changeQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSendWhatsApp = () => {
    if (cart.length === 0) return;

    const lines = cart.map(
      (item, index) =>
        `${index + 1}. ${item.product.name} x ${item.quantity} - $${
          item.product.price * item.quantity
        }`
    );

    const message =
      "Hola! Me gustaria hacer un pedido de merchandising de la Asociacion Simi Sumaq:\n\n" +
      lines.join("\n") +
      `\n\nTotal aproximado: $${totalAmount}\n\n` +
      "Por favor, me pueden confirmar disponibilidad y formas de pago?\n\nMuchas gracias.";

    const phone = "543855063501";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (
    <div className="py-12 md:py-16 space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-textoTitle mb-4">
          Tienda Solidaria
        </h2>
        <p className="text-lg text-muted-foreground">
          Elegi los productos que mas te gusten, arma tu pedido y envianos un
          mensaje por WhatsApp para coordinar el pago y la entrega. Tu compra
          nos ayuda a seguir acompanando a mas familias.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.8fr,1fr] gap-6 items-start">
        <div className="grid sm:grid-cols-2 gap-4 md:gap-5 justify-items-center">
          {products.map((product) => (
            <Card
              key={product.id}
              className="w-full max-w-[320px] shadow-[0_8px_22px_-18px_rgba(15,23,42,0.35)] hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)] transition-shadow border-primary-border/45 rounded-xl flex flex-col"
            >
              <div className="p-3 pb-0">
                <div className="overflow-hidden rounded-lg border border-primary-border/30 bg-primary-bg-claro">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              <CardHeader className="p-4 pb-2.5">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-xl leading-tight">
                    {product.name}
                  </CardTitle>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-bg-claro px-2.5 py-1 text-xs font-semibold text-primary-100">
                    <ShoppingBag className="h-4 w-4" />
                    Merch
                  </span>
                </div>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>

              <CardContent className="px-4 pb-3 pt-0">
                <p className="text-xl font-bold text-primary-200">
                  ${product.price.toLocaleString("es-AR")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Monto de referencia. Confirmamos el total por WhatsApp.
                </p>
              </CardContent>

              <CardFooter className="px-4 pb-4 pt-0 mt-auto">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center text-sm md:text-base gap-2"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingBag className="h-5 w-5" />
                  Agregar al pedido
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card className="shadow-[0_8px_24px_-18px_rgba(15,23,42,0.35)] border-primary-border/50 rounded-xl sticky top-24">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-xl">Tu pedido</CardTitle>
            <CardDescription>
              Revisa los productos antes de enviar tu mensaje.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-4 pt-0">
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Todavia no agregaste productos. Elegi algo de la tienda para
                comenzar tu pedido.
              </p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-start justify-between gap-3 border-b border-primary-border/30 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="font-semibold text-primary-textoTitle">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${item.product.price.toLocaleString("es-AR")} c/u
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Subtotal: $
                        {(item.product.price * item.quantity).toLocaleString(
                          "es-AR"
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="inline-flex items-center rounded-full bg-primary-bg-claro px-2 py-1 gap-1">
                        <button
                          type="button"
                          className="p-1 rounded-full hover:bg-white text-primary-texto"
                          onClick={() => changeQuantity(item.product.id, -1)}
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="p-1 rounded-full hover:bg-white text-primary-texto"
                          onClick={() => changeQuantity(item.product.id, 1)}
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 px-5 pb-5 pt-4 border-t border-primary-border/45">
            <div className="flex items-center justify-between w-full pt-3">
              <div className="text-sm text-muted-foreground">
                <p>
                  Productos:{" "}
                  <span className="font-semibold text-primary-textoTitle">
                    {totalItems}
                  </span>
                </p>
                <p>
                  Total estimado:{" "}
                  <span className="font-semibold text-primary-200 text-lg">
                    ${totalAmount.toLocaleString("es-AR")}
                  </span>
                </p>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-red-500 underline"
                  onClick={clearCart}
                >
                  Vaciar pedido
                </button>
              )}
            </div>

            <Button
              type="button"
              variant="green"
              size="lg"
              className="w-full justify-center text-sm md:text-base gap-2"
              disabled={cart.length === 0}
              onClick={handleSendWhatsApp}
            >
              <MessageCircle className="h-5 w-5" />
              Enviar pedido por WhatsApp
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Al hacer clic se abrira WhatsApp con el detalle del pedido para
              que puedas escribirnos y coordinar el pago. No se realiza ningun
              cobro automatico desde la web.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TiendaClient;

