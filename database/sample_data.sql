-- Sample Data for Gadget Ordering Platform
-- Clean, minimal, intentional data
-- Fully aligned with schema.sql

START TRANSACTION;

-- =====================
-- Admin
-- =====================
INSERT INTO admin (
  admin_id,
  name,
  email,
  phone,
  account_status,
  confirmation_code,
  password
) VALUES (
  1,
  'Super Admin',
  'admin@gadgetstore.test',
  '08012345678',
  'Verified',
  NULL,
  '$2a$12$guhSYi.HE/g80Mr9.kLN2Okd6TOxFbEYnopgqsSxZSuZX1zyYSJGu'
);

-- =====================
-- Users
-- =====================
INSERT INTO users (
  user_id,
  fullname,
  email,
  phone,
  state,
  city,
  address,
  account_status,
  confirmation_code,
  password
) VALUES (
  1,
  'Test User',
  'user@gadgetstore.test',
  '08098765432',
  'Edo',
  'Benin',
  '123 Sample Street, Benin City',
  'Verified',
  NULL,
  '$2a$12$guhSYi.HE/g80Mr9.kLN2Okd6TOxFbEYnopgqsSxZSuZX1zyYSJGu'
);

-- =====================
-- Categories
-- =====================
INSERT INTO categories (category_id, name) VALUES
(1, 'phones'),
(2, 'laptops');

-- =====================
-- Products
-- =====================
INSERT INTO products (
  product_id,
  category_id,
  name,
  description,
  product_condition,
  status,
  price,
  stock_quantity,
  main_image,
  main_video
) VALUES
(
  1,
  1,
  'iPhone 12',
  'Apple iPhone 12 with 128GB storage',
  'uk_used',
  'active',
  450000.00,
  5,
  'https://res.cloudinary.com/dkebpp1vm/image/upload/v1768537716/products/images/1768537716292-iphone12.jpg',
  NULL
),
(
  2,
  2,
  'HP Pavilion 15',
  'HP Pavilion 15 Intel Core i5, 8GB RAM, 512GB SSD',
  'new',
  'active',
  720000.00,
  3,
  'https://res.cloudinary.com/dkebpp1vm/image/upload/v1768537716/products/images/1768537716292-hppavilion15.jpg',
  NULL
);

-- =====================
-- Orders
-- =====================
INSERT INTO orders (
  order_id,
  user_id,
  order_status,
  payment_status,
  refund_status,
  payment_reference,
  payment_method,
  delivery_fee,
  confirmation_pin,
  verification_attempts,
  total_amount,
  total_items,
  description,
  delivery_date
) VALUES (
  1,
  1,
  'confirmed',
  'success',
  'none',
  'PSK_TEST_123456789',
  'card payment',
  2000.00,
  '1234',
  0,
  1172000.00,
  2,
  NULL,
  NULL
);

-- =====================
-- Order Items
-- =====================
INSERT INTO order_items (
  order_item_id,
  order_id,
  product_id,
  quantity,
  price
) VALUES
(1, 1, 1, 1, 450000.00),
(2, 1, 2, 1, 720000.00);

-- =====================
-- Settings
-- =====================
INSERT INTO settings (
  setting_id,
  store_state,
  store_city,
  fee_same_city,
  fee_same_state,
  fee_other_state,
  whatsapp
) VALUES (
  1,
  'Edo',
  'Benin',
  0,
  1000,
  2000,
  NULL
);

COMMIT;
