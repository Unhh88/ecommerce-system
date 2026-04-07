# 🚀 START CODING — Phase 1 Execution Guide

**Project:** Danaco Frozen Food E-Commerce System  
**Phase:** 01 — Database & API Foundation  
**Status:** Ready to Code  
**Date:** April 8, 2026

---

## 📋 Overview

**Phase 1** is split into **2 sequential plans** (2 waves):

| Wave | Plan | Focus | Est. Time |
|------|------|-------|-----------|
| 1️⃣ | **01-01** | Create 14 JPA entity classes | 2-3 hours |
| 2️⃣ | **01-02** | Create repositories & REST API | 2-3 hours |

**Total Time:** ~4-6 hours for complete Phase 1

---

## ✅ Prerequisites

Before starting, you need:

```bash
# Check Java version (must be 17+)
java -version

# Check Maven installed
mvn --version

# Check Docker running
docker --version

# Check Git
git --version
```

If any are missing, install them before proceeding.

---

## 🎯 Step 1: Phase 01-01 — Entity Models (Wave 1 / ~2-3 hours)

### 1.1 Read the Plan
Open and review the detailed execution plan:
```
.planning/phases/01-foundation/01-01-PLAN.md
```

This shows:
- 5 tasks to complete in order
- Exact code for each entity class
- What to verify after each task
- Success criteria

### 1.2 Execute Task 1: Create Role & User Entities

**File 1:** `backend/danaco/src/main/java/com/danaco/entity/Role.java`

```java
package com.danaco.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "role")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @Column(unique = true, nullable = false, length = 50)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

**File 2:** `backend/danaco/src/main/java/com/danaco/entity/User.java`

```java
package com.danaco.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "\"user\"")  // Quoted because 'user' is reserved
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @Column(unique = true, length = 255)
    private String email;
    
    @Column(unique = true, length = 20)
    private String phoneNumber;
    
    @Column(unique = true, nullable = false, length = 100)
    private String username;
    
    @Column(nullable = false, length = 255)
    private String passwordHash;
    
    @Column(length = 100)
    private String firstName;
    
    @Column(length = 100)
    private String lastName;
    
    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isActive = true;
    
    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isBlocked = false;
    
    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private Integer failedOrdersCount = 0;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.DELETE, orphanRemoval = true)
    private List<UserAddress> addresses;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

**Verify:**
```bash
cd backend/danaco
mvn compile -DskipTests
# Should print: BUILD SUCCESS
```

### 1.3 Execute Task 2: Create Product & StockHistory Entities

**File 1:** `backend/danaco/src/main/java/com/danaco/entity/Product.java`

```java
package com.danaco.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @Column(unique = true, nullable = false, length = 255)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, length = 100)
    private String category;
    
    @Column(length = 500)
    private String imageUrl;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(nullable = false, columnDefinition = "INTEGER DEFAULT 0")
    private Integer stockQuantity = 0;
    
    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isActive = true;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.DELETE, orphanRemoval = true)
    private List<StockHistory> stockHistories;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

**File 2:** `backend/danaco/src/main/java/com/danaco/entity/StockHistory.java`

```java
package com.danaco.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "stock_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockHistory {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(nullable = false)
    private Integer previousQuantity;
    
    @Column(nullable = false)
    private Integer newQuantity;
    
    @Column(length = 100)
    private String changeReason;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "changed_by", nullable = false)
    private User changedBy;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

**Verify:**
```bash
mvn compile -DskipTests
# Should print: BUILD SUCCESS
```

### 1.4 Execute Task 3: Create Order & OrderItem Entities

**File 1:** `backend/danaco/src/main/java/com/danaco/entity/Order.java`

```java
package com.danaco.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "\"order\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    @Column(unique = true, nullable = false, length = 50)
    private String orderNumber;
    
    @Column(nullable = false, length = 50, columnDefinition = "VARCHAR(50) DEFAULT 'PENDING'")
    private String status = "PENDING";  // PENDING, APPROVED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(length = 50)
    private String paymentMethod;
    
    @ManyToOne
    @JoinColumn(name = "billing_address_id")
    private UserAddress billingAddress;
    
    @ManyToOne
    @JoinColumn(name = "shipping_address_id")
    private UserAddress shippingAddress;
    
    @Column(length = 100)
    private String trackingNumber;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @OneToMany(mappedBy = "order", cascade = {CascadeType.DELETE, CascadeType.PERSIST}, orphanRemoval = true)
    private List<OrderItem> items;
    
    @Column
    private LocalDateTime approvedAt;
    
    @Column
    private LocalDateTime shippedAt;
    
    @Column
    private LocalDateTime deliveredAt;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

**File 2:** `backend/danaco/src/main/java/com/danaco/entity/OrderItem.java`

```java
package com.danaco.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "order_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

**Verify:**
```bash
mvn compile -DskipTests
# Should print: BUILD SUCCESS
```

### 1.5 Execute Task 4: Create Payment, Delivery, UserAddress Entities

**File 1:** `backend/danaco/src/main/java/com/danaco/entity/UserAddress.java`

