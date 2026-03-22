# JavaScript Technical Test - Fullstack Developer

## Overview

This test is designed to evaluate your ability to build a complete fullstack application from scratch. You will work with a provided dataset and implement both a backend API and a frontend interface across several steps of development.

The goal is not only to assess technical proficiency but also your approach to code organisation, separation of concerns, and decision-making under realistic constraints.

---

## Rules

- The code must be pushed to a git repository.
- You must give us the access to this repository **before the interview** so we have the time to review it.
- We recommend dedicating approximately **one hour** to this test.
- The result will serve as the basis for discussion during our exchange.
- Read all phases before you start.
- Pay attention to the quality of your database design, your API and the technical choices you make. The frontend is not our main focus in this test.
- You may use AI-assisted tools, but be prepared to explain every part of your code.
- Use **Javascript** or **Typescript** in your codebase.
- You are free to choose your own library or framework unless specified otherwise.
- The database must be local — no external or cloud-hosted PostgreSQL instances.

## Dataset

A product catalog is available in `./data/products.json` file.

Each product has the following structure:

```json
{
    "reference": "59033201",
    "name": "Non dolor minim ex veniam ipsum qui eiusmod velit est cupidatat in proident ipsum aliquip non labore",
    "description": "Labore est dolor sed laborum id irure ullamco commodo voluptate proident in elit anim Duis tempor dolore qui sint cupidatat sint anim dolore quis tempor aliquip Excepteur elit fugiat ipsum et cillum aute culpa consectetur nisi nisi consequat Ut sed.",
    "price": 972.5,
    "currency": "EUR",
    "stock": 415,
    "reviews": [
      {
        "notation": 5,
        "date": "2025-04-06T02:09:10",
        "comment": "Very practical and easy to use.",
        "author": {
          "firstName": "Poha",
          "lastName": "Kuxero",
          "type": "professional"
        }
      }
    ],
  }
```

## Phases

### Phase 1 — PostgreSQL Database

Set up a local PostgreSQL database on your machine and design a relational schema to store the data from `data/products.json`.

**Requirements:**

- The database must run **locally on your machine**. Use the most appropriate solution to track the lifecycle and evolution of PostgreSQL versions.
- Design a normalised relational schema that best fits the structure of the source data.
- The data model is stable.
- Seed the database with data from `data/products.json`. Insert all records into the database respecting the relational structure.

---

### Phase 2 — API

Design and implement an API that exposes the data stored in your PostgreSQL database.

**Requirements:**

- Expose **products**, **reviews**, and **authors**.
- The API must start locally with a single command and connect to the database set up in Phase 1.
- Everything is public — no authentication required to call the API.

**Design guidelines:**

When designing your API, consider the following dimensions:

- **Performance** — avoid over-fetching; do not return more data than the consumer needs.
- **Affordance** — the API should be self-descriptive. The naming is important and should make it obvious what each endpoint does and what to expect back.
- **Ease of use** — a developer consuming your API for the first time should be able to understand and use it without asking questions.

**Documentation:**

Write API documentation that allows another developer to use your API without looking at your source code.

---

### Phase 3 — Frontend Dashboard (Vue.js 3) (BONUS)

Build a web interface that consumes your API created in phase 2 and presents the product catalog as an operational dashboard.

**Requirements:**

- Use **Vue.js 3** — this is mandatory, as it is the core of our frontend stack
- Use the **Composition API** exclusively — no Options API
- Integrate a **UI component library** to keep the interface attractive without spending excessive time on custom styling
- :warning: Do not create a Pixel-perfect design or animations — use the component library defaults
- The application must be startable locally with a single command
- Everything is public — no authentication required to access the interface

**Dashboard content:**

The interface must contain the following sections:

1. **KPI summary bar** — displayed prominently at the top of the page:
   - Total number of products
   - Total number of reviews

2. **Most appreciated products** — a list or card grid of the 5 products with the highest number of positive reviews. A positive review is defined as one with a `notation` strictly greater than 3.

3. **Lowest-rated products** — a list or card grid of the 5 products whose reviews have the lowest ratings (average `notation` below 3).

4. **Full product catalog** — a complete list of all products. No filtering or pagination required.

---

Good luck.
