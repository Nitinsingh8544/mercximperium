import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";

interface ConfirmationOrder {
  id: string;
  product_title: string;
  product_image: string | null;
  product_price: number;
  product_currency: string;
  quantity: number;
  seller_name: string | null;
  total_amount: number;
  status: string;
  created_at: string;
}

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { orders?: ConfirmationOrder[]; total?: number } | null;
  const orders = state?.orders || [];
  const total = state?.total ?? orders.reduce((sum, order) => sum + Number(order.total_amount), 0);

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />
      <main className="container mx-auto max-w-3xl px-4 pb-12 pt-[100px] sm:px-6 sm:pt-24">
        <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate("/activity") }>
          <ArrowLeft className="h-4 w-4" /> Back to activity
        </Button>

        <section className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <p className="mb-1 text-sm font-medium text-primary">Payment confirmed</p>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Your order is placed</h1>
          <p className="mt-2 text-sm text-muted-foreground">We’ll keep you updated as each item moves through delivery.</p>
        </section>

        <Card className="mb-4">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-foreground">Order summary</h2>
                <p className="text-xs text-muted-foreground">{orders.length} item{orders.length === 1 ? "" : "s"} ordered</p>
              </div>
              <Package className="h-5 w-5 text-secondary" />
            </div>

            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center gap-3 border-t border-border pt-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                      {order.product_image && (
                        <img src={order.product_image} alt={order.product_title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{order.product_title}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty {order.quantity}{order.seller_name ? ` · ${order.seller_name}` : ""}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-foreground">
                      {order.product_currency || "₹"}{Number(order.total_amount).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <ShoppingBag className="mx-auto mb-2 h-8 w-8" />
                Your order details are available in Activity.
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="font-semibold text-foreground">Total paid</span>
              <span className="text-lg font-bold text-secondary">₹{Number(total).toLocaleString("en-IN")}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="outline" onClick={() => navigate("/activity")}>Track your orders</Button>
          <Button onClick={() => navigate("/dashboard")}>Continue shopping</Button>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;