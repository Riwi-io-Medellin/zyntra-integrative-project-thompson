import app from "./app.js";
import connectMongo from "./config/dbConfig.js";
import db, { createTables } from "./config/mysql.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const connection = await db.getConnection();
    console.log("Connection to MySQL successful");
    connection.release();
    
    // Ensure tables exist
    await createTables();
  } catch (error) {
    console.error("Error connecting to MySQL:", error.message);
    process.exit(1);
  }

  await connectMongo();

  app.listen(PORT, () => {
    console.log("Server running");
  });
};

startServer();
