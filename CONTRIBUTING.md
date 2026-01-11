# 🤝 Contributing to FetchETF

Thank you for your interest in contributing to FetchETF! This guide will help you understand our development process and coding standards.

## 🛠 Development Workflow

If you want to add a new feature or endpoint, please follow these steps:

### 1. Identify the Domain
Locate the appropriate folder in `src/etf/` (e.g., `history`, `insights`). If it's a completely new category, create a new domain folder.

### 2. Define the DTO
Create a Data Transfer Object (DTO) if your endpoint requires query parameters or a request body.

### 3. Implement the Service Logic
- Inject the `CACHE_MANAGER` and `YAHOO_FINANCE_INSTANCE`.
- Follow the **Cache Pattern** (Check Cache -> Fetch Source -> Store in Cache with Metadata).
- Always include logging for HIT/MISS status and expiration time.

### 4. Create/Update the Controller
- Define your endpoint using standard NestJS decorators.
- **IMPORTANT**: Use `CACHE_LABELS` from `src/common/constants/cache.constants.ts` in your `@ApiOperation` summary.

### 5. Update Constants
If your new feature uses a new cache duration, add it to `src/common/constants/cache.constants.ts` (both the TTL and the Label).

## 📏 Coding Standards

- **Naming**: 
  - Files: `name.service.ts`, `name.controller.ts`, `name.module.ts`.
  - Classes: PascalCase (e.g., `CoreDataService`).
  - Methods/Variables: camelCase.
- **Folder Structure**: Always keep your DTOs in a `dto/` subfolder within the domain or in `src/etf/dto` for shared ones.
- **Imports**: Avoid deep relative nesting; consider using path aliases if the project grows.

## 💬 Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:`: A new feature.
- `fix:`: A bug fix.
- `docs:`: Documentation only changes.
- `style:`: Changes that do not affect the meaning of the code (white-space, formatting, etc).
- `refactor:`: A code change that neither fixes a bug nor adds a feature.
- `perf:`: A code change that improves performance.
- `test:`: Adding missing tests or correcting existing tests.

**Example**: `feat: add technical analysis indicators to insights service`

## 🚀 Branching Strategy

1.  Create a feature branch from `master`: `git checkout -b feat/my-new-feature`.
2.  Make your changes and commit them following the conventions.
3.  Push your branch: `git push origin feat/my-new-feature`.
4.  Open a Pull Request for review.
