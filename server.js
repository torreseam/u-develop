//Dependancies 
const express = require('express');
const db = require('./db/database');
const inputCheck = require('./utils/inputCheck');
// const sqlite3 = require('sqlite3').verbose();--Modularize to database.js

//Routes
const apiRoutes = require('./routes/apiRoutes');

//Port
const PORT = process.env.PORT || 3001;
const app = express();

//Use API Route
app.use('/api', apiRoutes);

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// // Connect to database=--Modularize to database.js
// const db = new sqlite3.Database('./db/election.db', err => {
//     if (err) {
//         return console.error(err.message);
//     }

//     console.log('Connected to the election database.');
// });


// // Get all candidates
// app.get('/api/candidates', (req, res) => {
//     const sql = `SELECT candidates.*, parties.name
//       AS party_name
//       FROM candidates
//       LEFT JOIN parties
//       ON candidates.party_id = parties.id`;
//     const params = [];
//     db.all(sql, params, (err, rows) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }

//         res.json({
//             message: 'success',
//             data: rows
//         });
//     });
// });

// // To GET a single candidate 
// app.get('/api/candidate/:id', (req, res) => {
//     const sql = `SELECT candidates.*, parties.name
//    AS party_name
//    FROM candidates
//    LEFT JOIN parties
//    ON candidates.party_id = parties.id
//    WHERE candidates.id = ?`;
//     const params = [req.params.id];
//     db.get(sql, params, (err, row) => {
//         if (err) {
//             res.status(400).json({ error: err.message });
//             return;
//         }

//         res.json({
//             message: 'success',
//             data: row
//         });
//     });
// });

// // Delete a candidate
// app.delete('/api/candidate/:id', (req, res) => {
//     const sql = `DELETE FROM candidates WHERE id = ?`;
//     const params = [req.params.id];
//     db.run(sql, params, function (err, result) {
//         if (err) {
//             res.status(400).json({ error: res.message });
//             return;
//         }

//         res.json({
//             message: 'successfully deleted',
//             changes: this.changes
//         });
//     });
// });

// // Create-add candidate using POST-name and id need to change as it cannot be reused to protect from duplicates 
// app.post('/api/candidate', ({ body }, res) => {
//     const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
//     if (errors) {
//         res.status(400).json({ error: errors });
//         return;
//     }
//     //allows to add candidates in insomnia
//     const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
//               VALUES (?,?,?)`;
//     const params = [body.first_name, body.last_name, body.industry_connected];
//     // ES5 function, not arrow function, to use `this`
//     db.run(sql, params, function (err, result) {
//         if (err) {
//             res.status(400).json({ error: err.message });
//             return;
//         }

//         res.json({
//             message: 'success',
//             data: body,
//             id: this.lastID
//         });
//     });
// });

// GET a list of all the parties
app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
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

// GET a single party based on id
app.get(`/api/party/:id`, (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
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

//move to candidateRouter.js
// // PUT a candidates allegiance to a different one
// app.put('/api/candidate/:id', (req, res) => {
//     const errors = inputCheck(req.body, 'party_id');

//     if (errors) {
//         res.status(400).json({ error: errors });
//         return;
//     }

//     const sql = `UPDATE candidates SET party_id = ? WHERE id = ?`;
//     const params = [req.body.party_id, req.params.id];

//     db.run(sql, params, function (err, result) {
//         if (err) {
//             res.status(400).json({ error: err.message });
//             return;
//         }
//         res.json({
//             message: 'success',
//             data: req.body,
//             changes: this.changes
//         });
//     });
// });

//  DELETE a party based on id
app.delete(`/api/party/:id`, (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ error: res.message });
            return;
        }

        res.json({ message: 'successfully deleted', changes: this.changes });
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