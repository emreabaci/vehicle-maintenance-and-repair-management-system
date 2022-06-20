const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const config = require('./config/database');
const User = require('./models/user');

// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', async() => {
    console.log(`Connected to database ${config.database}`);

    const countAdmin = await User.getUsersTotalCount("admin");
    const countUser = await User.getUsersTotalCount("user");
   
    if(!countAdmin){
        let newAdminUser = new User ({
            name: "administrator",
            email: "admin@admin.com",
            telephone: "05376666666",
            username: "admin",
            password: "asd123FF",
            role: "admin"
          });
        
          User.addUser(newAdminUser, (err, user) => {
            if(err) {
              console.log('Failed to register default admin user');
            } else {
              console.log('Default admin user registered');
            }
          });
    }

    if(!countUser){
        let newNormalUser = new User ({
            name: "test",
            email: "test@test.com",
            telephone: "05376666666",
            username: "test",
            password: "asd123FF",
            role: "user"
          });
        
          User.addUser(newNormalUser, (err, user) => {
            if(err) {
              console.log('Failed to register default test user');
            } else {
              console.log('Default test user registered');
            }
          });
    }
});

// On Error
mongoose.connection.on('error', (err) => {
    console.log(`Database error: ${err}`);
});

const app = express();

const users = require('./routes/users');
const maintenances = require('./routes/maintenances');
const statistics = require('./routes/statistics');

// Port Number
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/maintenances', maintenances);
app.use('/statistics', statistics);

// Index Route
app.get('/', (req, res) => {
    res.send("Invalid Endpoint");
});

// Start Server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});