const express = require("express");
const PORT = 5500;
const { Pool } = require("pg");
require("dotenv").config();
const cors = require("cors");
const corsOptions = {
    origin: 'http://localhost:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
};
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("frontend"));

const pool = new Pool ({
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
})

app.get('/tasks', async (req, res) => {
	try {
		let query = "SELECT * FROM tasks";
		const values = [];
		let paramCount = 0;

		if (req.query.priority) {
			query += ` WHERE priority = $${++paramCount}`;
			values.push(req.query.priority);
		}

		const sortFieldMap = {
			date: "deadline",
			priority: "priority", 
			type: "tasktype"
		};

		if (req.query.sortBy && sortFieldMap[req.query.sortBy]) {
			const safeSortField = sortFieldMap[req.query.sortBy];
			query += ` ORDER BY ${safeSortField} DESC`;
		} else {
			query += " ORDER BY id DESC";
		}

		console.log("Final query:", query, "Values:", values);
		
		const result = await pool.query(query, values);
		res.json(result.rows);
	}
	catch (err) {
		console.error(err);
		res.status(500).send(err.message);
	}
});

app.post('/tasks', async (req, res) => {
	const { tasktext, priority, deadline, tasktype} = req.body;
	try {
		const result = await pool.query("INSERT INTO tasks (tasktext, priority, deadline, tasktype) VALUES ($1, $2, $3, $4) RETURNING *",
			[tasktext, priority, deadline, tasktype]
		);
		res.json(result.rows[0]);
	}
	catch (err) {
		console.error(err);
		res.status(500).send(err.message);
	}
})
app.put('/tasks/:id', async (req, res) => {
	try {
		console.log("PUT /tasks/:id", req.params.id);
		const result = await pool.query("UPDATE tasks SET completed=true WHERE id=$1 RETURNING *",
		[req.params.id]);
		res.json(result.rows[0]);
	}
	catch (err){
		console.log("Updated task:", result.rows[0]);
		console.error(err);
		res.status(500).send(err.message);
	}
})
app.delete('/tasks/:id', async (req,res) => {
	try {
		await pool.query("DELETE FROM tasks WHERE id=$1", [req.params.id])
		res.sendStatus(204);
	}
	catch (err){
		console.error(err);
		res.status(500).send(err.message);	
	}
})

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))