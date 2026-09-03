import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://jdcttsjefuerxgkqsrau.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_0luJ3kSFi-o_QqWmX620Qw_uOAZa-SX';

async function testRLSIsolation() {
  console.log('=====================================================');
  console.log('    SUPABASE MULTI-USER RLS ISOLATION VERIFICATION   ');
  console.log('=====================================================');
  console.log(`Connecting to Supabase at: ${SUPABASE_URL}\n`);

  // Create isolated clients for User A and User B
  const clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const clientB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const password = 'TestSecurePassword!2026';
  const emailA = 'user.a.test@commercepilot.ai';
  const emailB = 'user.b.test@commercepilot.ai';

  console.log('1. Setting up and authenticating User A and User B via Supabase Auth...');

  const { Client } = await import('pg');
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('Error: DATABASE_URL environment variable is required to run RLS isolation tests.');
    process.exit(1);
  }
  const pgClient = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await pgClient.connect();

  // Clean any previous test entries in private tables for a clean test run
  await pgClient.query(`
    DELETE FROM public.searches WHERE user_id IN ('ebe51dc4-6105-43cf-b70d-8b7154711ebf', '272484da-2fa4-46dc-803f-3c1e0a976932');
    DELETE FROM public.saved_products WHERE user_id IN ('ebe51dc4-6105-43cf-b70d-8b7154711ebf', '272484da-2fa4-46dc-803f-3c1e0a976932');
    DELETE FROM public.cart_items WHERE user_id IN ('ebe51dc4-6105-43cf-b70d-8b7154711ebf', '272484da-2fa4-46dc-803f-3c1e0a976932');
    DELETE FROM public.orders WHERE user_id IN ('ebe51dc4-6105-43cf-b70d-8b7154711ebf', '272484da-2fa4-46dc-803f-3c1e0a976932');
  `);

  // Provision confirmed test users directly in auth.users avoiding SMTP rate limits
  await pgClient.query(`
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at
    ) VALUES (
      'ebe51dc4-6105-43cf-b70d-8b7154711ebf',
      '00000000-0000-0000-0000-000000000000',
      $1,
      crypt($2, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"User A (Gaming & Engineering)"}'::jsonb,
      'authenticated', 'authenticated', NOW(), NOW()
    ) ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      encrypted_password = crypt($2, gen_salt('bf')),
      email_confirmed_at = NOW();
  `, [emailA, password]);

  await pgClient.query(`
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at
    ) VALUES (
      '272484da-2fa4-46dc-803f-3c1e0a976932',
      '00000000-0000-0000-0000-000000000000',
      $1,
      crypt($2, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"User B (Design & Productivity)"}'::jsonb,
      'authenticated', 'authenticated', NOW(), NOW()
    ) ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      encrypted_password = crypt($2, gen_salt('bf')),
      email_confirmed_at = NOW();
  `, [emailB, password]);

  await pgClient.end();

  // Sign in both clients using real Supabase Auth API
  const { data: sessionA, error: sErr1 } = await clientA.auth.signInWithPassword({ email: emailA, password });
  if (sErr1) throw new Error(`Client A sign in failed: ${sErr1.message}`);
  const userA = sessionA.user;
  console.log(`✓ User A authenticated via Supabase Auth JWT (uid: ${userA.id})`);

  const { data: sessionB, error: sErr2 } = await clientB.auth.signInWithPassword({ email: emailB, password });
  if (sErr2) throw new Error(`Client B sign in failed: ${sErr2.message}`);
  const userB = sessionB.user;
  console.log(`✓ User B authenticated via Supabase Auth JWT (uid: ${userB.id})`);

  console.log('\n2. Fetching real public catalog product IDs for foreign key consistency...');
  const { data: allProds } = await anonClient.from('products').select('id, brand, name');
  const prodA_save = allProds?.find(p => p.brand === 'ASUS')?.id || allProds?.[0]?.id;
  const prodA_cart = allProds?.find(p => p.brand === 'Lenovo')?.id || allProds?.[1]?.id;
  const prodB_save = allProds?.find(p => p.brand === 'Apple')?.id || allProds?.[2]?.id;
  const prodB_cart = allProds?.find(p => p.brand === 'Apple' && p.id !== prodB_save)?.id || allProds?.[3]?.id;

  console.log(`  Selected test products: A_save=${prodA_save}, A_cart=${prodA_cart}, B_save=${prodB_save}, B_cart=${prodB_cart}`);

  console.log('\n3. User A performs private actions:');
  // User A searches: 'RTX 4060 laptop'
  const { error: sErrA } = await clientA.from('searches').insert({
    user_id: userA?.id,
    query: 'RTX 4060 laptop',
    filters: { gpu: 'RTX 4060' }
  });
  if (sErrA) console.error('User A search insert error:', sErrA.message);
  console.log('  → User A saved search: "RTX 4060 laptop"');

  // User A saves product
  const { error: spErrA } = await clientA.from('saved_products').insert({
    user_id: userA?.id,
    product_id: prodA_save
  });
  if (spErrA) console.error('User A saved product error:', spErrA.message);
  console.log(`  → User A saved product: "${prodA_save}"`);

  // User A adds to cart
  const { error: cartErrA } = await clientA.from('cart_items').insert({
    user_id: userA?.id,
    product_id: prodA_cart,
    quantity: 1
  });
  if (cartErrA) console.error('User A cart insert error:', cartErrA.message);
  console.log(`  → User A added to cart: "${prodA_cart}"`);

  // User A places an order
  const orderIdA = `CP-A-${Date.now().toString().slice(-4)}`;
  const { error: ordErrA } = await clientA.from('orders').insert({
    id: orderIdA,
    user_id: userA?.id,
    total_amount: 142990,
    status: 'confirmed',
    payment_method: 'card',
    items: [{ productId: prodA_cart, quantity: 1, price: 142990 }]
  });
  if (ordErrA) console.error('User A order insert error:', ordErrA.message);
  console.log(`  → User A created order: ${orderIdA}`);

  console.log('\n4. User B performs private actions:');
  // User B searches: 'MacBook Air M3'
  const { error: sErrB } = await clientB.from('searches').insert({
    user_id: userB?.id,
    query: 'MacBook Air M3',
    filters: { brand: 'Apple' }
  });
  if (sErrB) console.error('User B search insert error:', sErrB.message);
  console.log('  → User B saved search: "MacBook Air M3"');

  // User B saves product
  const { error: spErrB } = await clientB.from('saved_products').insert({
    user_id: userB?.id,
    product_id: prodB_save
  });
  if (spErrB) console.error('User B saved product error:', spErrB.message);
  console.log(`  → User B saved product: "${prodB_save}"`);

  // User B adds to cart
  const { error: cartErrB } = await clientB.from('cart_items').insert({
    user_id: userB?.id,
    product_id: prodB_cart,
    quantity: 1
  });
  if (cartErrB) console.error('User B cart insert error:', cartErrB.message);
  console.log(`  → User B added to cart: "${prodB_cart}"`);

  console.log('\n5. Running Strict Row Level Security (RLS) Cross-Tenant Verification:');

  let passedAll = true;

  // --- Check 1: User A Searches ---
  const { data: aSearches } = await clientA.from('searches').select('*');
  const aCanSeeBQuery = aSearches?.some(s => s.query.includes('MacBook'));
  const aCanSeeAQuery = aSearches?.some(s => s.query.includes('RTX 4060'));
  if (aCanSeeAQuery && !aCanSeeBQuery) {
    console.log('  [PASS] User A only sees User A search ("RTX 4060 laptop"). User B query is hidden.');
  } else {
    console.error('  [FAIL] Search isolation failed for User A!');
    passedAll = false;
  }

  // --- Check 2: User B Searches ---
  const { data: bSearches } = await clientB.from('searches').select('*');
  const bCanSeeAQuery = bSearches?.some(s => s.query.includes('RTX 4060'));
  const bCanSeeBQuery = bSearches?.some(s => s.query.includes('MacBook'));
  if (bCanSeeBQuery && !bCanSeeAQuery) {
    console.log('  [PASS] User B only sees User B search ("MacBook Air M3"). User A query is hidden.');
  } else {
    console.error('  [FAIL] Search isolation failed for User B!');
    passedAll = false;
  }

  // --- Check 3: User A Saved Products ---
  const { data: aSaved } = await clientA.from('saved_products').select('*');
  const aHasBSaved = aSaved?.some(s => s.product_id === prodB_save);
  const aHasASaved = aSaved?.some(s => s.product_id === prodA_save);
  if (aHasASaved && !aHasBSaved) {
    console.log(`  [PASS] User A only sees User A saved laptop ("${prodA_save}"). User B wishlist is hidden.`);
  } else {
    console.error('  [FAIL] Saved product isolation failed for User A!');
    passedAll = false;
  }

  // --- Check 4: User B Saved Products ---
  const { data: bSaved } = await clientB.from('saved_products').select('*');
  const bHasASaved = bSaved?.some(s => s.product_id === prodA_save);
  const bHasBSaved = bSaved?.some(s => s.product_id === prodB_save);
  if (bHasBSaved && !bHasASaved) {
    console.log(`  [PASS] User B only sees User B saved laptop ("${prodB_save}"). User A wishlist is hidden.`);
  } else {
    console.error('  [FAIL] Saved product isolation failed for User B!');
    passedAll = false;
  }

  // --- Check 5: Cart Items Isolation ---
  const { data: aCart } = await clientA.from('cart_items').select('*');
  const { data: bCart } = await clientB.from('cart_items').select('*');
  const aHasBCart = aCart?.some(c => c.product_id === prodB_cart);
  const bHasACart = bCart?.some(c => c.product_id === prodA_cart);
  if (!aHasBCart && !bHasACart && aCart?.length === 1 && bCart?.length === 1) {
    console.log('  [PASS] Cart items are 100% isolated between User A and User B.');
  } else {
    console.error('  [FAIL] Cart isolation failed!');
    passedAll = false;
  }

  // --- Check 6: Orders Isolation ---
  const { data: bOrders } = await clientB.from('orders').select('*');
  const bHasAOrder = bOrders?.some(o => o.id === orderIdA);
  if (!bHasAOrder) {
    console.log(`  [PASS] User B cannot see User A order (${orderIdA}). Row Level Security returned 0 records.`);
  } else {
    console.error('  [FAIL] Order isolation failed! User B can see User A order.');
    passedAll = false;
  }

  // --- Check 7: Public Catalog Shared Access ---
  const { data: aProds } = await clientA.from('products').select('id');
  const { data: bProds } = await clientB.from('products').select('id');
  const { data: anonProds } = await anonClient.from('products').select('id');

  if (aProds?.length === 57 && bProds?.length === 57 && anonProds?.length === 57) {
    console.log('  [PASS] Both authenticated users AND anonymous visitors see all 57 public catalog laptops.');
  } else {
    console.error(`  [FAIL] Public product access mismatch! A=${aProds?.length}, B=${bProds?.length}, Anon=${anonProds?.length}`);
    passedAll = false;
  }

  // --- Check 8: Public Marketplace Listings ---
  const { data: anonListings } = await anonClient.from('marketplace_listings').select('id').limit(5);
  if (anonListings && anonListings.length > 0) {
    console.log('  [PASS] Public marketplace listings are accessible anonymously without authentication.');
  } else {
    console.error('  [FAIL] Public marketplace listings not accessible anonymously.');
    passedAll = false;
  }

  console.log('\n=====================================================');
  if (passedAll) {
    console.log('  ✓ ALL 8 ISOLATION & ACCESS CHECKS PASSED PERFECTLY! ');
    console.log('  Supabase RLS Architecture satisfies Requirement 13. ');
  } else {
    console.error('  ✗ Some checks failed. Inspect RLS policies.');
    process.exit(1);
  }
  console.log('=====================================================\n');
}

testRLSIsolation().catch(err => {
  console.error('Test script encountered fatal error:', err);
  process.exit(1);
});
