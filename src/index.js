const express = require("express")
const path = require("path")
const app = express()
const hbs = require("hbs")
const LogInCollection = require("./mongo")
const port = process.env.PORT || 3000
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))


// hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})



// app.get('/home', (req, res) => {
//     res.render('home')
// })
app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };

    try {
        const checking = await LogInCollection.findOne({ name: req.body.name });

        if (checking && checking.password === req.body.password) {
            return res.send("User details already exist"); // Return here to avoid further execution
        }

        await LogInCollection.insertMany([data]);

        res.status(201).render("home", { naming: req.body.name });
    } catch (err) {
        return res.send("Wrong inputs");
    }
});

app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name });

        if (check && check.password === req.body.password) {
            return res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` });
        } else {
            return res.send("Incorrect password");
        }
    } catch (e) {
        return res.send("Wrong details");
    }
});




app.listen(port, () => {
    console.log('port connected');
})