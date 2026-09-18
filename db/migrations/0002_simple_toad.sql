PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_invoices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date_id` text,
	`user_id` integer NOT NULL,
	`client_id` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer,
	`due_date` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_invoices`("id", "date_id", "user_id", "client_id", "status", "created_at", "due_date") SELECT "id", "date_id", "user_id", "client_id", "status", "created_at", "due_date" FROM `invoices`;--> statement-breakpoint
DROP TABLE `invoices`;--> statement-breakpoint
ALTER TABLE `__new_invoices` RENAME TO `invoices`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_date_id_unique` ON `invoices` (`date_id`);