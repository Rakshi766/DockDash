# DockDash - Warehouse Loading Bay Coordinator

DockDash is a web-based **Warehouse Loading Bay Coordinator** designed to centralize and simplify the management of loading bays, shipments, appointments, and dock activities.

The system provides role-based access for **Logistics Coordinators, Dock Managers, Warehouse Operatives, and Carrier Partners**. It supports appointment scheduling, loading bay capacity validation, shipment priority handling, check-in and completion workflows, activity logging, and operational analytics.

---

## 📌 Project Overview

Warehouse loading operations often involve multiple shipments, loading bays, carriers, and warehouse personnel. Managing these activities through manual processes or disconnected systems can make it difficult to track appointments, monitor bay availability, and maintain accurate operational records.

DockDash provides a centralized application where users can manage these operations through a structured workflow.

### Key Features

* 🔐 Secure user authentication using JWT
* 👥 Role-Based Access Control (RBAC)
* 🏭 Loading bay management
* 📦 Shipment management
* 📅 Appointment scheduling
* ⚖️ Loading bay capacity validation
* 🚚 Shipment priority management
* ✅ Appointment check-in and completion
* 📝 Dock activity logging
* 🔎 Inspection and activity approval
* 📊 Operational dashboard and analytics
* 🛡️ Centralized exception handling
* 🔗 REST API based client-server communication

---

## 👤 User Roles

DockDash supports four primary operational roles:

| Role                      | Responsibilities                                                              |
| ------------------------- | ----------------------------------------------------------------------------- |
| **Logistics Coordinator** | Create shipments, book appointments, create bays and approve activities       |
| **Dock Manager**          | Check-in appointments, complete appointments, manage activities and approvals |
| **Warehouse Operative**   | Update bay weight, perform loading activities and complete appointments       |
| **Carrier Partner**       | Participate in appointment check-in operations                                |

---

## 🏗️ System Modules

### 1. User & Authentication Management

* User registration and login
* Password encoding
* JWT token generation
* Role-based authorization
* Active user status management

### 2. Loading Bay Management

Each loading bay maintains:

* Bay number
* Bay type
* Status
* Maximum weight capacity
* Current weight

Supported bay types:

* `INBOUND`
* `OUTBOUND`
* `COLD_STORAGE`

Supported bay statuses:

* `AVAILABLE`
* `OCCUPIED`
* `MAINTENANCE`
* `RESERVED`

### 3. Shipment Management

Shipment records contain:

* Shipment number
* Carrier name
* Total units
* Estimated weight
* Priority
* Hazardous material status

Shipment priority is automatically assigned:

```text
Hazardous Material → CRITICAL
More than 50 Units → EXPEDITED
Otherwise → STANDARD
```

### 4. Appointment Management

Appointments connect shipments with loading bays and scheduled time windows.

The appointment workflow is:

```text
SCHEDULED
     ↓
CHECKED_IN
     ↓
LOADING
     ↓
COMPLETED
```

An appointment can also be cancelled.

The system validates:

* Bay capacity
* Shipment availability
* Duplicate active appointments
* Appointment status transitions

### 5. Dock Activity Management

Dock activities maintain an operational history for appointments.

Activities can include:

* Inspection
* Loading progress
* Scanning
* Other operational activities

Each activity records the appointment, user, activity type, timestamp, notes, and approval status.

### 6. Analytics Dashboard

The dashboard provides operational statistics such as:

* Total appointments
* Active loadings
* Pending activity logs
* Available bays

---

## 🛠️ Technology Stack

### Frontend

* React
* JavaScript
* HTML
* CSS
* React Router
* Redux Toolkit
* React Redux
* Axios
* Ant Design

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Maven
* REST APIs

### Database

* MySQL
* JDBC
* Spring Data JPA

### Security

* JWT (JSON Web Token)
* Spring Security
* BCrypt
* Role-Based Access Control

### API Documentation

* Swagger / OpenAPI

---

## 🏛️ System Architecture

DockDash follows a layered client-server architecture.

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │  Frontend Application│
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Spring Boot API    │
                    │     Controllers      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Service Layer     │
                    │   Business Rules     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Repository Layer     │
                    │   Spring Data JPA    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MySQL          │
                    │   Relational Data    │
                    └──────────────────────┘
```

JWT authentication is applied to protected API operations, while role-based authorization controls access to specific functions.

---

## 📂 Project Structure

```text
DockDash/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── store/
│   └── ...
│
├── package.json
├── package-lock.json
└── README.md
```

The backend follows a layered structure containing:

```text
Controllers
Services
Repositories
Entities
DTOs
Security
JWT Utilities
Exception Handling
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Java 17+
* Maven
* MySQL
* Git

### Clone the Repository

```bash
git clone https://github.com/Rakshi766/DockDash.git
```

```bash
cd DockDash
```

### Frontend Setup

Install the required dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm start
```

The frontend communicates with the Spring Boot backend through REST APIs.

### Backend Setup

Navigate to the backend project directory and build the application:

```bash
mvn clean install
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

Configure the database connection and JWT secret in the application's configuration before running the backend.

---

## 🔐 Authentication

DockDash uses **JWT-based authentication**.

The authentication process is:

```text
User Login
    ↓
Spring Security Authentication
    ↓
JWT Token Generation
    ↓
Token Returned to Frontend
    ↓
Token Sent with Protected API Requests
    ↓
JWT Filter Validation
    ↓
Authorized Request
```

Protected API requests require the JWT token through the `Authorization` header.

---

## 🔗 API Modules

The backend provides REST endpoints for:

| Module          | API                        |
| --------------- | -------------------------- |
| Authentication  | `/api/auth`                |
| Loading Bays    | `/api/bays`                |
| Appointments    | `/api/appointments`        |
| Dock Activities | `/api/activities`          |
| Shipments       | `/api/shipments`           |
| Analytics       | `/api/analytics/dashboard` |
| Carrier Users   | `/api/users/carriers`      |

---

## 🧪 Testing

The project supports testing of important system operations including:

* Authentication
* Authorization
* Bay creation and status updates
* Shipment priority assignment
* Appointment scheduling
* Appointment check-in
* Appointment completion
* Activity logging
* JWT validation
* Exception handling
* REST API integration

Both positive and negative workflows can be validated, including capacity violations, duplicate appointments, invalid state transitions, and unauthorized requests.

---

## 🔮 Future Enhancements

Possible future improvements include:

1. **Advanced Notifications**
   Notifications for appointment changes, bay capacity conditions, inspection results, and operational exceptions.

2. **Real-Time Updates**
   WebSocket or Server-Sent Events can be introduced for real-time bay and appointment status updates.

3. **Enhanced Reporting**
   Reports for loading turnaround time, appointment utilization, carrier activity, bay utilization, and activity history.

4. **Expanded Audit and Monitoring**
   Detailed tracking of security events, administrative changes, and historical status transitions.

5. **Deployment and Scalability**
   Production deployment configuration, database backups, monitoring, centralized logging, and scalable infrastructure.

---

## 📚 Project Documentation

The project documentation includes:

* Software Requirements Specification
* System Analysis
* System Requirements
* System Design
* Testing
* Conclusion and Future Work
* API documentation
* Source code
* System screenshots

---

## 👩‍💻 Author

**Rakshita D**

**Register Number:** 2403727714922074

**B.E. Computer Science and Engineering (Cyber Security)**
**Sri Krishna College of Engineering and Technology**
Coimbatore, Tamil Nadu

