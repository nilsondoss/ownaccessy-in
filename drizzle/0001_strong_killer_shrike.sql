CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`property_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_property_idx` ON `favorites` (`user_id`,`property_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `favorites` (`user_id`);