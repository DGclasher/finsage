# Finsage Frontend

The **Finsage Frontend** is a client-side web application built with **Next.js**, designed to help users track their **incomes**, **expenses**, and **investments**. It communicates with the Finsage Backend API over secure JWT-based authentication and integrates **Google OAuth2** for easy login.

---

## Features

- Client-side rendering with Next.js
- JWT-based login and Google OAuth2 support
- Authenticated dashboards for:
  - Income tracking
  - Expense management
  - Investment monitoring
- Real-time investment summary display
- Token-based session handling
- Seamless integration with the Spring Boot backend

---


## Prerequisites

- Docker

---

## Getting Started

### 1. Run the application
```
docker run -p 3000:3000 --network host --rm --name finsage-client dgclasher/finsage-client:latest -d
```
