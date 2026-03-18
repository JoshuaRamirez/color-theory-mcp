# Security Policy

## Supported Versions

The following versions of Color Theory MCP Server receive security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in Color Theory MCP Server, please report it responsibly.

### How to Report

1. **Do not** open a public GitHub issue for security vulnerabilities
2. **Email** the maintainer directly with details of the vulnerability
3. **Include** the following information:
   - Description of the vulnerability
   - Steps to reproduce or proof of concept
   - Potential impact assessment
   - Any suggested fixes (optional)

### What to Expect

- **Initial Response**: Within 48 hours of your report, you will receive acknowledgment that we have received it
- **Assessment**: Within 7 days, we will provide an initial assessment of the vulnerability and our planned response
- **Resolution**: We aim to resolve confirmed vulnerabilities within 30 days, depending on complexity
- **Disclosure**: We will coordinate with you on public disclosure timing after a fix is available

### Scope

This security policy covers:

- The Color Theory MCP Server codebase
- Dependencies directly managed by this project
- Configuration and deployment guidance provided in documentation

### Out of Scope

The following are not covered by this security policy:

- Vulnerabilities in the MCP protocol itself (report to Anthropic)
- Vulnerabilities in Node.js runtime (report to Node.js security team)
- Issues in third-party dependencies (report to respective maintainers, but please inform us)
- Security issues arising from misconfiguration by end users

## Security Considerations

### MCP Server Context

Color Theory MCP Server is designed to run as a local MCP server. Key security considerations:

- **No Network Access**: The server does not make network requests
- **No File System Access**: The server does not read or write files
- **Pure Computation**: All operations are mathematical color transformations
- **Input Validation**: All tool inputs are validated before processing

### Best Practices for Users

1. **Run locally**: Only run the MCP server in trusted environments
2. **Keep updated**: Use the latest version to receive security fixes
3. **Review permissions**: Ensure your MCP client configuration limits server capabilities appropriately

## Acknowledgments

We appreciate security researchers who help keep this project safe. Contributors who report valid security vulnerabilities will be acknowledged in release notes (unless they prefer to remain anonymous).
