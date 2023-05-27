const { Configuration, OpenAIApi } = require('openai');

const http = require("http");
const { response } = require('express');

const sqlite3 = require("sqlite3").verbose();

const server = http.createServer(async (req, res) => {
    const configuration = new Configuration({
        apiKey: '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'
    });
    const openai = new OpenAIApi(configuration);

    res.setHeader(
        "Access-Control-Allow-Origin",
        "chrome-extension://dhgbflmciegpmknahfplcnofcgbgfjge"
    );
    res.setHeader(
        'chrome-extension',
        '//dhgbflmciegpmknahfplcnofcgbgfjge'
    );
   
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    let body;
    switch(true){
    case(req.url === "/api/partners" && req.method === "GET"):
        // Handle GET request for /api/partners
        const db = new sqlite3.Database("partners.db");

        db.all("SELECT id, name, procent FROM Partners", (err, rows) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal Server Error" }));
                return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(rows));
            db.close();
        });
        break;   
    case (req.url === "/api/partners" && req.method === "POST"):
        // Handle POST request for /api/partners
        body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            const db = new sqlite3.Database("partners.db");
            const { name, procent } = JSON.parse(body);

            if (!name) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Name is required" }));
                return;
            }

            db.run(
                "INSERT INTO Partners (name,procent) VALUES (?, ?)",
                [name, procent],
                function (err) {
                    if (err) {
                        console.error(err);
                        res.writeHead(500, {
                            "Content-Type": "application/json",
                        });
                        res.end(
                            JSON.stringify({ error: "Internal Server Error" })
                        );
                        return;
                    }

                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ id: this.lastID, name }));
                    db.close();
                }
            );
        });

        break;
    case (req.url === "/api/partner" && req.method === "POST"):
        body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            const db = new sqlite3.Database("partners.db");
            const { url } = JSON.parse(body);
            console.log(url)
            if (!url) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "url is required" }));
                return;
            }

            db.all(`Select * from Partners p Where p.name like ?`, [`%${url}%`], (error, rows) => {
                if (error) {
                    console.error('Error executing query:', error.message);
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    console.log(JSON.stringify({rows}))
                    res.end(JSON.stringify({rows}));
                }
              });
        });
        break;
    //ChatGPT case reserved
    case (req.url === "/api/chat" && req.method === "POST"):
        body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {
            const messages = JSON.parse(body);
            console.log(messages);
           
            
            const chatGPT = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: messages,
                temperature: 1.0,
                top_p: 0.7,
                n: 1,
                stream: false,
                presence_penalty: 0,
                frequency_penalty: 0
            }).then((response) => {
                const chatGPTMessage = response.data.choices[0].message;
                res.end(JSON.stringify({chatGPTMessage}));
            })
            
        })
        break;
        
    default:
        // Handle other routes
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not Found" }));
        break;
    }
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});