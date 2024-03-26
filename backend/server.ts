import * as sql from 'mssql';

// Configuración de la conexión a la base de datos
const dbConfig: sql.config = {
  user: 'sa',
  password: 'admin123',
  server: 'DESKTOP-KJUB9O1\SQLEXPRESS',
  database: 'db_factura',
};

/// Función para conectar a la base de datos
async function connectDB(): Promise<sql.ConnectionPool> {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('Conexión establecida correctamente.');
    return pool;
  } catch (error) {
    throw new Error('Error al conectar a la base de datos: ' + error);
  }
}

// Función para crear una factura
async function createFactura(nombre_producto: string, cantidad: number, precio_unitario: number, total: number, total_factura: number, total_IVA: number): Promise<void> {
  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('nombre_producto', sql.NVarChar, nombre_producto)
      .input('cantidad', sql.Int, cantidad)
      .input('precio_unitario', sql.Decimal(18, 2), precio_unitario)
      .input('total', sql.Decimal(18, 2), total)
      .input('total_factura', sql.Decimal(18, 2), total_factura)
      .input('total_IVA', sql.Decimal(18, 2), total_IVA)
      .query('INSERT INTO Factura (nombre_producto, cantidad, precio_unitario, total, total_factura, total_IVA) VALUES (@nombre_producto, @cantidad, @precio_unitario, @total, @total_factura, @total_IVA)');
    console.log('Factura creada correctamente.');
  } catch (error) {
    throw new Error('Error al crear factura: ' + error);
  }
}

// Función para obtener todas las facturas
async function getFacturas(): Promise<any[]> {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Factura');
    return result.recordset;
  } catch (error) {
    throw new Error('Error al obtener facturas: ' + error);
  }
}


// Función para borrar una factura
async function deleteFactura(id: number): Promise<void> {
  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Factura WHERE id = @id');
    console.log('Factura eliminada correctamente.');
  } catch (error) {
    throw new Error('Error al eliminar factura: ' + error);
  }
}

// Ejemplo de uso del CRUD de Facturas
async function exampleCRUD() {
  // Crear una factura
  await createFactura('Producto A', 5, 10.50, 52.50, 55.13, 2.63);

  // Obtener todas las facturas
  const facturas = await getFacturas();
  console.log('Facturas:', facturas);



  // Borrar una factura
  await deleteFactura(1);

  // Obtener todas las facturas después de borrar
  const remainingFacturas = await getFacturas();
  console.log('Facturas restantes:', remainingFacturas);
}

// Ejecutar el ejemplo CRUD de Facturas
exampleCRUD().catch(error => console.error('Error:', error));