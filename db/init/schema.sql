-- schema.sql

CREATE DATABASE IF NOT EXISTS `seng513_db`;
USE `seng513_db`;
-- Users: core user account information
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) DEFAULT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'consumer',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Companies
CREATE TABLE IF NOT EXISTS `companies` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `image_url` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- Employees: profiles for users that are employees of companies
CREATE TABLE IF NOT EXISTS `employees` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `company_id` INT UNSIGNED NOT NULL,
  `employee_number` VARCHAR(50) DEFAULT NULL,
  `title` VARCHAR(100) DEFAULT NULL,
  `hired_at` DATE DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_employee_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_employee_company` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE
);

-- Products
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` INT UNSIGNED NOT NULL,
  `sku` VARCHAR(100) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `price` DECIMAL(10,2) DEFAULT NULL,
  `image_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_products_company` (`company_id`),
  CONSTRAINT `fk_products_company` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE
);

-- Feedback type codes (praise, bug, enhancement, reply)
CREATE TABLE IF NOT EXISTS `feedback_types` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- Feedback (submitted by users or guests) with optional parent for replies
CREATE TABLE IF NOT EXISTS `feedback` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `company_id` INT UNSIGNED DEFAULT NULL,
  `product_id` INT UNSIGNED DEFAULT NULL,
  `feedback_type_id` INT UNSIGNED NOT NULL,
  `parent_feedback_id` INT UNSIGNED DEFAULT NULL,
  `title` VARCHAR(255) DEFAULT NULL,
  `body` TEXT NOT NULL,
  `status` VARCHAR(50) DEFAULT 'open',
  `upvotes` INT NOT NULL DEFAULT 0,
  `downvotes` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_feedback_user` (`user_id`),
  KEY `idx_feedback_company` (`company_id`),
  KEY `idx_feedback_product` (`product_id`),
  CONSTRAINT `fk_feedback_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_feedback_company` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_feedback_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_feedback_type` FOREIGN KEY (`feedback_type_id`) REFERENCES `feedback_types`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_feedback_parent` FOREIGN KEY (`parent_feedback_id`) REFERENCES `feedback`(`id`) ON DELETE CASCADE
);

-- Company announcements
CREATE TABLE IF NOT EXISTS `company_announcements` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `body` TEXT NOT NULL,
  `created_by_user_id` INT UNSIGNED DEFAULT NULL,
  `published_at` TIMESTAMP DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ann_company` (`company_id`),
  CONSTRAINT `fk_announcement_company` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_announcement_user` FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Seed some feedback types (idempotent)
INSERT IGNORE INTO `feedback_types` (`code`, `description`) VALUES
  ('praise', 'Positive feedback or praise'),
  ('bug', 'Bug report'),
  ('enhancement', 'Feature request or enhancement'),
  ('reply', 'Reply to another feedback item');


