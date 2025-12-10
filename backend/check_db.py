from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:12345@localhost:5432/interview_platform")

print(f"Connecting to: {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()

    # Query all users
    result = db.execute("SELECT * FROM users")
    users = result.fetchall()

    print(f"\n{'='*60}")
    print(f"Total users in database: {len(users)}")
    print(f"{'='*60}\n")
    
    if len(users) == 0:
        print("⚠️  No users found in the database.")
        print("Try signing up through the website first!")
    else:
        for i, user in enumerate(users, 1):
            print(f"User {i}:")
            print(f"  ID: {user[0]}")
            print(f"  Email: {user[1]}")
            print(f"  Name: {user[2]}")
            print(f"  Created: {user[4]}")
            print()

    db.close()
    print("✅ Database connection successful!")
    
except Exception as e:
    print(f"❌ Error connecting to database: {e}")
    print("\nMake sure:")
    print("1. PostgreSQL is running")
    print("2. Database 'interview_platform' exists")
    print("3. Password in .env is correct")
