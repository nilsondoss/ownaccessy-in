ALTER TABLE `properties` MODIFY COLUMN `price` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `properties` ADD `image_url` text;--> statement-breakpoint
ALTER TABLE `properties` ADD `token_cost` int DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE `properties` ADD `is_active` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `properties` ADD `owner_id` int;--> statement-breakpoint
ALTER TABLE `properties` ADD `owner_name` varchar(255);--> statement-breakpoint
ALTER TABLE `properties` ADD `owner_email` varchar(255);--> statement-breakpoint
ALTER TABLE `properties` ADD `owner_phone` varchar(20);--> statement-breakpoint
ALTER TABLE `properties` ADD `owner_address` text;--> statement-breakpoint
CREATE INDEX `is_active_idx` ON `properties` (`is_active`);