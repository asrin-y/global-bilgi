from flask import Flask, jsonify, request
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

conn = sqlite3.connect('userData.db', check_same_thread=False)
cursor = conn.cursor()

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

@app.route('/getAllRecordsofUser/<string:agentId>', methods=['GET'])
def get_records_by_agent(agentId):
    cursor.execute('SELECT * FROM userData WHERE agentId = ?', (agentId,))
    records = cursor.fetchall()
    records_dict = [{"id": row[0] ,"agentId": row[1], "firstName": row[2], "lastName": row[3], "begin": row[4], "end": row[5], "dateInfo": row[6], "excuse": row[7], "excuseHours": row[8], "timeout": row[9],} for row in records]
    return jsonify(records_dict)

@app.route('/getAllRecords', methods=['GET'])
def get_all_records():
    cursor.execute('SELECT * FROM userData')
    records = cursor.fetchall()
    records_dict = [{"id": row[0], "agentId": row[1], "firstName": row[2], "lastName": row[3], "begin": row[4], "end": row[5], "dateInfo": row[6], "excuse": row[7], "excuseHours": row[8], "timeout": row[9]} for row in records]
    return jsonify(records_dict)

@app.route('/addUserData', methods=['POST'])
def add_user_data():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    # Extract data from the request JSON
    agentId = data.get("agentId")
    firstName = data.get("firstName")
    lastName = data.get("lastName")
    begin = data.get("begin")
    end = data.get("end")
    dateInfo = data.get("dateInfo")
    excuse = data.get("excuse")
    excuseHours = data.get("excuseHours")
    timeout = data.get("timeout")

    # Insert the new record into the 'userData' table
    cursor.execute('''
        INSERT INTO userData
        (agentId, firstName, lastName, begin, end, dateInfo, excuse, excuseHours, timeout)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (agentId, firstName, lastName, begin, end, dateInfo, excuse, excuseHours, timeout))
    conn.commit()

    # Return a success message
    return jsonify({"message": "User data added successfully"}), 201

@app.route('/deleteUserData/<int:id>', methods=['DELETE'])
def delete_user_data(id):
    # Check if the record with the given ID exists
    cursor.execute('SELECT id FROM userData WHERE id = ?', (id,))
    existing_record = cursor.fetchone()

    if existing_record is None:
        return jsonify({"error": "Record not found"}), 404

    # Delete the record with the given ID
    cursor.execute('DELETE FROM userData WHERE id = ?', (id,))
    conn.commit()

    # Return a success message
    return jsonify({"message": "User data deleted successfully"}), 200

@app.route('/updateUserData/<int:id>', methods=['PUT'])
def update_user_data(id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    # Check if the record with the given ID exists
    cursor.execute('SELECT * FROM userData WHERE id = ?', (id,))
    existing_record = cursor.fetchone()

    if existing_record is None:
        return jsonify({"error": "Record not found"}), 404

    # Extract data from the request JSON
    agentId = data.get("agentId", existing_record[1])
    firstName = data.get("firstName", existing_record[2])
    lastName = data.get("lastName", existing_record[3])
    begin = data.get("begin", existing_record[4])
    end = data.get("end", existing_record[5])
    dateInfo = data.get("dateInfo", existing_record[6])
    excuse = data.get("excuse", existing_record[7])
    excuseHours = data.get("excuseHours", existing_record[8])
    timeout = data.get("timeout", existing_record[9])

    # Update the record with the given ID
    cursor.execute('''
        UPDATE userData
        SET agentId=?, firstName=?, lastName=?, begin=?, end=?, dateInfo=?, excuse=?, excuseHours=?, timeout=?
        WHERE id=?
    ''', (agentId, firstName, lastName, begin, end, dateInfo, excuse, excuseHours, timeout, id))
    conn.commit()

    # Return a success message
    return jsonify({"message": "User data updated successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)