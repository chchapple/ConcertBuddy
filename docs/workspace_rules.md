# ConcertBuddy Coding Workflow

## Naming Conventions

### Files and Directories
- **Files**: `kebab-case` (e.g., `user-profile.component.jsx`, `event-service.js`)
- **Directories**: `kebab-case` (e.g., `components/`, `api-routes/`, `utils/`)
- **Test files**: Same name as source file with `.test` or `.spec` suffix (e.g., `user-profile.test.jsx`)

### Code Elements
- **Variables/Functions**: `camelCase` (e.g., `getUserProfile`, `handleEventSubmit`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`, `MAX_FILE_SIZE`)
- **Classes/Components**: `PascalCase` (e.g., `UserProfile`, `EventCard`)
- **Database tables**: `snake_case` (e.g., `user_profiles`, `event_attendees`)
- **Environment variables**: `UPPER_SNAKE_CASE` with app prefix (e.g., `CONCERTBUDDY_DB_URL`)

### React Components
- **Component files**: `PascalCase.jsx` (e.g., `EventList.jsx`)
- **Component folders**: `PascalCase/` containing `index.jsx` and related files
- **Props**: `camelCase` (e.g., `onEventClick`, `userData`)

## Commit Message Guidelines

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting, no functional changes
- `refactor`: Code refactoring without functional changes
- `test`: Adding or updating tests
- `chore`: Build process, dependency updates, etc.

### Examples
```
feat(auth): add user profile creation
fix(api): resolve event attendance validation error
docs(readme): update installation instructions
test(components): add EventCard unit tests
refactor(database): normalize user table schema
```

### Scope Guidelines
- Use specific scope: `auth`, `events`, `chat`, `profile`, `api`, `client`
- Keep descriptions under 50 characters
- Use imperative mood ("add" not "added")
- Explain what and why, not how

## Pull Request Process

### PR Creation
1. **Branch from**: `develop` for features, `main` for hotfixes
2. **Target branch**: `develop` for most PRs
3. **PR title**: Follow commit message format without type prefix
4. **PR description**: Include:
   - Problem statement
   - Solution approach
   - Testing performed
   - Screenshots (if UI changes)
   - Breaking changes (if any)

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Accessibility checked (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Environment variables documented
```

### Review Process
1. **Required reviewers**: Minimum 1 team member
2. **Review focus**:
   - Code quality and readability
   - Security implications
   - Performance considerations
   - Test coverage
   - Documentation completeness
3. **Approval requirements**: At least 1 approval, no outstanding change requests
4. **Merge method**: Squash and merge (maintains clean history)

## Branching Strategy

### Main Branches
- **`main`**: Production-ready code, tagged releases only
- **`develop`**: Integration branch for next release
- **`staging`**: Pre-production testing branch

### Feature Branches
- **Naming**: `feat/feature-name` or `feature/feature-name`
- **Source**: Branch from `develop`
- **Target**: Merge back to `develop` via PR
- **Lifespan**: Delete after merge

### Hotfix Branches
- **Naming**: `hotfix/issue-description`
- **Source**: Branch from `main`
- **Target**: Merge to both `main` and `develop`
- **Urgency**: Critical bugs in production

### Release Branches
- **Naming**: `release/vX.X.X`
- **Source**: Branch from `develop`
- **Target**: Merge to `main` (tagged) and `develop`
- **Purpose**: Final testing and bug fixes before release

### Workflow Example
```
main (production)
  ↑
  hotfix/fix-login-bug (merged to main + develop)
  
develop (integration)
  ↑
  feat/user-profiles ← feat/event-matching ← feat/chat-system
  
release/v1.0.0 (testing)
  ↑
  (merged from develop)
```

## Development Workflow

### Local Development
1. Create feature branch from latest `develop`
2. Install dependencies (`npm install`)
3. Set up environment variables
4. Run development servers locally
5. Write code following conventions
6. Add/update tests
7. Test manually
8. Commit following guidelines
9. Push and create PR

### Code Review Best Practices
- Keep PRs small and focused
- Address review comments promptly
- Use descriptive comments for complex logic
- Ensure tests cover new functionality
- Update documentation as needed

### Release Process
1. Merge all approved features to `develop`
2. Create release branch from `develop`
3. Final testing and bug fixes
4. Update version numbers
5. Merge to `main` and tag release
6. Deploy to production
7. Merge back to `develop`

## Quality Standards

### Code Quality
- ESLint configuration enforced
- Prettier for code formatting
- Minimum 80% test coverage for new code
- TypeScript for type safety (when implemented)

### Security
- No API keys or secrets in code
- Input validation and sanitization
- Proper authentication/authorization checks
- Regular dependency updates

### Performance
- Lazy loading for large components
- Optimized database queries
- Image optimization and CDN usage
- Mobile-first responsive design