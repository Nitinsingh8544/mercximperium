import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderRow {
  product_title: string;
  product_image?: string | null;
  product_price: number;
  product_currency?: string;
  quantity: number;
  seller_name?: string | null;
  total_amount: number;
  payment_method?: string | null;
  shipping_address?: string | null;
}

interface Body {
  action: 'create' | 'cancel';
  order_id?: string;
  orders?: OrderRow[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing auth' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const ANON = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!;
    const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const userClient = createClient(SUPABASE_URL, ANON, { global: { headers: { Authorization: authHeader } } });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const body = (await req.json()) as Body;
    const admin = createClient(SUPABASE_URL, SERVICE);
    const ok = (p: unknown) => new Response(JSON.stringify(p), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    const fail = (m: string, status = 400) => new Response(JSON.stringify({ error: m }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    if (body.action === 'create') {
      if (!Array.isArray(body.orders) || body.orders.length === 0) return fail('No orders');
      const sanitized = body.orders.slice(0, 50).map((o) => {
        const price = Number(o.product_price);
        const qty = Math.max(1, Math.min(999, Math.floor(Number(o.quantity) || 1)));
        if (!Number.isFinite(price) || price < 0) throw new Error('Invalid price');
        const total = Number(o.total_amount);
        return {
          user_id: user.id,
          product_title: String(o.product_title || '').slice(0, 300),
          product_image: o.product_image ? String(o.product_image).slice(0, 1000) : null,
          product_price: price,
          product_currency: (o.product_currency || '₹').slice(0, 5),
          quantity: qty,
          seller_name: o.seller_name ? String(o.seller_name).slice(0, 200) : null,
          total_amount: Number.isFinite(total) && total >= 0 ? total : price * qty,
          payment_method: o.payment_method ? String(o.payment_method).slice(0, 50) : null,
          shipping_address: o.shipping_address ? String(o.shipping_address).slice(0, 2000) : null,
          status: 'ordered',
        };
      });

      const { data, error } = await admin.from('orders').insert(sanitized).select();
      if (error) return fail(error.message);
      return ok({ success: true, orders: data });
    }

    if (body.action === 'cancel' && body.order_id) {
      const { data: existing } = await admin.from('orders').select('user_id, status').eq('id', body.order_id).maybeSingle();
      if (!existing) return fail('Not found', 404);
      if (existing.user_id !== user.id) return fail('Forbidden', 403);
      if (existing.status === 'delivered' || existing.status === 'cancelled') return fail(`Cannot cancel ${existing.status} order`);
      const { error } = await admin.from('orders').update({ status: 'cancelled', cancelled_at: new Date().toISOString() }).eq('id', body.order_id);
      if (error) return fail(error.message);
      return ok({ success: true });
    }

    return fail('Unknown action');
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
