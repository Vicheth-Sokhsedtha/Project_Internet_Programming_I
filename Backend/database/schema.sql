-- ============================================
-- WOMEN'S CLOTHING STORE DATABASE
-- Complete version with user/admin roles
-- ============================================

CREATE DATABASE IF NOT EXISTS women_clothing_db;
USE women_clothing_db;

-- ========== USERS TABLE ==========
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255) DEFAULT 'default-avatar.png',
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========== CATEGORIES TABLE ==========
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========== PRODUCTS TABLE ==========
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    image_url VARCHAR(255),
    sizes JSON,
    stock INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    discount_percent INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ========== ORDERS TABLE ==========
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    shipping_address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ========== ORDER ITEMS TABLE ==========
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    size VARCHAR(10),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ========== CART TABLE ==========
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    size VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_cart_item (user_id, product_id, size)
);

-- ========== WISHLIST TABLE ==========
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_wishlist (user_id, product_id)
);

-- ========== REVIEWS TABLE ==========
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    user_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ========== INSERT INITIAL DATA ==========

-- Insert categories
INSERT INTO categories (name, image) VALUES
('Dresses', 'dress.jpg'),
('Tops', 'top.jpg'),
('Jeans', 'jeans.jpg'),
('Skirts', 'skirt.jpg'),
('Jackets', 'jacket.jpg'),
('Shoes', 'shoes.jpg'),
('Accessories', 'accessories.jpg');

-- Insert admin user (password: admin123)
-- Hash generated with: bcrypt.hash('admin123', 10)
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@gmail.com', 'admin123', 'admin');

-- Insert regular user (password: user123)
INSERT INTO users (username, email, password, role) VALUES
('john_doe', 'john@gmail.com', 'user123', 'user');
-- Insert sample products
INSERT INTO products (name, description, price, category_id, sizes, stock, is_featured, discount_percent) VALUES
('Summer Floral Dress', 'Beautiful floral summer dress made from breathable cotton', 49.99, 1, '["S", "M", "L"]', 50, true, 10),
('Women Skinny Jeans', 'High-waist skinny jeans with stretch fabric', 39.99, 3, '["XS", "S", "M", "L", "XL"]', 100, true, 0),
('Casual Cotton T-Shirt', '100% cotton t-shirt for everyday wear', 19.99, 2, '["S", "M", "L", "XL"]', 200, false, 15),
('Leather Jacket', 'Genuine leather jacket with zip closure', 89.99, 5, '["M", "L", "XL"]', 30, true, 20),
('High Heel Sandals', 'Evening party heels with comfortable insole', 59.99, 6, '["36", "37", "38", "39"]', 45, false, 0),
('Summer Skirt', 'Light and flowy summer skirt', 34.99, 4, '["XS", "S", "M"]', 25, true, 5);

-- Insert sample order
INSERT INTO orders (order_number, user_id, total_amount, status, payment_method, payment_status) VALUES
('ORD001', 1, 89.98, 'delivered', 'Credit Card', 'paid'),
('ORD002', 2, 59.99, 'shipped', 'PayPal', 'paid');