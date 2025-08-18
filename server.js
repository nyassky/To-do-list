const express = require("express");
const PORT = 5500;
const { Pool } = require("pg");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool ({
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	host: "localhost",
	port: 5432,
})

app.get('/tasks', async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
		res,json(result.rows);
	}
	catch (err) {
		res.status(500).send(err.message);
	}
})

app.post('/tasks', async (req, res) => {
	const { tasktext, priority, deadline, tasktype} = req.body;
	try {
		const result = await pool.query("INSERT INTO tasks (tasktext, priority, deadline, tasktype) VALUES ($1, $2, $3, $4) RETURNING *",
			[tasktext, prioriy, deadline, tasktype]
		);
		res.json(result.rows[0]);
	}
	catch (err) {
		res.status(500).send(err.message);
	}
})

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))