```java
package com.danaco.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_address")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAddress {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false, length = 255)
    private String addressLine1;
    
    @Column(length = 255)
    private String addressLine2;
    
    @Column(nullable = false, length = 100)
    private String city;
    
    @Column(length = 100)
    private String stateProvince;
    
    @Column(length = 20)
    private String postalCode;
    
    @Column(nullable = false, length = 100)
    private String country;
    
    @Column(length = 20)
    private String phoneNumber;
    
    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isDefault = false;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

**File 2:** `backend/danaco/src/main/java/com/danaco/entity/Payment.java`

```java
package com.danaco.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @OneToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(nullable = false, length = 50)
    private String paymentMethod;
    
    @Column(nullable = false, length = 50, columnDefinition = "VARCHAR(50) DEFAULT 'PENDING'")
    private String status = "PENDING";  // PENDING, COMPLETED, FAILED, REFUNDED
    
    @Column(length = 255)
    private String transactionId;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime processedAt;
}
```

**File 3:** `backend/danaco/src/main/java/com/danaco/entity/Delivery.java`

```java
package com.danaco.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "delivery")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @OneToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @ManyToOne
    @JoinColumn(name = "delivery_staff_id")
    private User deliveryStaff;
    
    @Column(nullable = false, length = 50, columnDefinition = "VARCHAR(50) DEFAULT 'PENDING'")
    private String status = "PENDING";  // PENDING, OUT_FOR_DELIVERY, DELIVERED, FAILED_DELIVERY, ORDER_PICKED_UP
    
    @ManyToOne
    @JoinColumn(name = "delivery_address_id")
    private UserAddress deliveryAddress;
    
    @Column
    private LocalDate estimatedDeliveryDate;
    
    @Column
    private LocalDate actualDeliveryDate;
    
    @Column(columnDefinition = "TEXT")
    private String deliveryNotes;
    
    @Column(length = 500)
    private String proofPhotoUrl;
    
    @Column(length = 500)
    private String customerSignatureUrl;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

**Verify:**
```bash
mvn compile -DskipTests
# Should print: BUILD SUCCESS
```

### 1.6 Execute Task 5: Create Notification, Complaint, Refund, Invoice, AuditLog Entities

**File 1:** `backend/danaco/src/main/java/com/danaco/entity/Notification.java`

```java
package com.danaco.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notification")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;
    
    @Column(nullable = false, length = 50)
    private String type;
    
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column
    private UUID relatedOrderId;
    
    @Column
    private UUID relatedProductId;
    
    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isRead = false;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

**File 2:** `backend/danaco/src/main/java/com/danaco/entity/Complaint.java`

```java
package com.danaco.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "complaint")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, length = 50, columnDefinition = "VARCHAR(50) DEFAULT 'OPEN'")
    private String status = "OPEN";  // OPEN, IN_PROGRESS, RESOLVED, CLOSED
    
    @Column(columnDefinition = "TEXT")
    private String response;
    
    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

**File 3:** `backend/danaco/src/main/java/com/danaco/entity/RefundRequest.java`

```java
package com.danaco.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "refund_request")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefundRequest {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;
    
    @Column(nullable = false, length = 50, columnDefinition = "VARCHAR(50) DEFAULT 'PENDING'")
    private String status = "PENDING";  // PENDING, APPROVED, REJECTED, PROCESSED
    
    @ManyToOne
    @JoinColumn(name = "approved_by")
    private User approvedBy;
    
    @Column
    private LocalDateTime processedAt;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

**File 4:** `backend/danaco/src/main/java/com/danaco/entity/Invoice.java`

```java
package com.danaco.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "invoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @OneToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @Column(unique = true, nullable = false, length = 50)
    private String invoiceNumber;
    
    @Column(length = 500)
    private String pdfUrl;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @CreationTimestamp
    private LocalDateTime issuedAt;
    
    @Column
    private LocalDate dueDate;
}
```

**File 5:** `backend/danaco/src/main/java/com/danaco/entity/AuditLog.java`

```java
package com.danaco.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @Column(nullable = false, length = 100)
    private String action;
    
    @Column(nullable = false, length = 50)
    private String entityType;
    
    @Column
    private UUID entityId;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(columnDefinition = "jsonb")
    private String changes;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

**Verify — Final Compilation:**
```bash
mvn clean compile -DskipTests
# Should print: BUILD SUCCESS
```

### ✅ Task 1 Complete!

You've created all 14 JPA entities. Next: **Phase 01-02 (REST API & Repositories)**

---

## 🎯 Step 2: Phase 01-02 — Repositories & REST API (Wave 2 / ~2-3 hours)

### 2.1 Read the Plan
```
.planning/phases/01-foundation/01-02-PLAN.md
```

### 2.2 Execute Task 1: Create Spring Data JPA Repositories

**File 1:** `backend/danaco/src/main/java/com/danaco/repository/RoleRepository.java`

```java
package com.danaco.repository;

import com.danaco.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(String name);
}
```

**File 2:** `backend/danaco/src/main/java/com/danaco/repository/UserRepository.java`

