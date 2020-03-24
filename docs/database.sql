
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(10) UNSIGNED NOT NULL,
  `service` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imap_host` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imap_port` mediumint(5) DEFAULT NULL,
  `imap_flags` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smtp_host` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smtp_port` mediumint(5) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `imap_security` enum('SSL','TLS') COLLATE utf8mb4_unicode_ci DEFAULT 'SSL' COMMENT '(DC2Type:imapSecurityType)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `batches`
--

CREATE TABLE `batches` (
  `id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(10) UNSIGNED NOT NULL,
  `account_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tally` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctrine_migration_versions`
--

CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(1024) COLLATE utf8_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `folders`
--

CREATE TABLE `folders` (
  `id` int(10) UNSIGNED NOT NULL,
  `account_id` int(10) UNSIGNED DEFAULT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `count` int(10) UNSIGNED DEFAULT NULL,
  `synced` int(10) UNSIGNED DEFAULT NULL,
  `sync_status` enum('not_synced','syncing','syncing_need_resync','synced','synced','error') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_synced',
  `sync_host` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sync_pid` int(11) DEFAULT NULL,
  `sync_failed_attempts` INT(10) NULL DEFAULT '0',
  `synced_at` timestamp NULL DEFAULT NULL,
  `uid_validity` int(10) UNSIGNED DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `ignored` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(10) UNSIGNED NOT NULL,
  `account_id` int(10) UNSIGNED NOT NULL,
  `folder_id` int(10) UNSIGNED NOT NULL,
  `unique_id` int(10) UNSIGNED DEFAULT NULL,
  `thread_id` int(10) UNSIGNED DEFAULT NULL,
  `outbox_id` int(10) UNSIGNED DEFAULT NULL,
  `uid_validity` int(10) UNSIGNED DEFAULT NULL,
  `date_str` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `charset` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(270) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message_id` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `in_reply_to` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recv_str` text COLLATE utf8mb4_unicode_ci,
  `size` int(10) UNSIGNED DEFAULT NULL,
  `message_no` int(10) UNSIGNED DEFAULT NULL,
  `to` text COLLATE utf8mb4_unicode_ci,
  `from` text COLLATE utf8mb4_unicode_ci,
  `cc` text COLLATE utf8mb4_unicode_ci,
  `bcc` text COLLATE utf8mb4_unicode_ci,
  `reply_to` text COLLATE utf8mb4_unicode_ci,
  `text_plain` longtext COLLATE utf8mb4_unicode_ci,
  `text_html` longtext COLLATE utf8mb4_unicode_ci,
  `references` text COLLATE utf8mb4_unicode_ci,
  `attachments` text COLLATE utf8mb4_unicode_ci,
  `raw_headers` longtext COLLATE utf8mb4_unicode_ci,
  `raw_content` longtext COLLATE utf8mb4_unicode_ci,
  `seen` tinyint(1) DEFAULT NULL,
  `draft` tinyint(1) DEFAULT NULL,
  `recent` tinyint(1) DEFAULT NULL,
  `flagged` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `answered` tinyint(1) DEFAULT NULL,
  `synced` tinyint(1) DEFAULT NULL,
  `purge` tinyint(1) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `date_recv` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meta`
--

CREATE TABLE `meta` (
  `key` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migration_versions`
--

CREATE TABLE `migration_versions` (
  `version` varchar(1024) COLLATE utf8_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `outbox`
--

CREATE TABLE `outbox` (
  `id` int(10) UNSIGNED NOT NULL,
  `account_id` int(10) UNSIGNED NOT NULL,
  `parent_id` int(10) UNSIGNED DEFAULT NULL,
  `to` text COLLATE utf8mb4_unicode_ci,
  `from` text COLLATE utf8mb4_unicode_ci,
  `cc` text COLLATE utf8mb4_unicode_ci,
  `bcc` text COLLATE utf8mb4_unicode_ci,
  `reply_to` text COLLATE utf8mb4_unicode_ci,
  `subject` varchar(270) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `text_plain` longtext COLLATE utf8mb4_unicode_ci,
  `text_html` longtext COLLATE utf8mb4_unicode_ci,
  `draft` tinyint(1) NOT NULL,
  `sent` tinyint(1) NOT NULL,
  `failed` tinyint(1) NOT NULL,
  `locked` tinyint(1) NOT NULL,
  `deleted` tinyint(1) NOT NULL,
  `attempts` tinyint(1) NOT NULL,
  `send_after` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_history` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(10) UNSIGNED NOT NULL,
  `batch_id` int(10) UNSIGNED NOT NULL,
  `account_id` int(10) UNSIGNED NOT NULL,
  `message_id` int(10) UNSIGNED NOT NULL,
  `outbox_id` int(10) UNSIGNED DEFAULT NULL,
  `type` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL,
  `old_value` tinyint(1) DEFAULT NULL,
  `folder_id` int(10) UNSIGNED DEFAULT NULL,
  `retries` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reason` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `batches`
--
ALTER TABLE `batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `account_id_name` (`account_id`,`name`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `doctrine_migration_versions`
--
ALTER TABLE `doctrine_migration_versions`
  ADD PRIMARY KEY (`version`);

--
-- Indexes for table `folders`
--
ALTER TABLE `folders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `account_id` (`account_id`,`name`),
  ADD KEY `idx_account_id` (`account_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `date` (`date`),
  ADD KEY `seen` (`seen`),
  ADD KEY `synced` (`synced`),
  ADD KEY `deleted` (`deleted`),
  ADD KEY `flagged` (`flagged`),
  ADD KEY `folder_id` (`folder_id`),
  ADD KEY `unique_id` (`unique_id`),
  ADD KEY `thread_id` (`thread_id`),
  ADD KEY `outbox_id` (`outbox_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `in_reply_to` (`in_reply_to`),
  ADD KEY `message_id` (`message_id`);

--
-- Indexes for table `meta`
--
ALTER TABLE `meta`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `migration_versions`
--
ALTER TABLE `migration_versions`
  ADD PRIMARY KEY (`version`);

--
-- Indexes for table `outbox`
--
ALTER TABLE `outbox`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `sent` (`sent`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status` (`status`),
  ADD KEY `batch_id` (`batch_id`),
  ADD KEY `outbox_id` (`outbox_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `message_id` (`message_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `batches`
--
ALTER TABLE `batches`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;
--
-- AUTO_INCREMENT for table `folders`
--
ALTER TABLE `folders`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=335;
--
-- AUTO_INCREMENT for table `outbox`
--
ALTER TABLE `outbox`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `FK_334015739B6B5FBA` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

--
-- Constraints for table `folders`
--
ALTER TABLE `folders`
  ADD CONSTRAINT `FK_FE37D30F9B6B5FBA` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `FK_DB021E96162CB942` FOREIGN KEY (`folder_id`) REFERENCES `folders` (`id`),
  ADD CONSTRAINT `FK_DB021E969B6B5FBA` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

--
-- Constraints for table `outbox`
--
ALTER TABLE `outbox`
  ADD CONSTRAINT `FK_6AE7D5709B6B5FBA` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
