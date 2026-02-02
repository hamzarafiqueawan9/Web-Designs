import os
import sys
import pymysql
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).with_name('.env')
# Try to load .env if present, but continue if missing/empty
try:
    load_dotenv(dotenv_path=env_path)
except Exception:
    pass

HOST = os.environ.get("MYSQL_HOST", "localhost")
PORT = int(os.environ.get("MYSQL_PORT", "3306"))
ROOT_USER = os.environ.get("MYSQL_ROOT_USER", "root")
ROOT_PASSWORD = os.environ.get("MYSQL_ROOT_PASSWORD") or "ASDasd123@"
DB_NAME = os.environ.get("MYSQL_DB_NAME", "nexuscare")
APP_USER = os.environ.get("MYSQL_APP_USER", "nexuscare")
APP_PASSWORD = os.environ.get("MYSQL_APP_PASSWORD", "nexuscare")

if not ROOT_PASSWORD:
    print("ERROR: Root password missing.")
    sys.exit(1)

try:
    conn = pymysql.connect(host=HOST, port=PORT, user=ROOT_USER, password=ROOT_PASSWORD)
    conn.autocommit(True)
    cur = conn.cursor()

    cur.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    # Create/ensure app user and grant privileges (force password set)
    # Create user for localhost and wildcard host, then set password and grants
    cur.execute(f"CREATE USER IF NOT EXISTS '{APP_USER}'@'localhost' IDENTIFIED BY '{APP_PASSWORD}';")
    cur.execute(f"CREATE USER IF NOT EXISTS '{APP_USER}'@'%' IDENTIFIED BY '{APP_PASSWORD}';")
    cur.execute(f"ALTER USER '{APP_USER}'@'localhost' IDENTIFIED BY '{APP_PASSWORD}';")
    cur.execute(f"ALTER USER '{APP_USER}'@'%' IDENTIFIED BY '{APP_PASSWORD}';")
    cur.execute(f"GRANT ALL PRIVILEGES ON `{DB_NAME}`.* TO '{APP_USER}'@'localhost';")
    cur.execute(f"GRANT ALL PRIVILEGES ON `{DB_NAME}`.* TO '{APP_USER}'@'%';")
    cur.execute("FLUSH PRIVILEGES;")

    print(f"Database '{DB_NAME}' ready and user '{APP_USER}' granted.")
    print(f"Use DSN: mysql+pymysql://{APP_USER}:{APP_PASSWORD}@{HOST}:{PORT}/{DB_NAME}")
except Exception as e:
    print("Failed to initialize MySQL:", e)
    sys.exit(1)
finally:
    try:
        cur.close()
        conn.close()
    except Exception:
        pass
