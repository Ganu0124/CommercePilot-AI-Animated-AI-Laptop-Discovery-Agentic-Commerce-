import { Client } from 'pg';
import dotenv from 'dotenv';
import { ALL_PRODUCTS, DEFAULT_OFFERS } from '../src/data/products';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Error: DATABASE_URL environment variable is required.');
  process.exit(1);
}

async function migrate() {
  console.log('=== Starting Supabase Full Backend Migration ===');
  console.log('Connecting to PostgreSQL database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to PostgreSQL successfully.');

  console.log('1. Creating tables according to specification...');

  // Ensure pgcrypto extension for gen_random_uuid()
  await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

  // Drop old tables to update column types cleanly to match specification
  await client.query(`
    DROP TABLE IF EXISTS public.saved_products CASCADE;
    DROP TABLE IF EXISTS public.searches CASCADE;
    DROP TABLE IF EXISTS public.comparisons CASCADE;
    DROP TABLE IF EXISTS public.cart_items CASCADE;
    DROP TABLE IF EXISTS public.marketplace_listings CASCADE;
    DROP TABLE IF EXISTS public.reviews CASCADE;
    DROP TABLE IF EXISTS public.bank_offers CASCADE;
    DROP TABLE IF EXISTS public.user_preferences CASCADE;
    DROP TABLE IF EXISTS public.orders CASCADE;
    DROP TABLE IF EXISTS public.profiles CASCADE;
    DROP TABLE IF EXISTS public.products CASCADE;
  `);

  // --- 1. Profiles (Private) ---
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      full_name TEXT,
      email TEXT,
      avatar_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- 2. Products (Public Catalog) ---
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      model TEXT,
      brand TEXT NOT NULL,
      category TEXT,
      image_url TEXT,
      image TEXT,
      specifications JSONB,
      description TEXT,
      subtitle TEXT,
      rating NUMERIC DEFAULT 4.5,
      review_count INTEGER DEFAULT 0,
      price NUMERIC NOT NULL,
      mrp NUMERIC NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- 3. Marketplace Listings (Public Catalog) ---
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.marketplace_listings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
      marketplace TEXT NOT NULL,
      seller TEXT,
      price NUMERIC NOT NULL,
      original_price NUMERIC,
      offer_price NUMERIC,
      product_url TEXT,
      stock_status TEXT DEFAULT 'in_stock',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- 4. Reviews (Public Catalog) ---
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
      rating NUMERIC NOT NULL,
      review_text TEXT NOT NULL,
      sentiment TEXT DEFAULT 'positive',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- 5. Bank Offers (Public Catalog) ---
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.bank_offers (
      id TEXT PRIMARY KEY,
      marketplace TEXT DEFAULT 'All Platforms',
      bank_name TEXT NOT NULL,
      offer_title TEXT NOT NULL,
      discount NUMERIC NOT NULL,
      max_discount NUMERIC,
      minimum_purchase NUMERIC,
      validity TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- 6. Searches (Private User Data) ---
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.searches (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      query TEXT NOT NULL,
      filters JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- 7. Saved Products (Private User Data) ---
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.saved_products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, product_id)
    );
  `);

  // --- 8. Comparisons (Private User Data) ---
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.comparisons (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      product_ids JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- 9. Cart Items (Private User Data) ---
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.cart_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
      quantity INTEGER DEFAULT 1,
      selected_offer JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, product_id)
    );
  `);

  // --- 10. Orders (Private User Data) ---
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.orders (
      id TEXT PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      total_amount NUMERIC NOT NULL,
      status TEXT DEFAULT 'confirmed',
      items JSONB,
      savings NUMERIC DEFAULT 0,
      payment_method TEXT DEFAULT 'card',
      shipping_address JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // --- 11. User Preferences (Private User Data) ---
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.user_preferences (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
      preferred_brands JSONB DEFAULT '[]'::jsonb,
      preferred_budget NUMERIC DEFAULT 75000,
      preferred_use_case TEXT DEFAULT 'AI & Data Science',
      preferred_specs JSONB DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log('2. Configuring Permissions & Row Level Security (RLS)...');

  // Schema permissions
  await client.query(`
    GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
    GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
    GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
  `);

  // Helper to enable RLS and drop previous policies
  const allTables = [
    'profiles', 'products', 'marketplace_listings', 'reviews', 'bank_offers',
    'searches', 'saved_products', 'comparisons', 'cart_items', 'orders', 'user_preferences'
  ];

  for (const t of allTables) {
    await client.query(`ALTER TABLE public.${t} ENABLE ROW LEVEL SECURITY;`);
    // Drop existing policies
    const existing = await client.query(`
      SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = $1;
    `, [t]);
    for (const row of existing.rows) {
      await client.query(`DROP POLICY IF EXISTS "${row.policyname}" ON public.${t};`);
    }
  }

  // PUBLIC TABLES POLICIES: Public can read, only service_role can modify
  const publicTables = ['products', 'marketplace_listings', 'reviews', 'bank_offers'];
  for (const pt of publicTables) {
    await client.query(`
      CREATE POLICY "Allow public read access on ${pt}" ON public.${pt}
      FOR SELECT USING (true);
    `);
  }

  // PRIVATE TABLES POLICIES (Strict auth.uid() = user_id or auth.uid() = id)
  // Profiles
  await client.query(`
    CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

    CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

    CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  `);

  // Searches
  await client.query(`
    CREATE POLICY "Users can view own searches" ON public.searches
    FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own searches" ON public.searches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can delete own searches" ON public.searches
    FOR DELETE USING (auth.uid() = user_id);
  `);

  // Saved Products
  await client.query(`
    CREATE POLICY "Users can view own saved products" ON public.saved_products
    FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own saved products" ON public.saved_products
    FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can delete own saved products" ON public.saved_products
    FOR DELETE USING (auth.uid() = user_id);
  `);

  // Comparisons
  await client.query(`
    CREATE POLICY "Users can view own comparisons" ON public.comparisons
    FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own comparisons" ON public.comparisons
    FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can delete own comparisons" ON public.comparisons
    FOR DELETE USING (auth.uid() = user_id);
  `);

  // Cart Items
  await client.query(`
    CREATE POLICY "Users can view own cart items" ON public.cart_items
    FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert into own cart" ON public.cart_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update own cart items" ON public.cart_items
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can delete from own cart" ON public.cart_items
    FOR DELETE USING (auth.uid() = user_id);
  `);

  // Orders
  await client.query(`
    CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);
  `);

  // User Preferences
  await client.query(`
    CREATE POLICY "Users can view own preferences" ON public.user_preferences
    FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own preferences" ON public.user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update own preferences" ON public.user_preferences
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  `);

  console.log('3. Setting up automatic new user trigger on auth.users...');
  await client.query(`
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $$
    BEGIN
      INSERT INTO public.profiles (id, full_name, email, avatar_url, created_at)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url',
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);

      INSERT INTO public.user_preferences (user_id, preferred_brands, preferred_budget, preferred_use_case)
      VALUES (
        NEW.id,
        '["HP", "Apple", "ASUS", "Lenovo"]'::jsonb,
        75000,
        'AI & Data Science'
      )
      ON CONFLICT (user_id) DO NOTHING;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  `);

  console.log('4. Seeding Public Catalog (Products, Listings, Reviews, Bank Offers)...');

  // Seed Products
  for (const p of ALL_PRODUCTS) {
    await client.query(`
      INSERT INTO public.products (
        id, name, model, brand, category, image_url, image, specifications, description, subtitle, rating, review_count, price, mrp
      ) VALUES ($1, $2, $2, $3, $4, $5, $5, $6, $7, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        model = EXCLUDED.model,
        brand = EXCLUDED.brand,
        category = EXCLUDED.category,
        image_url = EXCLUDED.image_url,
        image = EXCLUDED.image,
        specifications = EXCLUDED.specifications,
        description = EXCLUDED.description,
        subtitle = EXCLUDED.subtitle,
        rating = EXCLUDED.rating,
        review_count = EXCLUDED.review_count,
        price = EXCLUDED.price,
        mrp = EXCLUDED.mrp;
    `, [
      p.id,
      p.model,
      p.brand,
      p.category,
      p.image,
      JSON.stringify(p.specs || {}),
      p.subtitle || `${p.model} - High performance laptop for ${p.category}`,
      p.rating,
      p.reviewCount,
      p.price,
      p.mrp
    ]);

    // Seed Marketplace Listings for product
    if (p.marketplaces && p.marketplaces.length > 0) {
      for (const m of p.marketplaces) {
        await client.query(`
          INSERT INTO public.marketplace_listings (
            product_id, marketplace, seller, price, original_price, offer_price, product_url, stock_status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT DO NOTHING;
        `, [
          p.id,
          m.store,
          m.seller || 'Authorized Retailer',
          m.price,
          m.originalPrice || p.mrp,
          Math.max(m.price - 2000, 30000),
          m.directUrl || '#',
          m.inStock ? 'in_stock' : 'out_of_stock'
        ]);
      }
    } else {
      // Default stores
      const defaultStores = [
        { store: 'Amazon', price: p.price, seller: 'Appario Retail' },
        { store: 'Flipkart', price: p.price + 500, seller: 'RetailNet' },
        { store: 'Croma', price: p.price - 500, seller: 'Croma Official' }
      ];
      for (const ds of defaultStores) {
        await client.query(`
          INSERT INTO public.marketplace_listings (
            product_id, marketplace, seller, price, original_price, offer_price, product_url, stock_status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT DO NOTHING;
        `, [
          p.id,
          ds.store,
          ds.seller,
          ds.price,
          p.mrp,
          ds.price - 2000,
          '#',
          'in_stock'
        ]);
      }
    }

    // Seed Reviews for product
    const reviewText = p.reviewSummary?.aiVerdict || `Exceptional build quality and thermal efficiency for ${p.model}.`;
    await client.query(`
      INSERT INTO public.reviews (
        product_id, rating, review_text, sentiment
      ) VALUES ($1, $2, $3, $4)
      ON CONFLICT DO NOTHING;
    `, [
      p.id,
      p.rating,
      reviewText,
      (p.reviewSummary?.sentimentScore ?? 85) >= 70 ? 'positive' : 'neutral'
    ]);
  }

  // Seed Bank Offers
  for (const bo of DEFAULT_OFFERS) {
    await client.query(`
      INSERT INTO public.bank_offers (
        id, marketplace, bank_name, offer_title, discount, max_discount, minimum_purchase, validity
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        discount = EXCLUDED.discount,
        max_discount = EXCLUDED.max_discount,
        minimum_purchase = EXCLUDED.minimum_purchase;
    `, [
      bo.id,
      'All Platforms',
      bo.bank,
      bo.terms,
      bo.instantDiscount,
      bo.maxDiscount,
      bo.minPurchase,
      'Valid through March 2026'
    ]);
  }

  console.log('5. Reloading PostgREST schema cache...');
  await client.query("NOTIFY pgrst, 'reload schema';");

  // Verify row counts
  const prodCount = await client.query('SELECT COUNT(*) FROM public.products;');
  const listCount = await client.query('SELECT COUNT(*) FROM public.marketplace_listings;');
  const revCount = await client.query('SELECT COUNT(*) FROM public.reviews;');
  const offerCount = await client.query('SELECT COUNT(*) FROM public.bank_offers;');

  console.log('=== Supabase Migration & Seeding Successful ===');
  console.log(`Products: ${prodCount.rows[0].count}`);
  console.log(`Marketplace Listings: ${listCount.rows[0].count}`);
  console.log(`Reviews: ${revCount.rows[0].count}`);
  console.log(`Bank Offers: ${offerCount.rows[0].count}`);
  console.log('Row Level Security (RLS) active on all 11 tables.');

  await client.end();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
