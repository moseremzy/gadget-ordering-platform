-- Schema for Gadget Ordering Platform
-- Database: MySQL / MariaDB

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  state VARCHAR(50),
  city VARCHAR(50),
  address VARCHAR(200),
  account_status ENUM('Verified', 'Unverified') DEFAULT 'Unverified',
  confirmation_code VARCHAR(50),
  password_reset_token VARCHAR(250),
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password_reset_token VARCHAR(250),
  account_status ENUM('Verified', 'Unverified') DEFAULT 'Unverified',
  confirmation_code VARCHAR(50),
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  product_condition ENUM('new', 'uk_used', 'refurbished') DEFAULT 'new',
  status ENUM('active', 'inactive') DEFAULT 'active',
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  main_image VARCHAR(255) NOT NULL,
  main_video VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  order_status ENUM(
    'pending',
    'confirmed',
    'out for delivery',
    'delivered',
    'cancelled',
    'returned'
  ) DEFAULT 'pending',
  payment_status ENUM(
    'pending',
    'success',
    'failed'
  ) DEFAULT 'pending',
  refund_status ENUM(
    'none',
    'pending',
    'refunded',
    'failed'
  ) DEFAULT 'none',
  payment_reference VARCHAR(100),
  payment_method VARCHAR(50) NOT NULL,
  delivery_fee DECIMAL(12,2) NOT NULL,
  confirmation_pin CHAR(4) NOT NULL,
  verification_attempts INT(11) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  total_items INT NOT NULL,
  description VARCHAR(250),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivery_date TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_items (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE settings (
  setting_id INT AUTO_INCREMENT PRIMARY KEY,
  store_state VARCHAR(50) NOT NULL DEFAULT 'Edo',
  store_city VARCHAR(50) NOT NULL DEFAULT 'Benin',
  fee_same_city INT NOT NULL DEFAULT 0,
  fee_same_state INT NOT NULL DEFAULT 1000,
  fee_other_state INT NOT NULL DEFAULT 2000,
  whatsapp VARCHAR(11)
);
