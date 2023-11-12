-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 12, 2023 at 12:57 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hotel_booking`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL,
  `reservation_id` int(11) NOT NULL,
  `booking_timestamp` varchar(255) NOT NULL,
  `expected_amount` float NOT NULL,
  `amount_paid` float NOT NULL,
  `balance` float NOT NULL,
  `remarks` text DEFAULT NULL,
  `booking_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `reservation_id`, `booking_timestamp`, `expected_amount`, `amount_paid`, `balance`, `remarks`, `booking_status`) VALUES
(1, 3, '1699510197', 100000, 10000, 90000, 'Room 9', 'Active'),
(3, 5, '1699530854', 50000, 50000, 0, 'Room at the corner', 'Active'),
(4, 15, '1699656516', 50000, 50000, 0, '', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `sender` varchar(255) NOT NULL,
  `sender_phone` varchar(255) NOT NULL,
  `sender_email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `message_created_at` varchar(255) NOT NULL,
  `message_status` enum('Read','Unread') NOT NULL DEFAULT 'Unread'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`message_id`, `sender`, `sender_phone`, `sender_email`, `subject`, `message`, `message_created_at`, `message_status`) VALUES
(2, 'John Cassidy', '09087865454', 'cassidy@gmail.com', 'Promised Discount', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '1699779700', 'Read'),
(4, 'John Cassidy', '09087865454', 'cassidy@gmail.com', 'Promised Discount', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '1699780266', 'Read'),
(14, 'John Cassidy', '09087865454', 'cassidy@gmail.com', 'Promised Discount', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '1699782583', 'Read'),
(17, 'John Cassidy', '09087865454', 'cassidy@gmail.com', 'Promised Discount', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '1699782953', 'Read'),
(18, 'John Cassidy', '09087865454', 'cassidy@gmail.com', 'Promised Discount', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '1699782954', 'Read'),
(19, 'John Cassidy', '09087865454', 'cassidy@gmail.com', 'Promised Discount', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '1699782954', 'Read'),
(20, 'John Cassidy', '09087865454', 'cassidy@gmail.com', 'Promised Discount', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '1699782955', 'Unread');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `reservation_id` int(11) NOT NULL,
  `room_category_id` int(11) DEFAULT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `reservation_timestamp` varchar(255) NOT NULL,
  `total_amount` float NOT NULL,
  `customer_fullname` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(255) NOT NULL,
  `adults_per_room` varchar(255) NOT NULL DEFAULT '1',
  `children_per_room` varchar(255) NOT NULL DEFAULT '0',
  `no_of_rooms` int(11) NOT NULL,
  `remarks` text DEFAULT NULL,
  `reservation_status` enum('Reserved','Unreserved') DEFAULT 'Unreserved'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`reservation_id`, `room_category_id`, `check_in_date`, `check_out_date`, `reservation_timestamp`, `total_amount`, `customer_fullname`, `customer_email`, `customer_phone`, `adults_per_room`, `children_per_room`, `no_of_rooms`, `remarks`, `reservation_status`) VALUES
(3, 6, '2023-11-09', '2023-11-20', '1699504195', 100000, 'Casious Claire', 'claire@gmail.com', '09087348878', '1', 'None', 2, 'I usually love it at room 10', 'Reserved'),
(5, 6, '2023-12-01', '2023-11-26', '1699530756', 50000, 'Path Atah', 'path@gmail.com', '09087977887', '1', 'None', 1, 'Room 10', 'Reserved'),
(6, 11, '2023-11-10', '2023-11-13', '1699620580', 250000, 'John Cena', 'cena@gmail.com', '09087898789', '1', '0', 1, NULL, 'Unreserved'),
(7, 9, '2023-11-15', '2023-11-21', '1699621382', 180000, 'Roman Reigns', 'reigns@gmail.com', '09089829281', '1', '0', 1, NULL, 'Unreserved'),
(9, 11, '2023-11-10', '2023-11-13', '1699627329', 0, 'Enyinnaya Ojo', 'ojo@gmail.com', '09087872222', '1', '0', 1, 'Room 103', 'Unreserved'),
(10, 11, '2023-11-10', '2023-11-13', '1699627608', 750000, 'Jon Snow', 'jonsnow@example.com', '08065198300', '1', '0', 1, '', 'Unreserved'),
(11, 11, '2023-11-10', '2023-11-10', '1699628497', 250000, 'Jon Snow', 'jonsnow@example.com', '08065198300', '1', '0', 1, '', 'Unreserved'),
(12, 11, '2023-11-10', '2023-11-13', '1699629293', 750000, 'Jon Snow', 'jonsnow@example.com', '08065198300', '1', '0', 1, '', 'Unreserved'),
(13, 10, '2023-11-11', '2023-11-11', '1699629362', 50000, 'Jon Snow', 'jonsnow@example.com', '08065198300', '1', '0', 1, 'Room 101', 'Reserved'),
(15, 10, '2023-11-10', '2023-11-11', '1699653760', 50000, 'Mel Gibson', 'melgibson@example.com', '0908782728', '1', '0', 1, '', 'Reserved');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `room_category_id` int(11) DEFAULT NULL,
  `reviewer` varchar(255) NOT NULL,
  `review` text NOT NULL,
  `rating` float NOT NULL,
  `review_timestamp` varchar(255) NOT NULL,
  `review_status` enum('Published','Unpublished') NOT NULL DEFAULT 'Published'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `room_categories`
--

CREATE TABLE `room_categories` (
  `room_category_id` int(11) NOT NULL,
  `room_category_name` varchar(255) NOT NULL,
  `room_category_slug` varchar(255) NOT NULL,
  `room_category_price` float NOT NULL,
  `room_category_short_desc` text NOT NULL,
  `room_category_long_desc` text NOT NULL,
  `no_of_rooms` int(11) NOT NULL DEFAULT 0,
  `room_category_created_at` varchar(255) NOT NULL,
  `room_category_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_categories`
--

INSERT INTO `room_categories` (`room_category_id`, `room_category_name`, `room_category_slug`, `room_category_price`, `room_category_short_desc`, `room_category_long_desc`, `no_of_rooms`, `room_category_created_at`, `room_category_status`) VALUES
(6, 'Executive', 'executive', 50000, 'A shirt description', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 10, '1699287324', 'Active'),
(7, 'Stratton Suite', 'stratton-suite', 150000, 'A modern room with comfortable beds', '<h3><strong>The standard Lorem Ipsum passage, used since the 1500s</strong></h3><p class=\"ql-align-justify\">\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"</p><h3><strong>Section 1.10.32 of \"de Finibus Bonorum et Malorum\", written by Cicero in 45 BC</strong></h3><p class=\"ql-align-justify\">\"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?\"</p><h3><strong>1914 translation by H. Rackham</strong></h3><p class=\"ql-align-justify\">\"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?\"</p><p><br></p>', 10, '1699587916', 'Active'),
(8, 'Diplomatic Suite', 'diplomatic-suite', 200000, 'A modern room with comfortable beds', '<h3><strong>The standard Lorem Ipsum passage, used since the 1500s</strong></h3><p class=\"ql-align-justify\">\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"</p><h3><strong>Section 1.10.32 of \"de Finibus Bonorum et Malorum\", written by Cicero in 45 BC</strong></h3><p class=\"ql-align-justify\">\"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?\"</p><h3><strong>1914 translation by H. Rackham</strong></h3><p class=\"ql-align-justify\">\"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?\"</p><p><br></p>', 10, '1699588234', 'Active'),
(9, 'Regular Suites', 'regular-suites', 180000, 'A modern room with comfortable beds', '<h3><strong>The standard Lorem Ipsum passage, used since the 1500s</strong></h3><p class=\"ql-align-justify\">\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"</p><h3><strong>Section 1.10.32 of \"de Finibus Bonorum et Malorum\", written by Cicero in 45 BC</strong></h3><p class=\"ql-align-justify\">\"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?\"</p><h3><strong>1914 translation by H. Rackham</strong></h3><p class=\"ql-align-justify\">\"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?\"</p><p><br></p>', 10, '1699588706', 'Active'),
(10, 'Basic Room', 'basic-room', 50000, 'A modern room with comfortable beds', '<h3><strong>The standard Lorem Ipsum passage, used since the 1500s</strong></h3><p class=\"ql-align-justify\">\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"</p><h3><strong>Section 1.10.32 of \"de Finibus Bonorum et Malorum\", written by Cicero in 45 BC</strong></h3><p class=\"ql-align-justify\">\"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?\"</p><h3><strong>1914 translation by H. Rackham</strong></h3><p class=\"ql-align-justify\">\"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?\"</p><p><br></p>', 4, '1699588887', 'Active'),
(11, 'Presidential Suite', 'presidential-suite', 250000, 'A modern room with comfortable beds', '<h3><strong>The standard Lorem Ipsum passage, used since the 1500s</strong></h3><p class=\"ql-align-justify\">\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"</p><h3><strong>Section 1.10.32 of \"de Finibus Bonorum et Malorum\", written by Cicero in 45 BC</strong></h3><p class=\"ql-align-justify\">\"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?\"</p><h3><strong>1914 translation by H. Rackham</strong></h3><p class=\"ql-align-justify\">\"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?\"</p><p><br></p>', 10, '1699589033', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `room_category_images`
--

CREATE TABLE `room_category_images` (
  `room_category_image_id` int(11) NOT NULL,
  `room_category_id` int(11) DEFAULT NULL,
  `room_category_image_filename` varchar(255) NOT NULL,
  `room_category_image_mimetype` varchar(255) NOT NULL,
  `room_category_image_type` enum('Portrait','Landscape') NOT NULL,
  `room_category_image_status` enum('Published','Unpublished') NOT NULL DEFAULT 'Published'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_category_images`
--

INSERT INTO `room_category_images` (`room_category_image_id`, `room_category_id`, `room_category_image_filename`, `room_category_image_mimetype`, `room_category_image_type`, `room_category_image_status`) VALUES
(1, 6, 'aa1144bb-3f6b-47db-997d-c3811ccb41bb.jpg', 'image/jpeg', 'Portrait', 'Published'),
(2, 6, 'aa1144bb-3f6b-47db-997d-c3811ccb41bb.jpg', 'image/jpeg', 'Landscape', 'Published'),
(3, 6, '8551e97c-cd8b-4f8f-8df3-af028eb6845f.jpg', 'image/jpeg', 'Portrait', 'Published'),
(4, 6, '8551e97c-cd8b-4f8f-8df3-af028eb6845f.jpg', 'image/jpeg', 'Landscape', 'Published'),
(5, 6, 'fb66f049-4856-466b-9cb7-1cd332f900ea.jpg', 'image/jpeg', 'Portrait', 'Published'),
(7, 6, '5364b0a2-d135-4aad-bc6b-aa740b4511a6.jpg', 'image/jpeg', 'Portrait', 'Published'),
(8, 6, '5364b0a2-d135-4aad-bc6b-aa740b4511a6.jpg', 'image/jpeg', 'Landscape', 'Published'),
(9, 6, '8fad913b-382a-4bed-b30a-3aa30a0e6609.jpg', 'image/jpeg', 'Portrait', 'Published'),
(10, 6, '8fad913b-382a-4bed-b30a-3aa30a0e6609.jpg', 'image/jpeg', 'Landscape', 'Published'),
(11, 6, 'aa72a463-9e1c-4677-b4e3-b6ac6e2958a7.jpg', 'image/jpeg', 'Portrait', 'Published'),
(12, 6, 'aa72a463-9e1c-4677-b4e3-b6ac6e2958a7.jpg', 'image/jpeg', 'Landscape', 'Published'),
(13, 6, '3007bcbc-e68e-435c-8038-3de1ff5d6a54.jpg', 'image/jpeg', 'Portrait', 'Published'),
(14, 6, '3007bcbc-e68e-435c-8038-3de1ff5d6a54.jpg', 'image/jpeg', 'Landscape', 'Published'),
(15, 6, '63d9120a-7412-4ac8-96bd-d5e4d06b5703.jpg', 'image/jpeg', 'Portrait', 'Published'),
(16, 6, '63d9120a-7412-4ac8-96bd-d5e4d06b5703.jpg', 'image/jpeg', 'Landscape', 'Published'),
(17, 6, '3ca87bd4-543c-4a3a-89b4-383a25adf470.jpg', 'image/jpeg', 'Portrait', 'Published'),
(18, 6, '3ca87bd4-543c-4a3a-89b4-383a25adf470.jpg', 'image/jpeg', 'Landscape', 'Published'),
(19, 6, '4b8d76e3-028c-40a4-99b7-eed1b54b0775.jpg', 'image/jpeg', 'Portrait', 'Published'),
(20, 6, '4b8d76e3-028c-40a4-99b7-eed1b54b0775.jpg', 'image/jpeg', 'Landscape', 'Published'),
(21, 6, '0073d8d4-1096-4396-8ee2-a49f555c53c3.jpg', 'image/jpeg', 'Portrait', 'Published'),
(22, 6, '0073d8d4-1096-4396-8ee2-a49f555c53c3.jpg', 'image/jpeg', 'Landscape', 'Published'),
(23, 6, '53baf7b6-9eff-44af-b023-ba7128c0dfa8.jpg', 'image/jpeg', 'Portrait', 'Published'),
(24, 6, '53baf7b6-9eff-44af-b023-ba7128c0dfa8.jpg', 'image/jpeg', 'Landscape', 'Published'),
(25, 6, 'c0948ed5-9a17-4e5b-83b6-e15829ef2460.jpg', 'image/jpeg', 'Portrait', 'Published'),
(26, 6, 'c0948ed5-9a17-4e5b-83b6-e15829ef2460.jpg', 'image/jpeg', 'Landscape', 'Published'),
(27, 6, '4d8abb68-429c-4e6e-b26e-00deb5b929d0.jpg', 'image/jpeg', 'Portrait', 'Published'),
(28, 6, '4d8abb68-429c-4e6e-b26e-00deb5b929d0.jpg', 'image/jpeg', 'Landscape', 'Published'),
(29, 6, '3e25029a-b73b-479e-bd2a-933f41fe55ae.jpg', 'image/jpeg', 'Portrait', 'Published'),
(30, 6, '3e25029a-b73b-479e-bd2a-933f41fe55ae.jpg', 'image/jpeg', 'Landscape', 'Published'),
(31, 6, '76ac0d20-2932-4481-a40c-4c260869e765.jpg', 'image/jpeg', 'Portrait', 'Published'),
(32, 6, '76ac0d20-2932-4481-a40c-4c260869e765.jpg', 'image/jpeg', 'Landscape', 'Published'),
(33, 6, 'e6b7df9c-2b2e-4975-a83c-94a772cd7461.jpg', 'image/jpeg', 'Portrait', 'Published'),
(34, 6, 'e6b7df9c-2b2e-4975-a83c-94a772cd7461.jpg', 'image/jpeg', 'Landscape', 'Published'),
(35, 6, '923147d5-a7b6-40c6-8f10-785cb6504442.jpg', 'image/jpeg', 'Portrait', 'Published'),
(36, 6, '923147d5-a7b6-40c6-8f10-785cb6504442.jpg', 'image/jpeg', 'Landscape', 'Published'),
(37, 6, '80893398-1d7f-4fca-8ce3-342fc74cbbcf.jpg', 'image/jpeg', 'Portrait', 'Published'),
(38, 6, '80893398-1d7f-4fca-8ce3-342fc74cbbcf.jpg', 'image/jpeg', 'Landscape', 'Published'),
(39, 6, '98607587-99eb-4992-877c-48ea7d0d8de3.jpg', 'image/jpeg', 'Portrait', 'Published'),
(40, 6, '98607587-99eb-4992-877c-48ea7d0d8de3.jpg', 'image/jpeg', 'Landscape', 'Published'),
(41, 6, '778258f3-4473-4ce1-96b3-ea497d753441.jpg', 'image/jpeg', 'Portrait', 'Published'),
(42, 6, '778258f3-4473-4ce1-96b3-ea497d753441.jpg', 'image/jpeg', 'Landscape', 'Published'),
(43, 7, '052f5ec1-63e6-48b9-9c02-e18c54fd5663.jpg', 'image/jpeg', 'Portrait', 'Published'),
(44, 7, '052f5ec1-63e6-48b9-9c02-e18c54fd5663.jpg', 'image/jpeg', 'Landscape', 'Published'),
(45, 7, '781eb3d2-40be-4b74-af69-7892a3f133bb.jpg', 'image/jpeg', 'Portrait', 'Published'),
(46, 7, '781eb3d2-40be-4b74-af69-7892a3f133bb.jpg', 'image/jpeg', 'Landscape', 'Published'),
(47, 7, '1a59c0e2-602c-4410-b6a5-3f7ad5e9e1b3.jpg', 'image/jpeg', 'Portrait', 'Published'),
(48, 7, '1a59c0e2-602c-4410-b6a5-3f7ad5e9e1b3.jpg', 'image/jpeg', 'Landscape', 'Published'),
(49, 7, '5a784b71-072b-4c16-a13f-1ed2170cacd1.jpg', 'image/jpeg', 'Portrait', 'Published'),
(50, 7, '5a784b71-072b-4c16-a13f-1ed2170cacd1.jpg', 'image/jpeg', 'Landscape', 'Published'),
(51, 7, 'f4214b89-2f10-460c-90a3-cdc4ebdeb0c2.jpg', 'image/jpeg', 'Portrait', 'Published'),
(52, 7, 'f4214b89-2f10-460c-90a3-cdc4ebdeb0c2.jpg', 'image/jpeg', 'Landscape', 'Published'),
(53, 8, 'dbc66b58-dfc5-4ca9-b8a4-62486d9fc217.jpg', 'image/jpeg', 'Portrait', 'Published'),
(54, 8, 'dbc66b58-dfc5-4ca9-b8a4-62486d9fc217.jpg', 'image/jpeg', 'Landscape', 'Published'),
(55, 8, 'c20908d3-8df0-4ae8-8671-7103df60827f.jpg', 'image/jpeg', 'Portrait', 'Published'),
(56, 8, 'c20908d3-8df0-4ae8-8671-7103df60827f.jpg', 'image/jpeg', 'Landscape', 'Published'),
(57, 8, '5631e2bd-d02b-4633-ab2c-8136354ad920.jpg', 'image/jpeg', 'Portrait', 'Published'),
(58, 8, '5631e2bd-d02b-4633-ab2c-8136354ad920.jpg', 'image/jpeg', 'Landscape', 'Published'),
(59, 8, '80910709-0bb4-498b-a104-405b357c0a93.jpg', 'image/jpeg', 'Portrait', 'Published'),
(60, 8, '80910709-0bb4-498b-a104-405b357c0a93.jpg', 'image/jpeg', 'Landscape', 'Published'),
(61, 8, 'e37ae73c-6d93-489c-883b-b4e6496944db.jpg', 'image/jpeg', 'Portrait', 'Published'),
(62, 8, 'e37ae73c-6d93-489c-883b-b4e6496944db.jpg', 'image/jpeg', 'Landscape', 'Published'),
(63, 9, '71fc7e5d-ba22-476c-a15e-2a6da733d65b.jpg', 'image/jpeg', 'Portrait', 'Published'),
(64, 9, '71fc7e5d-ba22-476c-a15e-2a6da733d65b.jpg', 'image/jpeg', 'Landscape', 'Published'),
(65, 9, 'c9d1b96c-b0aa-4d24-938e-dbce198b98d1.jpg', 'image/jpeg', 'Portrait', 'Published'),
(66, 9, 'c9d1b96c-b0aa-4d24-938e-dbce198b98d1.jpg', 'image/jpeg', 'Landscape', 'Published'),
(67, 9, '74efa2e3-c498-4879-be57-150ef377c78c.jpg', 'image/jpeg', 'Portrait', 'Published'),
(68, 9, '74efa2e3-c498-4879-be57-150ef377c78c.jpg', 'image/jpeg', 'Landscape', 'Published'),
(69, 10, 'dcbaaac2-c197-4aae-98b6-ea6a2ab85685.jpg', 'image/jpeg', 'Portrait', 'Published'),
(70, 10, 'dcbaaac2-c197-4aae-98b6-ea6a2ab85685.jpg', 'image/jpeg', 'Landscape', 'Published'),
(71, 10, 'e4bb0d98-8ed3-468e-9cf3-3376513747bb.jpg', 'image/jpeg', 'Portrait', 'Published'),
(72, 10, 'e4bb0d98-8ed3-468e-9cf3-3376513747bb.jpg', 'image/jpeg', 'Landscape', 'Published'),
(73, 10, '9eb61ae0-878c-417e-b749-93dd483d1f6a.jpg', 'image/jpeg', 'Portrait', 'Published'),
(74, 10, '9eb61ae0-878c-417e-b749-93dd483d1f6a.jpg', 'image/jpeg', 'Landscape', 'Published'),
(75, 11, '5a04f450-9387-49a4-af88-ce14fd6dc5a1.jpg', 'image/jpeg', 'Portrait', 'Published'),
(76, 11, '5a04f450-9387-49a4-af88-ce14fd6dc5a1.jpg', 'image/jpeg', 'Landscape', 'Published'),
(77, 11, '023a070d-680a-41b4-b42e-773b4fa0e3b5.jpg', 'image/jpeg', 'Portrait', 'Published'),
(78, 11, '023a070d-680a-41b4-b42e-773b4fa0e3b5.jpg', 'image/jpeg', 'Landscape', 'Published'),
(79, 11, 'bd2605d0-48c2-4e5f-8f28-b861173d3972.jpg', 'image/jpeg', 'Portrait', 'Published'),
(80, 11, 'bd2605d0-48c2-4e5f-8f28-b861173d3972.jpg', 'image/jpeg', 'Landscape', 'Published'),
(81, 11, '8b7f00c4-a4ef-4e1d-825a-8af9bfb53099.jpg', 'image/jpeg', 'Portrait', 'Published'),
(82, 11, '8b7f00c4-a4ef-4e1d-825a-8af9bfb53099.jpg', 'image/jpeg', 'Landscape', 'Published'),
(83, 11, 'df9c640b-5b3e-4e7c-ad57-2378fe7235dd.jpg', 'image/jpeg', 'Portrait', 'Published'),
(84, 11, 'df9c640b-5b3e-4e7c-ad57-2378fe7235dd.jpg', 'image/jpeg', 'Landscape', 'Published'),
(85, NULL, 'cb623497-1d96-469c-92bd-695184d2cc60.jpg', 'image/jpeg', 'Portrait', 'Published'),
(86, NULL, 'cb623497-1d96-469c-92bd-695184d2cc60.jpg', 'image/jpeg', 'Landscape', 'Published'),
(87, NULL, 'f5a06d65-7811-441b-a060-ec4d32c30296.jpg', 'image/jpeg', 'Portrait', 'Published'),
(88, NULL, 'f5a06d65-7811-441b-a060-ec4d32c30296.jpg', 'image/jpeg', 'Landscape', 'Published'),
(89, NULL, '7531e617-ee89-44b7-89f0-4084348f9f4c.jpg', 'image/jpeg', 'Portrait', 'Published'),
(90, NULL, '7531e617-ee89-44b7-89f0-4084348f9f4c.jpg', 'image/jpeg', 'Landscape', 'Published'),
(91, NULL, '0351641a-c040-4216-8bc3-34a0a2d9a4af.jpg', 'image/jpeg', 'Portrait', 'Published'),
(92, NULL, '0351641a-c040-4216-8bc3-34a0a2d9a4af.jpg', 'image/jpeg', 'Landscape', 'Published'),
(93, 10, '3b984f7b-716f-4928-9f90-40235c37557d.jpg', 'image/jpeg', 'Portrait', 'Published'),
(94, 10, '3b984f7b-716f-4928-9f90-40235c37557d.jpg', 'image/jpeg', 'Landscape', 'Published'),
(95, 10, '9cb3c71a-9bac-459f-be59-855352f9b72d.jpg', 'image/jpeg', 'Portrait', 'Published'),
(96, 10, '9cb3c71a-9bac-459f-be59-855352f9b72d.jpg', 'image/jpeg', 'Landscape', 'Published'),
(97, 10, '51fb477e-ac59-4bd2-b8ef-02af5a99604c.jpg', 'image/jpeg', 'Portrait', 'Published'),
(98, 10, '51fb477e-ac59-4bd2-b8ef-02af5a99604c.jpg', 'image/jpeg', 'Landscape', 'Published'),
(99, 10, '45c9fd28-03eb-4211-8264-e02f993f5b68.jpg', 'image/jpeg', 'Portrait', 'Published'),
(100, 10, '45c9fd28-03eb-4211-8264-e02f993f5b68.jpg', 'image/jpeg', 'Landscape', 'Published'),
(101, 10, '186397f5-9503-416b-8e96-4e88c4eeccf3.jpg', 'image/jpeg', 'Portrait', 'Published'),
(102, 10, '186397f5-9503-416b-8e96-4e88c4eeccf3.jpg', 'image/jpeg', 'Landscape', 'Published'),
(103, 10, '91cf64b7-823f-4651-8f6f-f775c409073e.jpg', 'image/jpeg', 'Portrait', 'Published');

-- --------------------------------------------------------

--
-- Table structure for table `room_features`
--

CREATE TABLE `room_features` (
  `room_feature_id` int(11) NOT NULL,
  `room_category_id` int(11) NOT NULL,
  `room_feature` varchar(255) NOT NULL,
  `room_feature_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_features`
--

INSERT INTO `room_features` (`room_feature_id`, `room_category_id`, `room_feature`, `room_feature_status`) VALUES
(44, 6, '1-2 Persons', 'Active'),
(45, 6, 'Breakfast', 'Active'),
(46, 6, 'Free Wifi', 'Active'),
(47, 6, '200 sqft room', 'Active'),
(48, 6, 'Twin Bed', 'Active'),
(49, 6, 'Swimming Pool', 'Active'),
(50, 7, 'Free Wifi', 'Active'),
(51, 7, 'Free Dinner', 'Active'),
(52, 7, 'Free Breakfast', 'Active'),
(53, 7, 'Spa', 'Active'),
(54, 7, 'Comfortable Beds', 'Active'),
(55, 8, 'Free Airport pickup', 'Active'),
(56, 8, 'Free Spa', 'Active'),
(57, 8, 'Free Gym', 'Active'),
(58, 8, 'Free Breakfast', 'Active'),
(59, 9, 'Floffy Pillos', 'Active'),
(60, 9, 'Big Beds', 'Active'),
(61, 9, 'Room Service', 'Active'),
(62, 10, 'Room Service', 'Active'),
(63, 11, 'Free airport pickup', 'Active'),
(64, 11, 'Breakfast', 'Active'),
(65, 11, 'Dinner', 'Active'),
(66, 11, 'Lunch', 'Active'),
(67, 11, 'Gym', 'Active'),
(68, 11, 'Spa', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_firstname` varchar(255) NOT NULL,
  `user_lastname` varchar(255) NOT NULL,
  `user_phone` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_role` enum('Admin','Customer','Super Admin') NOT NULL DEFAULT 'Customer',
  `plain_password` varchar(255) NOT NULL,
  `enc_password` varchar(255) NOT NULL,
  `user_created_at` varchar(255) NOT NULL,
  `user_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_firstname`, `user_lastname`, `user_phone`, `user_email`, `user_role`, `plain_password`, `enc_password`, `user_created_at`, `user_status`) VALUES
(1, 'Jon', 'Snow', '09087262762', 'jonsnow@example.com', 'Admin', 'strongpass', 'U2FsdGVkX1/ufjbrfTC66n9osMhJ8V/+Wc/baapN1mY=', '1697228235', 'Active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `reservation_id` (`reservation_id`),
  ADD KEY `reservation_id_2` (`reservation_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `room_category_id` (`room_category_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `room_category_id` (`room_category_id`);

--
-- Indexes for table `room_categories`
--
ALTER TABLE `room_categories`
  ADD PRIMARY KEY (`room_category_id`);

--
-- Indexes for table `room_category_images`
--
ALTER TABLE `room_category_images`
  ADD PRIMARY KEY (`room_category_image_id`),
  ADD KEY `room_category_id` (`room_category_id`);

--
-- Indexes for table `room_features`
--
ALTER TABLE `room_features`
  ADD PRIMARY KEY (`room_feature_id`),
  ADD KEY `room_category_id` (`room_category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `room_categories`
--
ALTER TABLE `room_categories`
  MODIFY `room_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `room_category_images`
--
ALTER TABLE `room_category_images`
  MODIFY `room_category_image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `room_features`
--
ALTER TABLE `room_features`
  MODIFY `room_feature_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`reservation_id`) ON UPDATE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`room_category_id`) REFERENCES `room_categories` (`room_category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`room_category_id`) REFERENCES `room_categories` (`room_category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `room_category_images`
--
ALTER TABLE `room_category_images`
  ADD CONSTRAINT `room_category_images_ibfk_2` FOREIGN KEY (`room_category_id`) REFERENCES `room_categories` (`room_category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `room_features`
--
ALTER TABLE `room_features`
  ADD CONSTRAINT `room_features_ibfk_2` FOREIGN KEY (`room_category_id`) REFERENCES `room_categories` (`room_category_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
