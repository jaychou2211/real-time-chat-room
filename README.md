# Technology Stack

### Core Framework

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.

### Data Storage and Management

#### Primary Database

- **PostgreSQL**: Robust relational database for storing application data.

#### Caching and Message Broker

- **Redis**: 

   - In-memory data structure store used for caching and as a message broker.

   - Be used in conjunction with [Socket.IO](Socket.IO) for scaling real-time features ( pub/sub functionality).

#### Database Interaction

- **Kysely**: Type-safe and powerful SQL query builder for TypeScript, serving as the primary interface between the application and the database.

### Real-time Communication

- **Socket.IO**: Enables real-time, bidirectional  communication.

### Authentication and Security

- **Passport.js**: Authentication middleware for Node.js.

   - Utilizes **JWT (JSON Web Tokens)** for secure authentication and information exchange.

### DevOps and Deployment

- **Docker**: Containerization for consistent development and deployment environments.

---

## Implementation Highlights

### Clean Architecture and Flexible Data Layer

- Abstracted repositories and transactions concepts

- Allows swapping ORMs/query builders without changing application layer

- Adheres to Clean Architecture principles

### Cross-Server Message Broadcasting

- Used redis-adapter for message broadcasting across multiple server instances

- redis-adapter dependency placed outside the app module( root of dependency tree ).\
   Utilized `app.get(RedisConfiguration)` at main.ts( entry point of application ) to access the information in dependency tree.