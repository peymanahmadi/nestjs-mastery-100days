# 🚀 NestJS 100-Day Mastery Challenge

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Project Status](https://img.shields.io/badge/Status-Active%20🚧-success?style=for-the-badge)]()

A rigorous, self-paced journey to master the NestJS framework by building 100 progressively complex, production-grade applications. This repository is a living portfolio, demonstrating a commitment to clean architecture, testing, and modern backend development best practices.

## 🎯 Mission Statement

> "To transition from understanding NestJS syntax to architecting scalable, secure, and efficient systems that are ready for a production environment."

## 📊 Challenge Progress

**Overall Completion: 1%**

| Day | Topic & Link | Difficulty | Key Concepts | Status & Score |
| :-- | :----------------------------------------------------------- | :--------- | :----------------------------------------------------------- | :--------------- |
| 01  | [Building a Scalable UsersModule](/apps/day-01-users-module) | 5/100 | Modules, Controllers, Services, DTOs, Validation Pipes | ✅ **Reviewed: 78%** |
| 02  | [Dependency Injection Deep Dive - Building a Modular Authentication System](/apps/day-02-auth-module) | 10/100 | TypeORM, Entities, Repositories, Data Mapper Pattern | 🟡 **In Progress** |
| 04  | [Configuration Management](/apps/day-04-config-management) | 15/100 | `@nestjs/config`, Environment Variables, Validation | ❌ **Not Started** |
| ... |                                                                 |            |                                                              |                  |
| 100 | [Kubernetes Deployment & Helm Charts](/apps/day-100-kubernetes-deployment) | 100/100    | Docker, K8s Manifests, Helm, Health Checks, ConfigMaps | ❌ **Not Started** |

*(This table will be updated continuously as progress is made.)*

## 🛠️ Tech Stack & Patterns

This project explores a wide range of technologies and architectural patterns, chosen for their relevance in modern backend development.

| Category | Technologies |
| :--- | :--- |
| **Core Framework** | NestJS, TypeScript (Strict Mode) |
| **API Protocols** | REST, GraphQL (with Apollo), WebSockets |
| **Databases & ORMs** | **SQL:** PostgreSQL + TypeORM, **NoSQL:** MongoDB + Mongoose, **Query Builder:** Kysely |
| **Data Validation** | `class-validator`, `class-transformer`, Zod |
| **Authentication & Authorization** | JWT, Passport.js, OAuth2, API Keys, RBAC/ABAC |
| **Testing** | Jest (Unit), Supertest (E2E), Test Containers |
| **Documentation** | Swagger/OpenAPI, Compodoc |
| **DevOps & Deployment** | Docker, Docker Compose, Kubernetes, GitHub Actions, Health Checks |
| **Advanced Patterns** | CQRS, Event Sourcing, Microservices, Request Idempotency, Circuit Breakers |

## 🏗️ Repository Structure

This is a **monorepo** managed with the NestJS CLI. Each day's challenge is a standalone, runnable NestJS application.

```
nestjs-mastery-100days/
├── apps/                    # All daily challenge applications live here
│   ├── day-01-users-module/ # Day 1: A simple CRUD API
│   ├── day-02-auth-basics/  # Day 2: JWT Authentication
│   └── .../                 # Each app is self-contained
├── libs/                    # Shared libraries (for cross-app utilities)
│   └── (To be populated as needed)
├── package.json             # Root workspace configuration
├── nest-cli.json            # NestJS monorepo configuration
└── README.md               # This file
```

## 🧪 How to Explore & Run

Each application is independent. To run a specific day's challenge:

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd nestjs-mastery-100days

# 2. Install root dependencies (installs for all workspaces)
npm install

# 3. Navigate into a specific day's application
# cd apps/day-01-users-module

# 4. Or, run commands from the root for a specific app using the Nest CLI
# Start the day-01 application in development mode
npm run start day-01-users-module

# Run tests for day-02
npm run test day-02-auth-basics

# Build day-03 for production
npm run build day-03-database-integration
```
*Note: Check the individual `README.md` inside each day's folder for specific instructions and API examples.*

## 📖 Learning Philosophy

This challenge follows a strict iterative workflow:
1.  **Concept:** A micro-lesson on a core NestJS concept.
2.  **Implementation:** Building a real-world feature against specific requirements.
3.  **Review:** Every line of code undergoes a simulated senior-level review against a strict rubric (NestJS Conventions, Production Readiness, Performance, Security).
4.  **Refactor:** No challenge is "complete" until a score of ≥80% is achieved, ensuring only high-quality code is committed.

## 🤝 Contributing & Feedback

This is a personal learning journey. While this repo is not open for contributions, **constructive feedback and discussions are highly welcome**. If you see a better way to implement something or have a suggestion, please open an issue!

## 📜 License

This project is open-sourced under the [MIT License](LICENSE).

---

## 🌟 About the Developer

**Peyman** - A passionate backend developer on a journey to master Node.js and NestJS.
- **Portfolio:** Soon...
- **LinkedIn:** [Peyman Ahmadi](https://www.linkedin.com/in/peymanahmadi/)
- **GitHub:** [@peymanahmadi](https://github.com/peymanahmadi)

*“The expert in anything was once a beginner.”* – Helen Hayes

---
**⭐ If you find this journey interesting or inspiring, please give the repo a star! It helps motivate the continuation of the challenge.**