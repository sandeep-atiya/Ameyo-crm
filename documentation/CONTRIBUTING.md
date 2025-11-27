# Contributing to Ameyo CRM

Thank you for your interest in contributing to Ameyo CRM! This document provides guidelines and instructions for contributing to the project.

---

## 📋 Code of Conduct

Please read and follow our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) in all interactions. We are committed to providing a welcoming and inclusive environment for all contributors.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org))
- **Git** ([Download](https://git-scm.com))
- **MSSQL Server** 2019+ or Docker
- **GitHub Account** for forking and PRs

### Fork & Clone

```bash
# 1. Fork the repository on GitHub
# (Click "Fork" button on https://github.com/sandeep-atiya/Ameyo-crm)

# 2. Clone your fork locally
git clone https://github.com/YOUR_USERNAME/Ameyo-crm.git
cd Ameyo-crm

# 3. Add upstream remote to track original repository
git remote add upstream https://github.com/sandeep-atiya/Ameyo-crm.git
```

### Setup Development Environment

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Setup git hooks (pre-commit linting)
npm run prepare

# Run migrations
npm run db:migrate

# Run seeders
npm run db:seed

# Start development server
npm run dev
```

---

## 📝 Development Workflow

### 1. Create Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# or for bugs:
git checkout -b fix/bug-description
```

**Branch naming conventions:**

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring without feature changes
- `chore/` - Dependency updates, configuration changes
- `test/` - Test additions or fixes

### 2. Make Your Changes

```bash
# Make changes to files
# Keep commits logical and focused

# Stage changes
git add .

# Commit with conventional commit format
git commit -m "feat(auth): add password reset functionality"
```

### 3. Code Quality Checks

Before pushing, ensure your code meets quality standards:

```bash
# Format code with Prettier
npm run format

# Lint and fix ESLint issues
npm run lint:fix

# Run tests
npm test

# Run full CI suite (all checks)
npm run ci
```

### 4. Push & Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# - Go to https://github.com/YOUR_USERNAME/Ameyo-crm
# - Click "Compare & pull request"
# - Target: sandeep-atiya/Ameyo-crm (main branch)
# - Source: YOUR_USERNAME/Ameyo-crm (your-feature-name)
```

### 5. Address Review Comments

```bash
# Make requested changes
# Commit with descriptive message
git commit -m "refactor: address review comments"

# Push updates
git push origin feature/your-feature-name
# PR will auto-update
```

---

## 📋 Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification for clear and organized commit history.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature (triggers MINOR version bump)
- `fix` - Bug fix (triggers PATCH version bump)
- `perf` - Performance improvement (triggers PATCH version bump)
- `refactor` - Code refactoring (no version bump)
- `test` - Test additions/modifications (no version bump)
- `docs` - Documentation changes (no version bump)
- `chore` - Build/dependency changes (no version bump)
- `ci` - CI/CD configuration (no version bump)
- `style` - Code style changes (no version bump)

### Scopes

Use meaningful scopes related to the change:

- `auth` - Authentication related
- `user` - User management
- `db` - Database changes
- `api` - API changes
- `middleware` - Middleware changes
- `validation` - Validation logic
- `docs` - Documentation
- `config` - Configuration
- `deps` - Dependencies

### Examples

```
feat(auth): add JWT token refresh endpoint

Add automatic JWT token refresh functionality to prevent
session timeouts for active users.

Fixes #123
```

```
fix(user): correct email validation regex
```

```
docs(readme): add troubleshooting section
```

---

## ✅ Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Branch is created from `main` and up-to-date
- [ ] Code follows project style guide (ESLint + Prettier)
- [ ] All tests pass (`npm test`)
- [ ] New tests added for new features
- [ ] CHANGELOG.md updated (if applicable)
- [ ] Documentation updated (if applicable)
- [ ] No console.log or debug code left
- [ ] No secrets or credentials committed
- [ ] Commit messages follow Conventional Commits format
- [ ] PR title clearly describes changes

---

## 🧪 Testing Guidelines

### Writing Tests

```bash
# Tests are located in __tests__/ directory
# Follow existing test patterns

# Example: __tests__/services/authService.test.js
describe('authService', () => {
  test('should hash password correctly', async () => {
    const password = 'test123';
    const hashed = await hashPassword(password);
    expect(hashed).not.toBe(password);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test authService.test.js

# Watch mode (re-run on changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Coverage Requirements

- Aim for >80% code coverage
- All critical paths should be tested
- Test both success and error scenarios

---

## 🛡️ Security Guidelines

- **Never commit secrets** (passwords, API keys, tokens)
- Use `.env.example` for sensitive configuration
- Add new sensitive config to `.env.example` with placeholder values
- Report security vulnerabilities privately (don't create public issues)
- Validate and sanitize all user inputs
- Use parameterized queries to prevent SQL injection

---

## 📚 Documentation Guidelines

- Update relevant docs when making changes
- Keep documentation accurate and up-to-date
- Use clear, concise language
- Add code examples for complex features
- Update README.md for user-facing changes
- Update ARCHITECTURE.md for structural changes

### Files to Update

- **README.md** - User-facing features, setup, API endpoints
- **ARCHITECTURE.md** - System design, patterns, folder structure
- **INSTALLATION.md** - Setup instructions
- **TECH_STACK.md** - Technology changes
- **CHANGELOG.md** - Added automatically by semantic-release

---

## 🔄 Keeping Your Fork Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch on upstream/main
git rebase upstream/main

# Force push to your fork (only if needed)
git push -f origin feature/your-feature-name
```

---

## 👥 Review Process

1. **Automated Checks**

   - ESLint validation
   - Test execution
   - Code coverage analysis

2. **Manual Review**

   - Code quality assessment
   - Design review
   - Security check
   - Documentation review

3. **Approval & Merge**
   - At least one approval required
   - All checks must pass
   - Branch can be merged to main

---

## 🐛 Reporting Issues

### Bug Reports

Include the following information:

- **Description** - What is the bug?
- **Steps to Reproduce** - How to reproduce the issue
- **Expected Behavior** - What should happen
- **Actual Behavior** - What actually happens
- **Environment** - Node version, OS, etc.
- **Error Log** - Stack trace or error messages

### Feature Requests

Include:

- **Description** - What feature is needed?
- **Use Case** - Why is this needed?
- **Proposed Solution** - (optional) How to implement it
- **Alternatives** - Any alternative approaches?

---

## 📞 Getting Help

- **Questions:** Use [GitHub Discussions](https://github.com/sandeep-atiya/Ameyo-crm/discussions)
- **Issues:** File on [GitHub Issues](https://github.com/sandeep-atiya/Ameyo-crm/issues)
- **Security:** Report privately to maintainers
- **Documentation:** Check [documentation/](documentation/) folder

---

## 🎯 What We're Looking For

- **Bug fixes** - Especially with test coverage
- **Feature implementations** - Following project patterns
- **Documentation improvements** - Clarity and examples
- **Performance optimizations** - With benchmarks
- **Security improvements** - Following best practices
- **Test coverage** - Increasing code coverage

---

## 🙏 Thank You

Thank you for contributing to Ameyo CRM! Your efforts help make this project better for everyone. We appreciate your time and effort, regardless of whether your contribution is accepted or not.

**Happy coding! 🚀**
