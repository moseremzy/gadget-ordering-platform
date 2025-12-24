-- Sample Data for Gadget Ordering Platform
-- Clean, minimal, intentional data

START TRANSACTION;

-- =====================
-- Admin
-- =====================
INSERT INTO admin (admin_id, name, email, phone, password)
VALUES (
  1,
  'Super Admin',
  'admin@gadgetstore.test',
  08012345678,
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
  password
) VALUES (
  1,
  'Test User',
  'user@gadgetstore.test',
  08098765432,
  'Edo',
  'Benin',
  '123 Sample Street, Benin City',
  'Verified',
  '$2a$12$guhSYi.HE/g80Mr9.kLN2Okd6TOxFbEYnopgqsSxZSuZX1zyYSJGu'
);

-- =====================
-- Categories
-- =====================
INSERT INTO categories (category_id, name) VALUES
(1, 'Smartphones'),
(2, 'Laptops');

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
  main_image
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
  'iphone12.jpg'
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
  'hppavilion15.jpg'
);

-- =====================
-- Orders
-- =====================
INSERT INTO orders (
  order_id,
  user_id,
  order_status,
  payment_status,
  payment_reference,
  payment_method,
  delivery_fee,
  confirmation_pin,
  total_amount,
  total_items
) VALUES (
  1,
  1,
  'confirmed',
  'success',
  'PSK_TEST_123456789',
  'card payment',
  2000.00,
  1234,
  1172000.00,
  2
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
  fee_other_state
) VALUES (
  1,
  'Edo',
  'Benin',
  0,
  1000,
  2000
);

COMMIT;
