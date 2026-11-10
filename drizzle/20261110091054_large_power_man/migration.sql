CREATE TABLE `categories` (
	`id` integer PRIMARY KEY,
	`name` text NOT NULL,
	`position` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `title_categories` (
	`title_id` integer NOT NULL,
	`category_id` integer NOT NULL,
	CONSTRAINT `title_categories_pk` PRIMARY KEY(`title_id`, `category_id`),
	CONSTRAINT `fk_title_categories_title_id_titles_id_fk` FOREIGN KEY (`title_id`) REFERENCES `titles`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_title_categories_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `titles` (
	`id` integer PRIMARY KEY,
	`tmdb_id` integer NOT NULL,
	`media_type` text NOT NULL,
	`name` text NOT NULL,
	`poster_path` text,
	`total_episodes` integer DEFAULT 0 NOT NULL,
	`watched` integer DEFAULT false NOT NULL,
	`added_at` integer NOT NULL,
	`last_watched_at` integer,
	CONSTRAINT `titles_tmdb_id_media_type_unique` UNIQUE(`tmdb_id`,`media_type`),
	CONSTRAINT "media_type_check" CHECK("media_type" IN ('movie', 'tv'))
);
--> statement-breakpoint
CREATE TABLE `watched_episodes` (
	`title_id` integer NOT NULL,
	`season_number` integer NOT NULL,
	`episode_number` integer NOT NULL,
	`watched_at` integer NOT NULL,
	CONSTRAINT `watched_episodes_pk` PRIMARY KEY(`title_id`, `season_number`, `episode_number`),
	CONSTRAINT `fk_watched_episodes_title_id_titles_id_fk` FOREIGN KEY (`title_id`) REFERENCES `titles`(`id`) ON DELETE CASCADE
);
