    const express = require("express")
const app = express()
const usermodel = require("./models/usermodel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index")
})

//singup

app.post("/create", async (req, res) => {
    try {
        const { username, email, password, age } = req.body;

        if (!username || !email || !password || !age) {
            return res.status(400).send({ message: "All fields are required" });
        }
        bcrypt.hash(password, 10, async function (err, hash) {
            const createuser = await usermodel.create({
                username,
                email,
                password: hash,
                age
            })
            const token = jwt.sign({ email }, "shhhh")
            res.cookie("token", token)
            res.send(createuser)
        });


    } catch (error) {
        console.error("Error creating user");
        res.status(500).send({ message: "server error", error: error.message })
    }

})

//signin 
app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {
    try {

        let user = await usermodel.findOne({ email: req.body.email });
        if (!user) return res.send("something went wrong 😒")

        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result) res.send("User Logged in successfully 😍")
            else res.send("sorry you can not logged in 🤦‍♀️")
            console.log(err)
        })

    } catch (error) {

    }
})
app.listen(8080, () => {
    console.log("server is running on port 8080");
})

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
})

