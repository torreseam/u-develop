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