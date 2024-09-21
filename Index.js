const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const config = {
    user:"pavan",
    password: "1234",
    server: 'SBIL0003LP-1265', 
    database: 'Task', 
    options: {
        trustServerCertificate:true,
        trustedConnection: false, 
        enableArithAbort:true,
        instanename :"MSSQLSERVER", 
        trustServerCertificate: true,
    },
    port : 1433
};

async function connectToDatabase() {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server using Windows Authentication.');

        const result = await sql.query('SELECT * FROM tasks');
        console.log(result.recordset);

    } catch (err) {
        console.error('Error connecting to the database:', err);
    } finally {
        await sql.close();
    }
}

// connectToDatabase();

app.get('/api/tasks', async (req, res) => {
    console.log('GET /api/tasks hit');
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Tasks');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving tasks');
    }
});

app.post('/api/tasks', async (req, res) => {
    console.log('Received POST data:', req.body); 
    const { assignedTo, status, dueDate, priority, comments } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('assignedTo', sql.NVarChar, assignedTo)
            .input('status', sql.NVarChar, status)
            .input('dueDate', sql.Date, dueDate)
            .input('priority', sql.NVarChar, priority)
            .input('comments', sql.NVarChar, comments)
            .query('INSERT INTO Tasks (assignedTo, status, dueDate, priority, comments) VALUES (@assignedTo, @status, @dueDate, @priority, @comments)');
        res.status(201).send('Task created successfully');
    } catch (err) {
        console.error('Error while adding task:', err);
        res.status(500).send('Server Error');
    }
});


app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { assignedTo, status, dueDate, priority, comments } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, id)
            .input('assignedTo', sql.NVarChar, assignedTo)
            .input('status', sql.NVarChar, status)
            .input('dueDate', sql.Date, dueDate)
            .input('priority', sql.NVarChar, priority)
            .input('comments', sql.NVarChar, comments)
            .query('UPDATE Tasks SET assignedTo = @assignedTo, status = @status, dueDate = @dueDate, priority = @priority, comments = @comments WHERE id = @id');
        res.send('Task updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.delete('/api/tasks/:id', async (req, res) => {

    const { id } = req.params;
    console.log('Received DELETE request for ID:', id);
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Tasks WHERE id = @id');
        res.send('Task deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
