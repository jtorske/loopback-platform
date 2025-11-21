-- seed.sql

USE `seng513_db`;

-- ---------------------------------------------------------------------------
-- Users
-- Insert users with explicit ids so we can reference them in other seed rows.
-- ---------------------------------------------------------------------------

-- Users (single table with role column)
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `is_active`) VALUES
  (1, 'sysadmin', 'sysadmin@example.com', 'pbkdf2_sha256$sysadmin_placeholder', 'system_admin', 1),
  (2, 'coadmin', 'admin@example.com', 'pbkdf2_sha256$coadmin_placeholder', 'company_admin', 1),
  (3, 'employee', 'employee@example.com', 'pbkdf2_sha256$employee_placeholder', 'employee', 1),
  (4, 'consumer', 'consumer@example.com', 'pbkdf2_sha256$consumer_placeholder', 'consumer', 1),
  (5, 'guest_user', 'guest@example.com', 'pbkdf2_sha256$guest_placeholder', 'guest', 0)
ON DUPLICATE KEY UPDATE
  `email` = VALUES(`email`),
  `role` = VALUES(`role`);

-- ---------------------------------------------------------------------------
-- Companies
-- ---------------------------------------------------------------------------
INSERT INTO `companies` (`id`, `name`, `description`, `website`) VALUES
  (1, 'Example Co', 'Seeded example company', 'https://example.com')
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
INSERT INTO `products` (`id`, `company_id`, `sku`, `name`, `description`, `price`) VALUES
  (1, 1, 'SKU-EX-001', 'Example Product', 'Seeded example product', 19.99)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ---------------------------------------------------------------------------
-- Feedback (one example feedback item)
-- ---------------------------------------------------------------------------
INSERT INTO `feedback` (`id`, `user_id`, `company_id`, `product_id`, `feedback_type_id`, `title`, `body`, `status`) VALUES
  (1, 4, 1, 1, 1, 'Great product', 'I really like this product. Works as expected.', 'open')
ON DUPLICATE KEY UPDATE `body` = VALUES(`body`);

-- ---------------------------------------------------------------------------
-- Company announcements
-- ---------------------------------------------------------------------------
INSERT INTO `company_announcements` (`id`, `company_id`, `title`, `body`, `created_by_user_id`, `published_at`) VALUES
  (1, 1, 'Welcome', 'Welcome to Example Co — seeded announcement.', 2, NOW())
ON DUPLICATE KEY UPDATE `body` = VALUES(`body`);
