CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`tokens` int NOT NULL,
	`razorpay_order_id` varchar(255),
	`razorpay_payment_id` varchar(255),
	`razorpay_signature` varchar(255),
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`type` varchar(100) NOT NULL,
	`location` varchar(255) NOT NULL,
	`address` text NOT NULL,
	`price` decimal(15,2) NOT NULL,
	`area` varchar(100),
	`description` text,
	`images` text,
	`status` boolean NOT NULL DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `property_owners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`property_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(255) NOT NULL,
	`address` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `property_owners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `token_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`property_id` int,
	`action` varchar(100) NOT NULL,
	`tokens_used` int NOT NULL,
	`balance_before` int NOT NULL,
	`balance_after` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `token_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_property_access` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`property_id` int NOT NULL,
	`unlocked_at` timestamp DEFAULT (now()),
	CONSTRAINT `user_property_access_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'user',
	`token_balance` int NOT NULL DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `user_idx` ON `payments` (`user_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `payments` (`status`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `properties` (`status`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `properties` (`type`);--> statement-breakpoint
CREATE INDEX `location_idx` ON `properties` (`location`);--> statement-breakpoint
CREATE INDEX `property_idx` ON `property_owners` (`property_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `token_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `action_idx` ON `token_logs` (`action`);--> statement-breakpoint
CREATE INDEX `user_property_idx` ON `user_property_access` (`user_id`,`property_id`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);