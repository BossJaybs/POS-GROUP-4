-- Add SKU column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE;

-- Add index for faster SKU lookups
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- Add comment to explain the column
COMMENT ON COLUMN products.sku IS 'Stock Keeping Unit - unique identifier for products';
