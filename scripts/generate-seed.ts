import { INITIAL_PRODUCTS } from '../src/data/products';
import fs from 'fs';
import path from 'path';

function escapeSql(str: string | undefined | null): string {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

function arrayToSql(arr: string[] | undefined): string {
  if (!arr || arr.length === 0) return "'{}'";
  return 'ARRAY[' + arr.map((s) => escapeSql(s)).join(', ') + ']';
}

let sql = '-- ==============================================================================\n';
sql += '-- CEYLON CRUNCH - INITIAL CATALOG SEED DATA\n';
sql += '-- Run this script in: Supabase Dashboard > SQL Editor > New Query > Run\n';
sql += '-- ==============================================================================\n\n';

for (const p of INITIAL_PRODUCTS) {
  sql += 'DO $$\n';
  sql += 'DECLARE\n';
  sql += '  v_prod_id uuid;\n';
  sql += 'BEGIN\n';
  sql += '  -- Insert product if not exists\n';
  sql += `  SELECT id INTO v_prod_id FROM public.products WHERE slug = ${escapeSql(p.slug)};\n`;
  sql += '  IF v_prod_id IS NULL THEN\n';
  sql += '    INSERT INTO public.products (\n';
  sql += '      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured\n';
  sql += '    ) VALUES (\n';
  sql += `      ${escapeSql(p.slug)},\n`;
  sql += `      ${escapeSql(p.name)},\n`;
  sql += `      ${escapeSql(p.subtitle)},\n`;
  sql += `      ${escapeSql(p.category)},\n`;
  sql += `      ${escapeSql(p.badge || null)},\n`;
  sql += `      ${escapeSql(p.origin)},\n`;
  sql += `      ${escapeSql(p.roastStyle || null)},\n`;
  sql += `      ${p.rating || 5.0},\n`;
  sql += `      ${p.reviewCount || 0},\n`;
  sql += `      ${arrayToSql(p.images)},\n`;
  sql += `      ${escapeSql(p.description)},\n`;
  sql += `      ${arrayToSql(p.extendedAbout)},\n`;
  sql += `      ${escapeSql(p.ingredients)},\n`;
  sql += `      ${escapeSql(p.storage)},\n`;
  sql += `      ${escapeSql(p.shelfLife)},\n`;
  sql += `      ${escapeSql(p.allergenNotice)},\n`;
  sql += `      ${p.isFeatured ? 'true' : 'false'}\n`;
  sql += '    ) RETURNING id INTO v_prod_id;\n';
  sql += '  END IF;\n\n';

  for (const v of p.variants) {
    sql += `  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = ${escapeSql(v.weight)}) THEN\n`;
    sql += '    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)\n';
    sql += `    VALUES (v_prod_id, ${escapeSql(v.weight)}, ${v.price}, ${v.originalPrice || 'NULL'}, ${v.stock || 50});\n`;
    sql += '  END IF;\n';
  }

  sql += 'END $$;\n\n';
}

const outputPath = path.resolve(process.cwd(), 'supabase/seed.sql');
fs.writeFileSync(outputPath, sql, 'utf-8');
console.log('Generated supabase/seed.sql successfully! Total products:', INITIAL_PRODUCTS.length);
