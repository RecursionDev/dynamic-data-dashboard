# 🚀 Axlero – Dynamic Data Dashboard Builder

### Week 1: Project Foundation, Security & Database Design

## 📌 1. About the Project

**Axlero Dynamic Data Dashboard Builder** is a web-based platform designed to help businesses understand their data through interactive dashboards.

Instead of manually analyzing large amounts of data, users will be able to create dashboards, select important business metrics, and visualize information using charts, graphs, and KPI cards.

The main goal is to make data analysis easier, faster, and more accessible.

## 🎯 2. Week 1 Objectives

The first week focuses on building the basic structure of the application and setting up its security and database.

Our main tasks include:

- Setting up the Spring Boot project.
- Connecting the application to PostgreSQL.
- Creating the basic backend structure.
- Implementing user registration and login.
- Setting up JWT-based authentication.
- Creating the initial database tables.
- Establishing relationships between database entities.

## 🛠️ 3. Technologies Used

| Technology | Purpose |
|---|---|
| Java 17/21 | Backend programming |
| Spring Boot 3.x | Backend development |
| Spring Security | Application security |
| JWT | Secure user authentication |
| Spring Data JPA | Database operations |
| Hibernate | Database mapping |
| PostgreSQL | Database |
| Maven | Project management |
| Git & GitHub | Version control |

## 🏗️ 4. Project Architecture

We follow a layered architecture to keep the code organized and easy to maintain.

| Layer | Purpose |
|---|---|
| Controllers | Handle user requests |
| Services | Manage application logic |
| Repositories | Communicate with the database |
| Entities | Represent database tables |
| DTOs | Transfer data between frontend and backend |
| Config | Manage application settings |
| Exceptions | Handle application errors |

**Application Flow:**

```text
User / Frontend
      |
      ▼
  Controllers
      |
      ▼
   Services
      |
      ▼
 Repositories
      |
      ▼
  PostgreSQL
```

## 🔐 5. Authentication & Security

We are implementing JWT-based authentication to protect user accounts and application resources.

The authentication process works as follows:

1. Users register using their details.
2. Passwords are securely stored in encrypted hash form.
3. Users log in using their credentials.
4. The backend generates a JWT token after successful login.
5. The token is used to access protected APIs.

This ensures that only authenticated users can access restricted parts of the application.

## 🗄️ 6. Database Design

We are using PostgreSQL to store application data.

The initial database consists of four main entities:

| Entity | Description |
|---|---|
| User | Stores user account information. |
| Workspace | Stores workspace details. |
| Dashboard | Stores dashboard information. |
| WidgetConfig | Stores individual dashboard widget settings. |

### Database Relationships

```text
User
  |
  ▼
Workspace
  |
  ▼
Dashboard
  |
  ▼
WidgetConfig
```

These entities form the foundation for future dashboard creation and management features.

## ⚙️ 7. Installation & Setup

### Prerequisites

- Java JDK 17 or 21
- Maven
- PostgreSQL
- IntelliJ IDEA or VS Code
- Git

### Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd axlero-dashboard-builder
```

### Step 2: Create Database

```sql
CREATE DATABASE axlero_dashboard;
```

### Step 3: Configure Database

Update the database credentials in `application.yml` using your local environment variables.

### Step 4: Run the Application

```bash
mvn clean install
mvn spring-boot:run
```

The backend will run at:

`http://localhost:8080`

## 📅 8. Week 1 Deliverables

By the end of Week 1, our target deliverables are:

- Spring Boot project setup.
- PostgreSQL database connection.
- Basic backend architecture.
- User registration and login APIs.
- JWT authentication and security.
- Four core database entities.
- Initial database schema.

## 🔜 9. What's Next? – Week 2

In the next phase, we will focus on developing the **Dynamic Query Engine**.

Planned activities include:

- Building the MetricService.
- Implementing JPA Criteria API.
- Generating dynamic database queries.
- Supporting SUM and COUNT operations.
- Implementing GROUP BY functionality.
- Adding query validation to prevent SQL injection.

---

<p align="center">
  <strong>AXLERO – Turning Data into Decisions.</strong><br>
  <em>Build. Analyze. Visualize. Innovate.</em>
</p>
