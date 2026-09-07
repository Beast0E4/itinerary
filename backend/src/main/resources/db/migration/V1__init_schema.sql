-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- TRIPS
-- ============================================
CREATE TABLE trips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(500),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PLANNING',
    primary_currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_trip_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- DESTINATIONS (locations within a trip)
-- ============================================
CREATE TABLE destinations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    country VARCHAR(100),
    city VARCHAR(100),
    latitude DOUBLE,
    longitude DOUBLE,
    arrival_date DATE,
    departure_date DATE,
    display_order INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_dest_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- ITINERARY DAYS
-- ============================================
CREATE TABLE itinerary_days (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    destination_id BIGINT,
    day_number INT NOT NULL,
    date DATE NOT NULL,
    title VARCHAR(200),
    notes TEXT,
    CONSTRAINT fk_day_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_day_dest FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL,
    CONSTRAINT uq_trip_day UNIQUE (trip_id, day_number)
) ENGINE=InnoDB;

-- ============================================
-- ITINERARY ITEMS (timeline entries within a day)
-- ============================================
CREATE TABLE itinerary_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    itinerary_day_id BIGINT NOT NULL,
    item_type VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location_name VARCHAR(200),
    latitude DOUBLE,
    longitude DOUBLE,
    start_time TIME,
    end_time TIME,
    display_order INT NOT NULL DEFAULT 0,
    cost DECIMAL(12,2),
    currency VARCHAR(10),
    booking_ref VARCHAR(100),
    external_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_item_day FOREIGN KEY (itinerary_day_id) REFERENCES itinerary_days(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- ACCOMMODATIONS
-- ============================================
CREATE TABLE accommodations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    destination_id BIGINT,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(300),
    check_in_date DATE,
    check_out_date DATE,
    confirmation_number VARCHAR(100),
    cost_per_night DECIMAL(12,2),
    currency VARCHAR(10) DEFAULT 'USD',
    notes TEXT,
    CONSTRAINT fk_accom_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_accom_dest FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- TRANSPORTATION
-- ============================================
CREATE TABLE transportation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    mode VARCHAR(30) NOT NULL,
    provider VARCHAR(150),
    departure_location VARCHAR(200),
    arrival_location VARCHAR(200),
    departure_datetime DATETIME,
    arrival_datetime DATETIME,
    confirmation_number VARCHAR(100),
    cost DECIMAL(12,2),
    currency VARCHAR(10) DEFAULT 'USD',
    notes TEXT,
    CONSTRAINT fk_transport_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- ACTIVITIES (bookable/plannable activities catalog per trip)
-- ============================================
CREATE TABLE activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    destination_id BIGINT,
    itinerary_item_id BIGINT,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(80),
    duration_minutes INT,
    price DECIMAL(12,2),
    currency VARCHAR(10) DEFAULT 'USD',
    rating DECIMAL(3,1),
    image_url VARCHAR(500),
    booked BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_activity_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_activity_dest FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL,
    CONSTRAINT fk_activity_item FOREIGN KEY (itinerary_item_id) REFERENCES itinerary_items(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- BUDGETS
-- ============================================
CREATE TABLE budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL UNIQUE,
    total_budget DECIMAL(12,2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    accommodation_limit DECIMAL(12,2) DEFAULT 0,
    transport_limit DECIMAL(12,2) DEFAULT 0,
    food_limit DECIMAL(12,2) DEFAULT 0,
    activities_limit DECIMAL(12,2) DEFAULT 0,
    misc_limit DECIMAL(12,2) DEFAULT 0,
    CONSTRAINT fk_budget_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- EXPENSES
-- ============================================
CREATE TABLE expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    paid_by_user_id BIGINT,
    category VARCHAR(30) NOT NULL,
    description VARCHAR(300) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    expense_date DATE NOT NULL,
    receipt_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_expense_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_expense_user FOREIGN KEY (paid_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- PACKING LIST ITEMS
-- ============================================
CREATE TABLE packing_list_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    category VARCHAR(80) NOT NULL DEFAULT 'General',
    item_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    is_packed BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_packing_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- DOCUMENTS (passports, tickets, insurance, etc.)
-- ============================================
CREATE TABLE documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    uploaded_by_user_id BIGINT,
    name VARCHAR(200) NOT NULL,
    doc_type VARCHAR(60),
    file_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doc_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_doc_user FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- COLLABORATORS (trip sharing / permissions)
-- ============================================
CREATE TABLE collaborators (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'VIEWER',
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_collab_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_collab_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_trip_user UNIQUE (trip_id, user_id)
) ENGINE=InnoDB;

-- ============================================
-- NOTES (freeform trip notes)
-- ============================================
CREATE TABLE notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    author_id BIGINT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_note_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_note_user FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;