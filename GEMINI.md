# Personal Programming MCP Server - Development Guidelines

## Project Overview

This is a Model Context Protocol (MCP) server designed to centralize and serve my personal programming standards, preferences, and knowledge base. The goal is to eliminate the need for repetitive instruction files across projects while maintaining consistency in coding practices.

## Structure / Examples

- We will be using the modelcontextprotocol sdk to develop the server. Please refer to the documentation for this located in mcp_docs.md, mcp_full.txt, and mcp_ts_server_example.md
- Please use the

## Core Principles

- **Languages**: Typescript and Go
- **Consistency First**: All code should follow established patterns and standards
- **Language Specific Paradigms**: For Typescript, favor OOP paterns. For Go / Golang, prefer functional programming styles with a preference for interfaces.
- **Self-Documenting Code**: Write code that explains itself through clear naming and structure
- **Containerized Development**: All projects should be Docker-ready from the start
- **Maintainability**: Code should be easy to read, modify, and extend

## Technical Stack Preferences

### Languages & Frameworks

- **Backend**: Node.js with TypeScript or Go for high-performance needs
- **Frontend**: React with TypeScript, Next.js for full-stack applications
- **Database**: PostgreSQL for relational data, Redis for caching
- **API Design**: REST with OpenAPI documentation

### Development Tools

- **Containerization**: Docker with multi-stage builds, Docker Compose for local development
- **Version Control**: Git with conventional commits, feature branch workflow
- **Testing**: Jest for JavaScript/TypeScript, test-driven development approach
- **Linting**: ESLint + Prettier for JavaScript/TypeScript, built in with Go
- **CI/CD**: GitHub Actions preferred, focus on automated testing and deployment

## Architecture Guidelines

### Project Structure

```
project-root/
├── src/                    # Source code
│   ├── controllers/        # API route handlers
│   ├── services/          # Business logic
│   ├── models/            # Data models
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript type definitions
├── tests/                 # Test files
├── docs/                  # Documentation
├── docker/                # Docker configuration
├── scripts/               # Build and deployment scripts
└── config/                # Configuration files
```

### Code Organization

- **Single Responsibility**: Each class and function should have one clear purpose
- **Dependency Injection**: Use dependency injection for better testability
- **Error Handling**: Implement comprehensive error handling with proper logging
- **Configuration**: Use environment variables for all configurable values
- **Validation**: Validate all inputs at boundaries (API endpoints, database interactions)

## Coding Standards

### Naming Conventions

- **Variables/Functions**: camelCase in JavaScript/TypeScript, idiomatic for
- **Classes**: PascalCase in all languages
- **Constants**: UPPER_SNAKE_CASE in all languages
- **Files**: kebab-case
- **Databases**: snake_case for tables and columns

### Code Style

- **Indentation**: Tabs
- **Line Length**: 80-100 characters maximum
- **Comments**: Use JSDoc for functions, inline comments for complex logic only
- **Imports**: Group and sort imports (external libraries first, then internal modules)
- **Async/Await**: Prefer async/await over Promises for better readability
- **File Size**: Prefer shorter file sizes. If a file exceeds 500 lines in length, please look into refactoring it into a separate module / class.

### Design Patterns

- **Repository Pattern**: For data access abstraction
- **Service Layer**: For business logic separation
- **Factory Pattern**: For object creation when complexity warrants it
- **Observer Pattern**: For event-driven architectures
- **Singleton Pattern**: Sparingly, mainly for configuration or logging

## MCP Server Specific Requirements

### Server Architecture

- **Protocol**: Implement standard MCP protocol for maximum compatibility
- **Transport**: HTTP/WebSocket transport layer
- **Authentication**: Simple token-based auth for local development
- **Logging**: Structured logging with different levels (debug, info, warn, error)
- **Health Checks**: Implement health and readiness endpoints

### Data Management

- **Storage**: JSON files for simple data, SQLite for complex relationships
- **Caching**: In-memory caching for frequently accessed data
- **Updates**: Hot-reload capability for development
- **Backup**: Regular backups of configuration and knowledge base
- **Versioning**: Track changes to standards and preferences

### API Design

- **Endpoints**: RESTful design with clear resource naming
- **Response Format**: Consistent JSON structure with proper error codes
- **Documentation**: OpenAPI/Swagger documentation
- **Validation**: Input validation with detailed error messages
- **Rate Limiting**: Basic rate limiting to prevent abuse

## Development Workflow

### Getting Started

1. Clone repository and set up development environment
2. Run `docker-compose up` to start local development stack
3. Install dependencies and run initial setup scripts
4. Run tests to ensure everything is working
5. Start development server with hot-reload enabled

### Testing Strategy

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test API endpoints and database interactions
- **E2E Tests**: Test complete workflows
- **Coverage**: Maintain >80% test coverage
- **Mocking**: Mock external dependencies in tests

### Deployment

- **Containerization**: Multi-stage Docker builds for production
- **Environment**: Separate configurations for dev, staging, and production
- **Secrets Management**: Use proper secret management (not hardcoded)
- **Monitoring**: Health checks and basic metrics
- **Rollback**: Easy rollback strategy for failed deployments

## Context Engineering Features

### Dynamic Context Serving

- **Project Type Detection**: Automatically determine project context
- **Language-Specific Standards**: Serve appropriate standards based on file types
- **Framework Guidelines**: Provide framework-specific best practices
- **Pattern Matching**: Suggest relevant patterns based on current task
- **Progressive Enhancement**: Start with basics, add complexity as needed

### Knowledge Base Structure

- **Categorized Standards**: Organize by language, framework, and domain
- **Searchable Content**: Full-text search across all documentation
- **Tagging System**: Tag content for easy filtering and discovery
- **Usage Tracking**: Track which standards are most frequently accessed
- **Continuous Improvement**: Regular updates based on new learnings

## Success Metrics

- **Consistency**: Reduced variation in code style across projects
- **Efficiency**: Faster project setup and development time
- **Quality**: Improved code quality and maintainability
- **Knowledge Retention**: Better documentation and sharing of learnings
- **Automation**: Reduced manual work in setting up new projects

## Future Enhancements

- **AI Integration**: Enhanced AI assistance with context-aware suggestions
- **Team Sharing**: Ability to share standards across team members
- **IDE Integration**: Direct integration with popular IDEs
- **Metrics Dashboard**: Visual dashboard for development patterns and trends
- **Learning System**: Automatic updates based on coding patterns and feedback

---

**Remember**: This MCP server is designed to be the single source of truth for all programming preferences and standards. Keep it updated, well-documented, and always prefer using it over creating new instruction files.
