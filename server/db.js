import mysql from "mysql2/promise";
// Pool: um conjunto de conexões abertas e reaproveitadas a cada consulta.
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true, // datas chegam como texto "AAAA-MM-DD", sem conversão de fuso
});
export default db;
