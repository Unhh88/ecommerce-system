CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Role/Permission reference
-- Never modify this table - used for RBAC enforcement
CREATE TABLE role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO role (name, description) VALUES
    ('CUSTOMER', 'Customer - can browse, order, track'),
    ('ADMIN', 'Administrator - full system access'),
    ('INVENTORY_MANAGER', 'Inventory Manager - manage products and stock'),
    ('ORDER_MANAGER', 'Order Manager - process and track orders'),
    ('FINANCE_MANAGER', 'Finance Manager - view payments and process refunds'),
    ('DELIVERY_STAFF', 'Delivery Staff - manage order deliveries')
ON CONFLICT (name) DO NOTHING;

-- Users table
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_blocked BOOLEAN DEFAULT FALSE,
    failed_orders_count INT DEFAULT 0,
    role_id UUID NOT NULL REFERENCES role(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT email_or_phone CHECK (email IS NOT NULL OR phone_number IS NOT NULL)
);

-- User address table
CREATE TABLE user_address (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE product (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    image_url VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES "user"(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock history (for audit trail)
CREATE TABLE stock_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    previous_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    change_reason VARCHAR(100),
    changed_by UUID NOT NULL REFERENCES "user"(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order table
CREATE TABLE "order" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES "user"(id),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    billing_address_id UUID REFERENCES user_address(id),
    shipping_address_id UUID REFERENCES user_address(id),
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP
);

-- Order items (line items)
CREATE TABLE order_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES product(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment table
CREATE TABLE payment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES "order"(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- Delivery table
CREATE TABLE delivery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES "order"(id),
    delivery_staff_id UUID REFERENCES "user"(id),
    status VARCHAR(50) DEFAULT 'PENDING',
    delivery_address_id UUID REFERENCES user_address(id),
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    delivery_notes TEXT,
    proof_photo_url VARCHAR(500),
    customer_signature_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification table
CREATE TABLE notification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_order_id UUID REFERENCES "order"(id),
    related_product_id UUID REFERENCES product(id),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Complaint/Issue table
CREATE TABLE complaint (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES "order"(id),
    customer_id UUID NOT NULL REFERENCES "user"(id),
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN',
    response TEXT,
    assigned_to UUID REFERENCES "user"(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refund request table
CREATE TABLE refund_request (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES "order"(id),
    customer_id UUID NOT NULL REFERENCES "user"(id),
    amount DECIMAL(10, 2) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    approved_by UUID REFERENCES "user"(id),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoice table
CREATE TABLE invoice (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES "order"(id),
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    pdf_url VARCHAR(500),
    total_amount DECIMAL(10, 2) NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE
);

-- Audit log table
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    user_id UUID REFERENCES "user"(id),
    changes JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_phone ON "user"(phone_number);
CREATE INDEX idx_user_role_id ON "user"(role_id);
CREATE INDEX idx_product_category ON product(category);
CREATE INDEX idx_product_is_active ON product(is_active);
CREATE INDEX idx_order_customer_id ON "order"(customer_id);
CREATE INDEX idx_order_status ON "order"(status);
CREATE INDEX idx_order_created_at ON "order"(created_at);
CREATE INDEX idx_order_item_order_id ON order_item(order_id);
CREATE INDEX idx_order_item_product_id ON order_item(product_id);
CREATE INDEX idx_payment_order_id ON payment(order_id);
CREATE INDEX idx_payment_status ON payment(status);
CREATE INDEX idx_delivery_order_id ON delivery(order_id);
CREATE INDEX idx_delivery_staff_id ON delivery(delivery_staff_id);
CREATE INDEX idx_notification_recipient_id ON notification(recipient_id);
CREATE INDEX idx_notification_is_read ON notification(is_read);
CREATE INDEX idx_complaint_order_id ON complaint(order_id);
CREATE INDEX idx_complaint_status ON complaint(status);
CREATE INDEX idx_refund_order_id ON refund_request(order_id);
CREATE INDEX idx_refund_status ON refund_request(status);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
