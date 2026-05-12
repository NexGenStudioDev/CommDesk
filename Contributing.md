# Contributing to CommDesk

Thank you for your interest in contributing to CommDesk.

**_CommDesk_** is a desktop platform for _communities_, _clubs_, _organizations_, and _event teams_. Contributions that improve _usability_, _reliability_, _documentation_, _maintainability_, and _developer experience_ are welcome.

## Before You Start

Before making changes, please review the **existing documentation** and **project structure** to understand the current scope of the repository.

This repository includes:

- A _React_ + _TypeScript_ **frontend**
- A _Tauri_ **desktop application** layer
- A _Rust_ backend under `src-tauri`
- _Documentation_ for project scope, implementation status, and release flow

## Prerequisites

To work on this project, you should have the following installed:

- **Node.js 20** or later
- **pnpm 10** or later
- **Rust stable** (`rustup`, `cargo`)
- The platform-specific dependencies required by **Tauri**

For _Linux_, _macOS_, and _Windows_, please ensure the appropriate system dependencies are installed before building the project.

## Getting Started

1. Fork the repository.
2. Clone your fork locally.
3. Install dependencies.
4. Start the development environment.
5. Make your changes in a feature branch.
6. Test thoroughly before opening a pull request.

### Installation

```git
git clone https://github.com/NexGenStudioDev/CommDesk.git
cd CommDesk
pnpm install
```

### Run the Application

For local development:

```bash
pnpm tauri dev
```

If you need to work on the frontend separately:

```bash
pnpm dev
```

## Branch Naming

Use a _descriptive branch name_ for your work.

Recommended formats:

- `feature/<short-description>`
- `fix/<short-description>`
- `docs/<short-description>`
- `refactor/<short-description>`

Examples:

- `feature/member-search`
- `fix/login-error`
- `docs/update-readme`

## Coding Standards

Please follow the existing _code style_ and _project conventions_.

General expectations:

- Keep changes focused and minimal
- Write clear, readable, and maintainable code
- Follow the current folder structure and architecture
- Avoid introducing unnecessary dependencies
- Prefer small, reusable components and functions
- Keep frontend and backend changes consistent with the existing design

Before submitting, format and lint your code where applicable.

## Testing

All contributions should be tested locally before submission.

At minimum, verify:

- The application starts successfully
- The change works as intended
- Existing functionality is not broken
- The project passes linting and build checks where relevant

Useful commands:

```bash
pnpm lint
pnpm build
pnpm tauri dev
```

If your contribution affects desktop packaging or Rust functionality, test the relevant Tauri or `src-tauri` workflow as well.

## Reporting Issues

Before opening a new issue:

- Search existing issues to avoid duplicates
- Use a clear and descriptive title
- Include steps to reproduce the problem
- Add screenshots, logs, or environment details when relevant

A good bug report should explain:

- What you expected to happen
- What actually happened
- How to reproduce the issue
- Which platform and version you used

## Pull Request Guidelines

When opening a pull request, please ensure that:

- The pull request has a clear title
- The description explains what was changed and why
- Related issues are linked when applicable
- The changes are limited to a single purpose where possible
- The branch is up to date with the target branch before submission

A strong pull request should include:

- A short summary of the change
- Screenshots or recordings for UI updates
- Testing notes
- Any relevant context for reviewers

## Commit Messages

Use concise and meaningful commit messages.

Recommended style:

- `feat: add member search`
- `fix: resolve updater issue`
- `docs: improve contribution guide`
- `refactor: simplify event module`

## Security and Secrets

Do not commit secrets, private keys, or environment-specific credentials.

If your change requires configuration values, update the example environment file or documentation instead of exposing sensitive data.

## Community Standards

Please keep discussions respectful, constructive, and professional.

Be considerate in:

- Issues
- Pull requests
- Code reviews
- Documentation discussions

This project follows a [code of conduct](CODE_OF_CONDUCT.md). All contributors are expected to follow it.

## Maintainers

Maintainers may request changes before merging a pull request. Please respond to review feedback promptly and keep discussions focused on the proposed change.

## License

**By contributing to CommDesk, you agree that your contributions will be made under the same [License](LICENSE) as the project.**
