var express = require('express');
var app = express();
var db = require("./database.js");
var bodyParser = require('body-parser');
app.use(bodyParser.json());

let HTTP_PORT = 8080;

app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});

// Add customer API
app.post("/api/customer", (req, res) => {
    try {
        var errors = [];
        const {
            name,
            address,
            email,
            dateOfBirth,
            gender,
            age,
            cardHolderName,
            cardNumber,
            expiryDate,
            cvv,
            timeStamps
        } = req.body;

        // Validation
        if (!name || !address || !email || !dateOfBirth || !gender || !age || !cardHolderName || !cardNumber || !expiryDate || !cvv || !timeStamps) {
            errors.push("Missing required fields");
        }
        if (isNaN(age) || isNaN(cardNumber) || isNaN(cvv)) {
            errors.push("age, cardNumber and cvv must be valid numbers");
        }
        if (errors.length > 0) {
            return res.status(400).json({ "errors": errors });
        }

        var sql = "INSERT INTO customer (name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timeStamps) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        var params = [name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timeStamps];

        db.run(sql, params, function (err) {
            if (err) {
                console.error("Database Error: ", err.message);
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": req.body,
                "id": this.lastID
            });
        });
    } catch (E) {
        console.error("Server Error: ", E);
        res.status(500).json({ "error": "Internal server error" });
    }
});

// Get customer API
app.get("/api/customer", (req, res, next) => {

    try {
        var sql = "select * from customer";
        var params = [];
        db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            });
        });
    } catch {
        res.status(400).send(E);
    }
});

// Update customer API
app.put("/api/customer/", (req, res, next) => {
    const {
        id,
        name,
        address,
        email,
        dateOfBirth,
        gender,
        age,
        cardHolderName,
        cardNumber,
        expiryDate,
        cvv,
        timeStamps
    } = req.body;

    db.run(`UPDATE customer set name = ?, address = ?, email = ?, dateOfBirth = ?, gender = ?, age = ?, cardHolderName = ?, cardNumber = ?, expiryDate = ?, cvv = ?, timeStamps = ?  WHERE id = ?`,
        [
            name,
            address,
            email,
            dateOfBirth,
            gender,
            age,
            cardHolderName,
            cardNumber,
            expiryDate,
            cvv,
            timeStamps,
            id
        ],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ updated: this.changes });
        });
});

// Delete customer API
app.delete("/api/customer/delete/:id", (req, res, next) => {
    try {
        db.run('DELETE FROM customer WHERE id = ?', req.params.id, function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({ deleted: this.changes });
        });
    } catch (E) {
        res.status(400).send(E);
    }
});