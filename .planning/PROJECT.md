# Project: Danaco Frozen Food E-Commerce System

**Status:** In Planning  
**Created:** April 8, 2026  
**Version:** 1.0

## Vision

Build a complete multi-role e-commerce platform for Danaco frozen food distribution with specialized dashboards for customers, administrators, inventory managers, order managers, finance managers, and delivery staff.

## Tech Stack

- **Frontend:** React + Three.js (3D visualization, product browsing)
- **Backend:** Spring Boot (Java microservices)
- **Database:** PostgreSQL
- **Architecture:** REST API, role-based access control (RBAC)

## User Roles & Permissions

### Customer
- User management (login, register, profile)
- Shopping (browse, add/edit/remove from cart, checkout)
- Order tracking (view status, feedback, cancel, approve delivery)
- Payment (choose method and address at checkout)

### Admin
- Staff management (add, edit, remove, manage roles)
- System oversight (view finance reports, access all staff, view system logs)
- User management (block users after 3+ cancellations, track activity)
- Content approval (approve/reject inventory items added by managers)
- Refund authorization

### Inventory Manager
- Product CRUD (add, edit, remove items with name, description, image, category)
- Stock management (update quantities, increase/decrease)
- Notifications (alert admin, order manager, finance when stock changes)
- Stock alerts (notify when low)

### Order Manager
- Order processing (view, filter by date/status, approve/reject)
- Status management (pending → approved → processing → shipped → delivered → cancelled)
- Tracking (auto-generate tracking numbers, update delivery info)
- Invoice generation (auto-create after approval, include order & payment details, send to email)
- Customer service (view complaints, respond to issues, update status, handle refund requests)
- Driver assignment (view available drivers, manually assign to orders)

### Finance Manager
- Payment monitoring (view all transactions, customer details, filter by method/date)
- Revenue reporting (daily, monthly, yearly reports; filter by category/product)
- Refund processing (approve, reject, process transactions)
- Export (PDF and Excel formats)

### Delivery Staff
- Order visibility (view assigned deliveries, customer name, phone, address)
- Status updates (out for delivery, delivered, failed, picked up)
- Proof of delivery (photo, customer signature, delivery notes)
- Customer contact (call, WhatsApp integration)

## High-Level Requirements

### Authentication & Authorization
- Secure login/register with email or phone number
- Password reset with verification code (phone/email)
- Role-based access control (RBAC)
- Profile management (personal info, password, email/phone updates)

### Product Management
- Product catalog with name, description, image, category, stock quantity
- Stock alerts when inventory runs low
- Notifications to relevant stakeholders on product changes

### Order Management
- Full order lifecycle: pending → approved → processing → shipped → delivered
- Cart management (add, edit, remove items)
- Multiple payment methods at checkout
- Billing/shipping address selection
- Invoice generation and email delivery
- Order tracking with real-time status updates
- Cancellation handling (before approval only)
- Refund workflow (request, approval, processing)

### Financial Management
- Transaction tracking by customer, payment method, date
- Revenue reporting with time-based and category-based filtering
- Financial report export (PDF, Excel)
- Refund request management

### Delivery Management
- Driver assignment (manual)
- Route optimization (view available drivers)
- Delivery proof collection (photo, signature, notes)
- Customer notification on delivery completion
- Customer contact methods (call, WhatsApp)

### Admin Dashboard
- System-wide logging and audit trail
- Staff management interface
- User blocking rules (>3 cancellations → auto-block)
- Multi-role access oversight

## Non-Functional Requirements

- **Performance:** Fast checkout, quick order status retrieval
- **Security:** HTTPS, password hashing, RBAC enforcement, PCI compliance for payments
- **Scalability:** Support multiple concurrent users per role, handle peak order volumes
- **Availability:** 99%+ uptime (production)
- **Usability:** Responsive UI for desktop and mobile, intuitive dashboards per role

## Key Constraints

- No animations per design requirements (clean, professional look)
- Phone number and email both accepted for login
- Stock notifications must reach admin, order manager, finance manager simultaneously
- Delivery proof is mandatory before marking order as delivered
- Refunds require finance manager approval
- User blocking is automatic after 3rd cancellation
- Invoice generation is automatic post-approval

## Success Criteria

- ✅ All 6 roles can log in and access role-specific features
- ✅ Customers can complete end-to-end purchase (browse → cart → checkout → tracking)
- ✅ Inventory changes trigger notifications to correct stakeholders
- ✅ Orders flow through complete lifecycle with audit trail
- ✅ Financial reports can be generated and exported
- ✅ Delivery staff can mark orders as delivered with proof
- ✅ Admin can view and manage all aspects of system
- ✅ System handles 1000+ concurrent users without degradation
