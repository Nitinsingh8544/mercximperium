import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Body {
  action: 'add_money' | 'spend' | 'withdraw' | 'apply_credits' | 'earn_credits';
  amount: number;
  payment_method?: string;
  reference?: string;
  description?: string;
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
    const amt = Number(body.amount);
    if (!body.action || !Number.isFinite(amt) || amt <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const admin = createClient(SUPABASE_URL, SERVICE);

    // Ensure credits row exists
    let { data: row } = await admin.from('user_credits').select('*').eq('user_id', user.id).maybeSingle();
    if (!row) {
      const inserted = await admin.from('user_credits').insert({ user_id: user.id, balance: 1000, wallet_balance: 0 }).select('*').single();
      row = inserted.data;
    }
    if (!row) {
      return new Response(JSON.stringify({ error: 'Account init failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const wallet = Number(row.wallet_balance) || 0;
    const credits = Number(row.balance) || 0;

    if (body.action === 'add_money') {
      const newBal = wallet + Math.round(amt);
      await admin.from('user_credits').update({ wallet_balance: newBal }).eq('user_id', user.id);
      const { data: tx } = await admin.from('wallet_transactions').insert({
        user_id: user.id, type: 'credit', amount: Math.round(amt),
        description: body.description || `Wallet top-up of ₹${amt.toLocaleString()}`,
        payment_method: body.payment_method || null, reference: body.reference || null,
        balance_after: newBal,
      }).select().single();
      return new Response(JSON.stringify({ success: true, balance: newBal, transaction: tx }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (body.action === 'spend' || body.action === 'withdraw') {
      if (amt > wallet) {
        return new Response(JSON.stringify({ error: 'Insufficient balance' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const newBal = wallet - amt;
      await admin.from('user_credits').update({ wallet_balance: newBal }).eq('user_id', user.id);
      const desc = body.action === 'withdraw'
        ? `Withdrawal of ₹${amt.toLocaleString()} to ${body.payment_method || 'bank'}`
        : (body.description || 'Purchase');
      const { data: tx } = await admin.from('wallet_transactions').insert({
        user_id: user.id, type: 'debit', amount: amt, description: desc,
        payment_method: body.payment_method || null, reference: body.reference || null,
        balance_after: newBal,
      }).select().single();
      return new Response(JSON.stringify({ success: true, balance: newBal, transaction: tx }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (body.action === 'apply_credits') {
      if (amt > credits) {
        return new Response(JSON.stringify({ error: 'Insufficient credits' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const newCreds = credits - amt;
      await admin.from('user_credits').update({ balance: newCreds }).eq('user_id', user.id);
      return new Response(JSON.stringify({ success: true, credits: newCreds }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (body.action === 'earn_credits') {
      // amt = order amount in rupees; earn 1 credit per ₹5
      const earned = Math.floor(amt / 5);
      const newCreds = credits + earned;
      await admin.from('user_credits').update({ balance: newCreds }).eq('user_id', user.id);
      return new Response(JSON.stringify({ success: true, earned, credits: newCreds }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
