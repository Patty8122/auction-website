# 3. Database Selection

Date: 2023-11-05

## Status

Accepted

## Context

We need to choose databases that will efficiently handle our data requirements, both for the main application data and for logging. We need to have at least one relational db and one NoSQL db.

## Decision

- Use PostgreSQL for the main application database due to its ACID compliance and support for relational data structures.
- Use MongoDB for the logging service due to its flexibility and scalability when handling diverse and high-volume log data.

## Consequences

- Ensured data integrity and relational capabilities for the main application data.
- Flexible and scalable logging data handling.
- Separation of concerns between auction-related objects and service-related debugging.

