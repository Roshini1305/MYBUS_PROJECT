const crypto = require("crypto");
const mysql = require("mysql2");

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "$ENTH!LKUM@R_13a",
  database: "mybus_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Hash Function
function computeHash(source, destination, time) {
  const formattedTime = time.trim().padStart(5, "0"); // Ensure "HH:mm" format
  const data = `${source.trim().toLowerCase()}-${destination.trim().toLowerCase()}-${formattedTime}`;
  return crypto.createHash("sha256").update(data, "utf-8").digest("hex");
}

// Update all stored hashes
db.query("SELECT source, destination, TIME_FORMAT(time, '%H:%i') AS formatted_time FROM bus_routes", (err, results) => {
  if (err) {
    console.error("Database query error:", err);
    return;
  }

  results.forEach((row) => {
    const newHash = computeHash(row.source, row.destination, row.formatted_time);
    db.query("UPDATE bus_routes SET hashed_route_number = ? WHERE source = ? AND destination = ? AND TIME_FORMAT(time, '%H:%i') = ?",
      [newHash, row.source, row.destination, row.formatted_time],
      (updateErr) => {
        if (updateErr) console.error("Error updating hash:", updateErr);
        else console.log(`✅ Updated Hash for ${row.source} → ${row.destination} at ${row.formatted_time}`);
      }
    );
  });

  console.log("🔹 All hashes updated successfully!");
});
