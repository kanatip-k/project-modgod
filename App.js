const express = require("express");
const { MongoClient, ObjectId } = require("mongodb")
const app = express();

app.use(express.json())
let db;
const client = new MongoClient("mongodb://localhost:27017");
client.connect().then(() => {
    db = client.db("ecommece");
    console.log("MongoDB connected");
}).catch((err) => {
    console.log("MongoDB unconnect");
});


// ดึงข้อมูลทั้งหมด
app.get('/product', async (req, res) => {
    try {
        const product = await db.collection("product").find().toArray();
        res.json(product);
    } catch (err) {
        res.json("error");
    }
});

app.get('/product/topping/:topping', async (req, res) => {
    try {
        const topping = req.params.topping;
        const product = await db.collection("product").find({
            "topping": { $in: [{ "name": topping }] }
        }).toArray();
        res.json(product);
    } catch (err) {
        res.json("error");
    }
});


// ดึงข้อมูลรายการนั้น
app.get('/product/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await db.collection("product").findOne({
            "_id": new ObjectId(id)
        });
        res.json(product);
    } catch (err) {
        res.json("error");
    }
});

// เพิ่มข้อมูลใหม่
app.post('/product', async (req, res) => {
    try {
        const data = req.body;
        const product = await db.collection("product").insertOne(data);
        res.json(product);
    } catch (err) {
        res.json("error");
    }
});

// แก้ไขข้อมูล
app.put('/product/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const product = await db.collection("product").updateOne({
            "_id": new ObjectId(id)
        }, {
            $set: data
        });
        res.json(product);
    } catch (err) {
        res.json("error");
    }
});


app.listen(3000, () => {
    console.log('Server started: success');
});