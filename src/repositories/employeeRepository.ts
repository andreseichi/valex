import { connection } from "../database/postgres";
import { Employee } from "../types/employee";

export async function findById(id: number) {
  const result = await connection.query<Employee, [number]>(
    "SELECT * FROM employees WHERE id=$1",
    [id]
  );

  return result.rows[0];
}
