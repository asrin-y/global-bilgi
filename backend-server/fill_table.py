import sqlite3
import random
from faker import Faker

# Initialize the SQLite database
conn = sqlite3.connect('userData.db', check_same_thread=False)
cursor = conn.cursor()

# Create the 'userData' table if it doesn't exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS userData (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agentId TEXT,
        firstName TEXT,
        lastName TEXT,
        begin TIME,
        end TIME,
        dateInfo DATE,
        excuse TEXT,
        excuseHours INTEGER,
        timeout INTEGER
    )
''')
conn.commit()

# Initialize Faker for generating random data
fake = Faker()

for _ in range(10):
    agent_id = f"glb901"
    first_name = "Asrin"
    last_name = "Yilmaz"
    begin = f"{random.randint(0, 23):02d}:{random.randint(0, 59):02d}"
    end = f"{random.randint(0, 23):02d}:{random.randint(0, 59):02d}"
    date_info = fake.date_between(start_date='-365d', end_date='today')
    excuse = fake.random_element(elements=('Vacation', 'Sick Leave', 'Personal Leave'))
    excuse_hours = random.randint(4, 8)
    timeout = random.randint(0, 2)

    cursor.execute('''
        INSERT INTO userData
        (agentId, firstName, lastName, begin, end, dateInfo, excuse, excuseHours, timeout)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (agent_id, first_name, last_name, begin, end, date_info, excuse, excuse_hours, timeout))
    conn.commit()

# Generate and insert 10 sample records
for _ in range(10):
    agent_id = f"glb{fake.unique.random_number(digits=3)}"
    first_name = fake.first_name()
    last_name = fake.last_name()
    begin = f"{random.randint(0, 23):02d}:{random.randint(0, 59):02d}"
    end = f"{random.randint(0, 23):02d}:{random.randint(0, 59):02d}"
    date_info = fake.date_between(start_date='-365d', end_date='today')
    excuse = fake.random_element(elements=('Vacation', 'Sick Leave', 'Personal Leave'))
    excuse_hours = random.randint(4, 8)
    timeout = random.randint(0, 2)

    cursor.execute('''
        INSERT INTO userData
        (agentId, firstName, lastName, begin, end, dateInfo, excuse, excuseHours, timeout)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (agent_id, first_name, last_name, begin, end, date_info, excuse, excuse_hours, timeout))
    conn.commit()

# Close the database connection
conn.close()
