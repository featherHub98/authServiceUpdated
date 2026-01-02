# Copilot Instructions for Auth Service

## Architecture Overview

This is an Express.js authentication and authorization service with a **multi-realm architecture**. The system manages authentication across multiple independent realms, each with their own secrets and user bases.

### Core Components

1. **authUsers**: Main authentication entry point for central users (email/password/roles)
2. **realms**: Multiple authentication realms:
   - `appRealm`: General application realm management
   - `authServiceRealm`: Central auth service realm
   - `realmUsers`: Users scoped to specific realms
   - `secrets`: Realm-specific JWT secrets for token verification
3. **services**: Shared utilities (JWT, bcrypt hashing, utilities)
4. **exceptions**: Custom error classes for typed error handling

### Data Storage

- Single **db.json** file with four main collections:
  - `authUsers`: Central users with roles
  - `realms`: Realm definitions
  - `realmUsers`: Users belonging to specific realms
  - `secrets`: Realm-specific JWT secrets (keyed by realmId)

## Key Patterns & Conventions

### Service-Controller Pattern

All routes follow strict separation:
- **Controllers** (`*Controller.js`): Handle HTTP requests, call services, return responses
- **Services** (`*Service.js`): Business logic, file I/O, error handling

Example: `authUsers/authUsersController.js` routes to `authUsersService.js` functions.

### JWT Multi-Realm Authentication

The `jwtService.js` implements realm-based JWT verification:
1. Decode token (without verification) to extract user email
2. Look up user in db.json to find their `realmId`
3. Find matching realm secret in `secrets` collection
4. Verify token using realm-specific secret

Key functions:
- `verifyAccessToken(token, type)` - Validates auth tokens
- `generateRealmUserToken(user)` - Creates JWT for realm users
- `getRealmData(tokenUser, type)` - Fetches realm secrets and user data

The `type` parameter distinguishes: `"authUser"` vs `"realmUser"`

### Password Hashing

Uses bcrypt (v6.0.0). Implementation in `hashPasswordService.js`:
- Hash passwords before storing
- Verify during login by comparing hashed values
- Never store plaintext passwords

### Custom Exception Handling

Three custom exception classes in `exeptions/` (note: typo in folder name is intentional):
- `AuthUserExeption`: Auth user-related errors
- `AppRealmExeption`: Realm management errors
- `AuthRealmException`: Service realm errors

Usage: Check `instanceof ExceptionClass` in error handling blocks.

## Common Development Tasks

### Adding a New Endpoint

1. Create controller in appropriate `*/Controller.js`
2. Create corresponding service in `*/Service.js`
3. File I/O pattern: `const pathDb = path.join(__dirname, '../../db.json')`
4. Read db: `JSON.parse(await fs.readFile(pathDb, 'utf-8'))`
5. Register route in `server.js`: `app.use("/path", require('./path/Controller'))`

### JWT Token Validation

- Always use `jwtService.verifyAccessToken()` for protected endpoints
- Pass `type: "authUser"` or `"realmUser"` based on context
- Catches invalid/expired tokens automatically

### Database Modifications

- Read entire `db.json`, modify array/object, write back
- No transaction support (single-file db)
- Array operations: use standard JS methods then stringify/write

## Critical Notes for AI Agents

- **db.json is the only persistence** - no database server. All file reads parse JSON.
- **Method-override enabled**: Forms can use `_method` parameter for PUT/DELETE
- **Handlebars templating**: Views in `views/*.hbs` (no HTML), served with `express-handlebars`
- **Port 2000**: Application runs on localhost:2000
- **CORS enabled**: Configured for cross-origin requests
- **No tests**: Script says "no test specified" - any additions should follow project patterns
- **Realm isolation**: Realm secrets are the security boundary; each realm has independent JWT secrets
