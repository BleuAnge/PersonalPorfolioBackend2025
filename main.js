const { Client } = require("pg");
const express = require("express");

const app = express();
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
    console.log("DB Config:", {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        port: process.env.DATABASE_PORT,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    });
}

const connection = new Client({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

connection.connect().then(() => {
    console.log("Connected to database")
});

app.get("/", (req, res) => {
    res.send("Oh Hi /OwO/")
})

app.post(
    "/postProject", 
    (req, res) => {
        const {id, name, type} = req.body;

        const query = "INSERT INTO projects (id, name, type) VALUES ($1, $2, $3);";
    
        connection.query(
            query, 
            [id, name, type], 
            (error, result) => {
                if (error) {
                    console.log(error);
                    res.send({
                        success: false,
                        error: error
                    });
                }
                else {
                    console.log(result);
                    res.send({
                        success: true,
                        result: "Successfully Created Project"
                    });
                }
            }
        );
    }
)

app.get(
    "/getAllProjects",
    (req, res) => {
        const query = "SELECT * FROM projects";

        connection.query(
            query,
            (error, result) => {
                if (error) {
                    console.log(error);
                    res.send({
                        success: false,
                        error: error
                    });
                }
                else {
                    console.log(result);
                    res.send({
                        success: true,
                        result: result.rows
                    });
                }
            }
        )
    }
)

app.get(
    "/getProject/:id",
    (req, res) => {
        const {id} = req.params;

        const query = "SELECT * FROM projects WHERE id = $1";

        connection.query(
            query,
            [id],
            (error, result) => {
                if (error) {
                    console.log(error);
                    res.send({
                        success: false,
                        error: error
                    });
                }               
                else {
                    console.log(result);
                    res.json({
                        success: true,
                        result: result.rows[0]
                    });
                }
            }
        )
    }
)

app.put(
    "/updateProject/:id",
    (req, res) => {
        const {id} = req.params;
        const {name, type} = req.body;

        const query = "UPDATE projects SET name = $1, type = $2 WHERE id = $3";

        connection.query(
            query,
            [name, type, id],
            (error, result) => {
                if (error) {
                    console.log(error);
                    res.send({
                        success: false,
                        error: error 
                    });
                }
                else {
                    console.log(result);
                    res.send({
                        success: true,
                        result: "Successfully Updated Project"
                    });
                }
            }
        )   
    }
)

app.delete(
    "/deleteProject/:id",
    (req, res) => {
        const {id} = req.params;

        const query = "DELETE FROM projects WHERE id = $1";

        connection.query(
            query,
            [id],
            (error, result) => {
                if (error) {
                    console.log(error);
                    res.send({
                        success: false,
                        error: error
                    });
                }
                else {
                    console.log(result);
                    res.send({
                        success: true,
                        result: "Successfully Deleted Project"
                    });
                }
            }
        )
    }
)


app.listen(3001, () => {
    console.log("Server started on port 3001")
})