CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrer_id` int NOT NULL,
	`referee_id` int NOT NULL,
	`referral_code` varchar(20) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`referrer_bonus` int DEFAULT 0,
	`referee_bonus` int DEFAULT 0,
	`completed_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `token_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`amount` int NOT NULL,
	`description` text,
	`related_property_id` int,
	`related_referral_id` int,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `token_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `referral_code` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `referred_by` int;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_referral_code_unique` UNIQUE(`referral_code`);--> statement-breakpoint
CREATE INDEX `referrer_idx` ON `referrals` (`referrer_id`);--> statement-breakpoint
CREATE INDEX `referee_idx` ON `referrals` (`referee_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `referrals` (`status`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `token_transactions` (`user_id`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `token_transactions` (`type`);--> statement-breakpoint
CREATE INDEX `referral_code_idx` ON `users` (`referral_code`);