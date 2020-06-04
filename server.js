//Dependancies 
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

//Port
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Connect to database
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
        return console.error(err.message);
    }

    console.log('Connected to the election database.');
});


// Get all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.json({
            message: 'success',
            data: rows
        });
    });
});

// To GET a single candidate 
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates 
               WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: 'success',
            data: row
        });
    });
});

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ error: res.message });
            return;
        }

        res.json({
            message: 'successfully deleted',
            changes: this.changes
        });
    });
});


// CATCHALL Route for no response to server---Default response for any other request(Not Found) Catch all
app.use((req, res) => {
    res.status(404).end();
});








// Start server after DB connection
db.on('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

//reference code
//Test Express.js Connection-display on URL-NOT TO BE USED YET
// app.get('/', (req, res) => {
//     res.json({
//         message: 'Hello World'
//     });
// });

//SHOW all data from the table 
// db.all(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });

// To GET a single candidate 2
// db.get(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });

// Delete a candidates
// db.run(`DELETE FROM candidates WHERE id = ?`, 1, function (err, result) {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result, this, this.changes);
// });


// Create-add candidates name and id need to change as it cannot be re -se to protect from duplicates 
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
//               VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];
// // ES5 function, not arrow function, to use this
// db.run(sql, params, function (err, result) {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result, this.lastID);
// });