```java
package com.danaco.repository;

import com.danaco.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findByUsername(String username);
}
```

**File 3:** `backend/danaco/src/main/java/com/danaco/repository/ProductRepository.java`

```java
package com.danaco.repository;

import com.danaco.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByIsActiveTrueOrderByCreatedAtDesc();
    List<Product> findByCategory(String category);
    List<Product> findByNameContainingIgnoreCase(String name);
}
```

**File 4:** `backend/danaco/src/main/java/com/danaco/repository/OrderRepository.java`

```java
package com.danaco.repository;

import com.danaco.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);
    List<Order> findByStatusOrderByCreatedAtDesc(String status);
}
```

**Verify:**
```bash
mvn compile -DskipTests
# Should print: BUILD SUCCESS
```

### 2.3 Execute Task 2: Create Spring Security Configuration

**File:** `backend/danaco/src/main/java/com/danaco/config/WebSecurityConfig.java`

```java
package com.danaco.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/swagger-ui.html", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/api/v1/health").permitAll()
                .anyRequest().permitAll()
            );
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**Verify:**
```bash
mvn compile -DskipTests
# Should print: BUILD SUCCESS
```

### 2.4 Execute Task 3: Create REST Controllers

**File 1:** `backend/danaco/src/main/java/com/danaco/api/HealthController.java`

```java
package com.danaco.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "message", "Danaco API is running"
        ));
    }
}
```

**File 2:** `backend/danaco/src/main/java/com/danaco/api/ProductController.java`

```java
package com.danaco.api;

import com.danaco.entity.Product;
import com.danaco.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    
    @Autowired
    private ProductRepository productRepository;
    
    @GetMapping
    public ResponseEntity<List<Product>> getAllActiveProducts() {
        List<Product> products = productRepository.findByIsActiveTrueOrderByCreatedAtDesc();
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable UUID id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category) {
        List<Product> products;
        
        if (name != null && !name.isEmpty()) {
            products = productRepository.findByNameContainingIgnoreCase(name);
        } else if (category != null && !category.isEmpty()) {
            products = productRepository.findByCategory(category);
        } else {
            products = productRepository.findByIsActiveTrueOrderByCreatedAtDesc();
        }
        
        return ResponseEntity.ok(products);
    }
}
```

**Verify:**
```bash
mvn clean compile -DskipTests
# Should print: BUILD SUCCESS
```

### 2.5 Execute Task 4: Test the Application

#### Step 1: Start PostgreSQL
```bash
docker-compose up -d
```

Wait for health check:
```bash
docker-compose ps
# postgres should show "(healthy)"
```

#### Step 2: Build & Run Backend
```bash
cd backend/danaco
mvn clean install
mvn spring-boot:run
```

You should see:
```
INFO  o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http)
INFO  c.danaco.DanacoApplication               : Started DanacoApplication in X.XXX seconds
```

#### Step 3: Test Health Endpoint (in another terminal)
```bash
curl http://localhost:8080/api/v1/health
```

Expected response:
```json
{"status":"UP","message":"Danaco API is running"}
```

#### Step 4: Test Product Endpoint
```bash
curl http://localhost:8080/api/v1/products
```

Expected response (empty, no data seeded yet):
```json
[]
```

#### Step 5: Check Swagger UI
Open: `http://localhost:8080/swagger-ui.html`

You should see:
- Health endpoint documented
- Product endpoints documented
- Ability to test endpoints in the browser

#### Step 6: Verify Database
```bash
psql -U danaco_user -d danaco -h localhost
```

In psql:
```sql
\dt
```

Should show 14 tables:
```
role, "user", user_address, product, stock_history,
"order", order_item, payment, delivery, notification,
complaint, refund_request, invoice, audit_log
```

### ✅ Phase 1 Complete!

All 14 entities created, repositories configured, REST API running, and database connected.

---

## 📊 What You've Accomplished

| Milestone | Status |
|-----------|--------|
| ✅ JPA Entity Models (14) | Complete |
| ✅ Spring Data Repositories (4) | Complete |
| ✅ Spring Security Configuration | Complete |
| ✅ REST API Controllers (2) | Complete |
| ✅ Database Connection | Complete |
| ✅ API Documentation (Swagger) | Complete |
| ⏭️ Authentication & JWT | Phase 2 |
| ⏭️ User CRUD Endpoints | Phase 2 |
| ⏭️ Product Management | Phase 3 |

---

## 🎯 Next Steps (Phase 2)

**Phase 2: Authentication & Authorization** is blocked until Phase 1 is complete.

When ready, review:
```
.planning/phases/02-auth/02-01-PLAN.md
```

This will add:
- User registration & login endpoints
- JWT token generation & validation
- Role-based authorization (@PreAuthorize)
- Password hashing (BCrypt)

---

## 💾 Save Your Work

```bash
git add -A
git commit -m "feat(phase-01): implement JPA entities, repositories, and REST API foundation"
git push origin backend-dev
```

---

**Happy Coding! 🚀**

Current Date: April 8, 2026  
Project: Danaco E-Commerce System  
Phase: 01 (Complete) → Next: Phase 02 (Auth)
