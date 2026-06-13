import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Body {
  action: 'create' | 'activate' | 'place_bid' | 'end_auction' | 'update';
  item_id?: string;
  stream_id?: number;
  bid_amount?: number;
  data?: Record<string, unknown>;
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

    const ok = (payload: unknown) => new Response(JSON.stringify(payload), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    const fail = (msg: string, status = 400) => new Response(JSON.stringify({ error: msg }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    if (body.action === 'create') {
      const d = body.data || {};
      const { data, error } = await admin.from('auction_items').insert({ ...d, seller_id: user.id }).select().single();
      if (error) return fail(error.message);
      return ok({ success: true, item: data });
    }

    if (body.action === 'update' && body.item_id) {
      const { data: existing } = await admin.from('auction_items').select('seller_id').eq('id', body.item_id).maybeSingle();
      if (!existing) return fail('Not found', 404);
      if (existing.seller_id && existing.seller_id !== user.id) return fail('Forbidden', 403);
      const { data, error } = await admin.from('auction_items').update(body.data || {}).eq('id', body.item_id).select().single();
      if (error) return fail(error.message);
      return ok({ success: true, item: data });
    }

    if (body.action === 'activate' && body.item_id) {
      const { data: item } = await admin.from('auction_items').select('*').eq('id', body.item_id).maybeSingle();
      if (!item) return fail('Not found', 404);
      const now = new Date();
      const endsAt = new Date(now.getTime() + (item.auction_duration_seconds || 60) * 1000);
      const { data, error } = await admin.from('auction_items').update({
        status: 'active', auction_started_at: now.toISOString(), auction_ends_at: endsAt.toISOString(),
      }).eq('id', body.item_id).select().single();
      if (error) return fail(error.message);
      return ok({ success: true, item: data });
    }

    if (body.action === 'place_bid' && body.item_id && typeof body.bid_amount === 'number') {
      const { data: item } = await admin.from('auction_items').select('*').eq('id', body.item_id).maybeSingle();
      if (!item) return fail('Not found', 404);
      if (item.status !== 'active') return fail('Auction not active');
      const minNext = Number(item.current_price) + Number(item.min_increment);
      if (body.bid_amount < minNext) return fail(`Minimum bid is ₹${minNext}`);
      if (item.auction_ends_at && new Date(item.auction_ends_at) < new Date()) return fail('Auction ended');

      const { data: profile } = await admin.from('profiles').select('username').eq('user_id', user.id).maybeSingle();
      const username = profile?.username || user.email?.split('@')[0] || 'User';

      const { error: bidErr } = await admin.from('bid_history').insert({
        auction_item_id: body.item_id, user_id: user.id, username, bid_amount: body.bid_amount,
      });
      if (bidErr) return fail(bidErr.message);

      await admin.from('auction_items').update({ current_price: body.bid_amount }).eq('id', body.item_id);
      return ok({ success: true });
    }

    if (body.action === 'end_auction' && body.item_id) {
      const { data: item } = await admin.from('auction_items').select('*').eq('id', body.item_id).maybeSingle();
      if (!item) return fail('Not found', 404);
      // Only the seller (or system after expiry) may end
      const expired = item.auction_ends_at && new Date(item.auction_ends_at) <= new Date();
      if (!expired && item.seller_id && item.seller_id !== user.id) return fail('Forbidden', 403);

      const { data: lastBidRows } = await admin.from('bid_history').select('*')
        .eq('auction_item_id', body.item_id).order('created_at', { ascending: false }).limit(1);
      const lastBid = lastBidRows?.[0];

      await admin.from('auction_items').update({
        status: 'sold', winner_user_id: lastBid?.user_id || null,
      }).eq('id', body.item_id);

      if (lastBid) {
        await admin.from('auction_bids').insert({
          user_id: lastBid.user_id, stream_id: item.stream_id,
          item_name: item.item_name, item_image: item.item_image, item_description: item.item_description,
          bid_amount: item.current_price, is_winning: true,
          seller_name: item.seller_name, seller_image: item.seller_image,
        });
      }
      return ok({ success: true });
    }

    return fail('Unknown action');
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
