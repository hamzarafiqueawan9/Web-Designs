# NexusCare – Full Stack Ecosystem (React + Flask + MySQL)

A minimal scaffold for the NexusCare CCP: secure session auth, role-based access, complaint CRUD, React SPA, Flask API, MySQL persistence.

## Stack
- Frontend: React + Vite, React Router, Axios
- Backend: Flask, Flask-Login, Flask-SQLAlchemy, Flask-CORS
- Database: MySQL (PyMySQL driver)

## Database setup (MySQL)
- Ensure MySQL server is running.
- One-time automatic setup via Python (recommended):
	1. Copy env file: `copy backend\.env.example backend\.env`
	2. Edit `backend/.env` and set `MYSQL_ROOT_PASSWORD=YOUR_PASSWORD` (e.g., `ASDasd123@`).
	3. Run initializer:
		 ```
		 cd backend
		 python -m venv .venv
		 .\.venv\Scripts\activate
		 pip install -r requirements.txt
		 python init_db.py
		 ```
	4. Verify `DATABASE_URL` points to the created app user: `mysql+pymysql://nexuscare:nexuscare@localhost:3306/nexuscare`.
- Alternative manual setup: `Get-Content backend/schema.sql | <path-to-mysql.exe> -u root -p`.

## Quick start
1) Backend env
```
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# update DATABASE_URL and SECRET_KEY in .env
python app.py
```
Default API: http://localhost:5000

2) Frontend env
```
cd frontend
npm install
npm run dev
```
App: http://localhost:5173

## API sketch
- `POST /api/auth/register` {username,email,password,role}
- `POST /api/auth/login` {username,password}
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/complaints?status=`
- `POST /api/complaints` {title,description}
- `PUT /api/complaints/:id` {title?,description?,status?}
- `DELETE /api/complaints/:id` (soft delete)

## Roles
- admin (full)
- resident (own complaints)
- security (can update any complaint)
- medical (own complaints)

## Schema (starter)
- users: id, username, email, password_hash, role, created_at
- complaints: id, title, description, status, created_by, created_at, updated_at
- audit_logs: id, actor_id, entity, entity_id, action, details, timestamp

## Notes
- Sessions via Flask-Login; CORS configured for Vite dev.
- Logging to `backend/instance/logs/app.log`.
- Proxy in Vite forwards `/api` to Flask.

## Next steps
- Add more modules (appointments, visitors, etc.).
- Add server-side validation, pagination, and better error surfaces.
- Deploy with Docker or cloud host of choice.
