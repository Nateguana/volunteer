import express from 'express';
import vite from 'vite-express';
import passport from 'passport';
import crypto from "crypto";
import cookieParser from "cookie-parser"
import { MongoClient, ServerApiVersion } from 'mongodb';
import passportCustom from 'passport-custom';
import 'dotenv/config'

const
    app = express(),
    port = 3000;

console.log("Starting");

// db client
async function getDB() {
    const dbString = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_CLIENT}@cluster.vvdqqog.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`;
    const client = new MongoClient(dbString, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully pinged your deployment.");
    let db = client.db("data");
    return {
        db,
        users: () => db.collection("users"),
        people: () => db.collection("people"),
        days: () => db.collection("days")
    }
}

const DB = await getDB()

function getRandom() {
    return new Promise((res, rej) =>
        crypto.randomBytes(8, function (err, buffer) {
            var token = buffer.toString('hex');
            res(token);
        }));
}

app.use(cookieParser());
app.use(express.json());

function removeOldUsers() {
    let now = Date.now();
    // remove users who time to remove is less than now
    return DB.users().deleteMany(
        { timeout: { $lt: now } }
    )
}

app.post('/signin', async (req, res) => {
    let pass = req.body.pass;
    if (pass === process.env.MASTER_PASSWORD) {
        await removeOldUsers()
        let randomKey = await getRandom();
        res.cookie("token", randomKey);

        let ticks = Date.now() + 60 * 60 * 1000; // 1 hour
        await DB.users().insertOne({
            name: "admin",
            token: randomKey,
            admin: true,
            timeout: ticks
        })
        res.writeHead(200, "OK", { "Content-Type": "application/json" });
        res.end(JSON.stringify({ name: "admin" }));
    } else {
        res.status(401);
        res.end();
    }
});

passport.use(new passportCustom.Strategy(
    function (req, done) {
        let token = req.cookies.token;
        if (token) {
            DB.users().findOne({ token: token }).then((user) => {
                if (user) {
                    user.exists = true;
                    return done(null, user);
                }
                return done(null, {});
            });
        } else {
            done(null, {});
        }
    }
));
app.use(passport.authenticate("custom", { session: false }));

app.post("/connect", (req, res) => {
    let user_type = "none";
    if (req.user.exists) {
        if (req.user.admin) {
            user_type = "admin";
        } else {
            user_type = "user";
        }
    }
    console.log(`user tried to connect and got ${user_type} privlage`);
    res.writeHead(200, "OK", { "Content-Type": "application/json" });
    res.end(JSON.stringify({ user_type, name: req.user.name }));
})

app.post("/downgrade", async (req, res) => {
    // not admin
    if (!req.user.admin) {
        res.status(401);
        res.end();
        // did not give name
    } else if (!req.body.name) {
        res.status(400);
        res.end();
    } else {

        await removeOldUsers();
        let randomKey = await getRandom();
        res.cookie("token", randomKey);

        let ticks = Date.now() + 365 * 24 * 60 * 60 * 1000; // 1 year
        await DB.users().replaceOne({ _id: req.user._id },
            {
                name: req.body.name,
                token: randomKey,
                admin: false,
                timeout: ticks
            }
        );

        res.end();
    }
})

const MAX_PEOPLE_RETURN = 50;
const SEARCH_PIPELINE = [
    { $limit: 20 },
    {
        $project: {
            "id": "$_id",
            "first": "$name.first",
            "last": "$name.last",
            "dob": 1,
            "zip": 1,
            "last_seen": {
                $ifNull: ['$last_seen', { $literal: 0 }],
            },
            "_id": 0
        }
    },
    { $sort: { 'first': 1, 'last': 1, 'dob.year': 1 } }];

app.post("/search", async (req, res) => {
    // not auth
    if (!req.user.exists) {
        res.status(401);
        res.end();
    }

    let query = {};
    let json = req.body;

    // date of birth
    if (Number.isInteger(json.dob.month) && Number.isInteger(json.dob.day)) {
        query = { "dob.month": json.dob.month, "dob.day": json.dob.day };
        if (Number.isInteger(json.dob.year)) {
            query["dob.year"] = json.dob.year;
        }
    }

    //first name
    let name = json.first;
    if (name && name.length > 0) {
        let start = "";
        if (name[0] == name[0].toUpperCase()) {
            start = "^";
        }
        query['name.first'] = { $regex: start + name.toLowerCase() };
    }

    //last name
    name = json.last;
    if (name && name.length > 0) {
        let start = "";
        if (name[0] == name[0].toUpperCase()) {
            start = "^";
        }
        query['name.last'] = { $regex: start + name.toLowerCase() };
    }

    let pipeline = [{ $match: query }, ...SEARCH_PIPELINE]

    let cursor = DB.people().aggregate(pipeline);
    let data = await cursor.toArray()
    res.writeHead(200, "OK", { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
})

app.post("/input", async (req, res) => {
    // not admin
    if (!req.user.admin) {
        res.status(401);
        res.end();
        // did not give id
    } else if (!req.body.id) {
        res.status(400);
        res.end();
    } else {

    }
});

app.post("/signout", (req, res) => {
    console.log("user signed out");
    res.cookie("token", null);
    res.end();
})

app.get("/test", (req, res) => {
    console.log("test was hit");
    res.end();
})



app.post("/test", (req, res) => {
    console.log(`test post was hit with ${JSON.stringify(req.body)}`);
    res.end();
})

console.log("Starting");
vite.listen(app, process.env.PORT || port);