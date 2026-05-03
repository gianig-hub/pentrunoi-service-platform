# Deployment and Migration Notes

## Current strategy

The first version is a development build, but the project is Docker-ready from the beginning.

## Environments

- Development: local server or VPS folder
- Future production: Docker environment
- Tracking route: /status
- Admin route: /admin
- Uploads: local /uploads first

## Future deployment checklist

Before production:

- confirm .env values
- confirm database credentials
- confirm SMTP/email provider
- confirm public domain
- confirm SSL/proxy setup
- confirm backup scripts work
- confirm restore process works
- confirm uploads backup works
- confirm legal pages are complete
- confirm no phone CTA unless legally required
- confirm admin login security

## Moving to a new Docker server later

1. Clone or pull the repository.
2. Create .env from .env.example.
3. Copy real secrets manually.
4. Start database.
5. Restore database backup.
6. Restore uploads.
7. Build and start app.
8. Test routes.
9. Move DNS/proxy only after tests pass.

## Secrets

Never commit:

- .env
- database passwords
- SMTP passwords
- API keys
- admin passwords
- real backup files
