-- seed.sql

USE `seng513_db`;

-- ---------------------------------------------------------------------------
-- Users
-- Insert users with explicit ids so we can reference them in other seed rows.
-- ---------------------------------------------------------------------------

-- Users (single table with role column)
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `is_active`) VALUES
  (1, 'sysadmin', 'sysadmin@example.com', 'password', 'system_admin', 1),
  (2, 'coadmin', 'admin@example.com', 'password', 'company_admin', 1),
  (3, 'employee', 'employee@example.com', 'password', 'employee', 1),
  (4, 'consumer', 'consumer@example.com', 'password', 'consumer', 1),
  (5, 'consumer2', 'consumer2@example.com', 'password', 'consumer', 1)
ON DUPLICATE KEY UPDATE
  `email` = VALUES(`email`),
  `role` = VALUES(`role`);

-- ---------------------------------------------------------------------------
-- Companies
-- ---------------------------------------------------------------------------
INSERT INTO `companies` (`id`, `name`, `description`, `website`, `image_url`) VALUES
  (1, 'Example Co', 'Seeded example company', 'https://example.com', 'https://images.pexels.com/photos/158302/dahlia-flower-plant-nature-158302.jpeg'),
  (2, 'Another Co', 'Another seeded company', 'https://another.com', 'https://images.pexels.com/photos/34522/grevillea-flower-australian-native.jpg'),
  (3, 'Third Co', 'Third seeded company', 'https://third.com', 'https://images.pexels.com/photos/158302/dahlia-flower-plant-nature-158302.jpeg'),
  (4, 'Fourth Co', 'Fourth seeded company', 'https://fourth.com', 'https://images.pexels.com/photos/34522/grevillea-flower-australian-native.jpg')
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`);

-- ---------------------------------------------------------------------------
-- Employees (profiles linking users to companies)
-- ---------------------------------------------------------------------------
INSERT INTO `employees` (`id`, `user_id`, `company_id`, `employee_number`, `title`, `hired_at`) VALUES
  (1, 3, 1, 'EMP-001', 'Support Engineer', '2024-01-01')
ON DUPLICATE KEY UPDATE `employee_number` = VALUES(`employee_number`);

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
INSERT INTO `products` (`id`, `company_id`, `sku`, `name`, `description`, `price`, `image_url`) VALUES
  (1, 1, 'SKU-EX-001', 'Example Product', 'Seeded example product', 19.99, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg'),
  (2, 1, 'SKU-EX-002', 'Another Product', 'Another seeded product', 29.99, 'https://images.pexels.com/photos/18105/pexels-photo.jpg'),
  (3, 1, 'SKU-EX-003', 'Third Product', 'Third seeded product', 39.99, 'https://images.pexels.com/photos/7641488/pexels-photo-7641488.jpeg'),
  (4, 1, 'SKU-EX-004', 'Fourth Product', 'Fourth seeded product', 49.99, 'https://images.pexels.com/photos/6976094/pexels-photo-6976094.jpeg'),
  (5, 1, 'SKU-EX-005', 'Fifth Product', 'Fifth seeded product', 59.99, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg'),
  (6, 2, 'SKU-AN-001', 'Another Co Product', 'Product from Another Co', 24.99, 'https://images.pexels.com/photos/18105/pexels-photo.jpg'),
  (7, 3, 'SKU-TH-001', 'Third Co Product', 'Product from Third Co', 34.99, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg'),
  (8, 2, 'SKU-FO-001', 'PRODUCT', 'this is yet another product', 44.99, 'https://images.pexels.com/photos/6976094/pexels-photo-6976094.jpeg')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ---------------------------------------------------------------------------
-- Feedback (one example feedback item)
-- ---------------------------------------------------------------------------
INSERT INTO `feedback` (`id`, `user_id`, `company_id`, `product_id`, `feedback_type_id`, `title`, `body`, `status`) VALUES
  (1, 4, 1, 1, 1, 'Great product', 'I really like this product. Works as expected.', 'open'),
  (2, 5, 1, 2, 2, 'Could be better', 'The product is okay but has some issues.', 'open'),
  (3, 4, 2, 6, 1, 'Excellent service', 'The service provided was excellent.', 'open'),
  (4, 5, 1, 1, 2, 'Not satisfied', 'I am not satisfied with the product quality.', 'open'),
  (5, 4, 1, 3, 1, 'Value for money', 'This product offers great value for its price.', 'open'),
  (6, 5, 1, 1, 2, 'Average experience', 'My experience with this product was average.', 'open')
ON DUPLICATE KEY UPDATE `body` = VALUES(`body`);

-- ---------------------------------------------------------------------------
-- Company announcements
-- ---------------------------------------------------------------------------
INSERT INTO `company_announcements` (`id`, `company_id`, `title`, `body`, `created_by_user_id`, `published_at`) VALUES
  (1, 1, 'Welcome', 'Welcome to Example Co — seeded announcement.', 2, NOW()),
  (2, 2, 'Hello from Another Co', 'This is an announcement from Another Co.', 2, NOW()),
  (3, 1, 'New Product Launch', 'We are excited to launch our new product!', 2, NOW()),
  (4, 3, 'Third Co Update', 'Latest updates from Third Co.', 2, NOW())
ON DUPLICATE KEY UPDATE `body` = VALUES(`body`);
