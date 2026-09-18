ALTER TABLE `invoices` ADD `date_id` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_date_id_unique` ON `invoices` (`date_id`);