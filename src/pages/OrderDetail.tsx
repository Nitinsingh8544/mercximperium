import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Package, CheckCircle2, Truck, Home, ClipboardList, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  product_title: string;
  product_image: string | null;
  product_price: number;
  product_currency: string;
  quantity: number;
  seller_name: string | null;
  total_amount: number;
  payment_method: string | null;
  shipping_address: string | null;
  status: string;
  cancelled_at: string | null;
  created_at: string;
}

const STATUS_FLOW = [
  { key: "ordered", label: "Ordered", icon: ClipboardList },
  { key: "packed", label: "Packed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      setOrder(data as Order | null);
      setLoading(false);
    })();
  }, [user, id]);

  const handleCancel = async () => {
    if (!order) return;
    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("id", order.id);
    if (error) {
      toast({ title: "Failed to cancel order", variant: "destructive" });
      return;
    }
    setOrder({ ...order, status: "cancelled", cancelled_at: new Date().toISOString() });
    toast({ title: "Order cancelled" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedHeader />
        <div className="pt-24 text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedHeader />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground mb-4">Order not found</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "delivered";
  const currentStepIndex = STATUS_FLOW.findIndex((s) => s.key === order.status);
  const canCancel = !isCancelled && !isDelivered && order.status !== "out_for_delivery";

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />
      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 max-w-3xl">
        <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <Card className="overflow-hidden mb-6">
          <div className="flex gap-4 p-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden bg-muted shrink-0">
              {order.product_image && (
                <img src={order.product_image} alt={order.product_title} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg font-semibold text-foreground line-clamp-2">{order.product_title}</h1>
              {order.seller_name && (
                <p className="text-xs text-muted-foreground mt-1">Seller: {order.seller_name}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">Qty: {order.quantity}</p>
              <p className="text-base font-bold text-secondary mt-2">
                {order.product_currency}{Number(order.total_amount).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Ordered on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-5">
            <h2 className="text-base font-semibold text-foreground mb-4">Order Status</h2>
            {isCancelled ? (
              <div className="flex items-center gap-3 text-destructive">
                <XCircle className="h-6 w-6" />
                <div>
                  <p className="font-medium">Order Cancelled</p>
                  {order.cancelled_at && (
                    <p className="text-xs text-muted-foreground">
                      on {new Date(order.cancelled_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <ol className="relative space-y-5">
                {STATUS_FLOW.map((step, idx) => {
                  const reached = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const Icon = step.icon;
                  return (
                    <li key={step.key} className="flex items-start gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          reached ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {reached ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <div className="pt-1">
                        <p
                          className={`text-sm font-medium ${
                            isCurrent ? "text-primary" : reached ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-muted-foreground">Current status</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </CardContent>
        </Card>

        {(order.payment_method || order.shipping_address) && (
          <Card className="mb-6">
            <CardContent className="p-5 space-y-3">
              {order.shipping_address && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Delivery Address</p>
                  <p className="text-sm text-foreground">{order.shipping_address}</p>
                </div>
              )}
              {order.payment_method && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
                  <p className="text-sm text-foreground capitalize">{order.payment_method}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {canCancel && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2">
                <XCircle className="h-4 w-4" /> Cancel Order
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Refunds (if any) will be credited back to the original payment method.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Order</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel}>Cancel Order</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
