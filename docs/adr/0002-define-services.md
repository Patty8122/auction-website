# 2. Define Service Architecture

Date: 2023-11-05

## Status

Accepted

## Context

We are building an online auction service where users can bid on items listed by sellers. The architecture needs to be scalable, maintainable and ensure a good user experience. We have decided to build our service using a microservices architecture to support these goals.

## Decision

- Implement a frontend with an API gateway/UI service to interact with the backend services.
- Create a User Management Service for handling user data and authentication.
- Create an Auction Service for managing auctions and bidding processes.
- These services will interact with a PostgreSQL database with User, Item, and Admin tables.
- Implement a Notification Service for updating users about auction events, utilizing RabbitMQ for message queuing.
- Utilize Celery for scheduling tasks within the system.
- Implement a Logging Service for monitoring and debugging across all services, with logs stored in a MongoDB database.

## Consequences

- A microservices architecture will allow for easier scaling and maintenance.
- Choice of well-established technologies and frameworks will aid in implementation and ongoing support.
- The separation of concerns will facilitate development by allowing group members to work on individual microservices.

