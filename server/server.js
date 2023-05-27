import { Configuration, OpenAIApi } from 'openai';

const http = require("http");

const sqlite3 = require("sqlite3").verbose();

const server = http.createServer((req, res) => {
    
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

    if (req.url === "/api/partners" && req.method === "GET") {
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
    } else if (req.url === "/api/partners" && req.method === "POST") {
        // Handle POST request for /api/partners
        let body = "";

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
    }
    else if(req.url === "/api/partner" && req.method === "POST"){
        let body = "";

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
                    res.end(JSON.stringify({rows}));
                }
              });
        });
    }
    else {
        // Handle other routes
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not Found" }));
    }
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});

const configuration = new Configuration({
    apiKey: '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'
});
const openai = new OpenAIApi(configuration);

export const POST = (async () => {
    const messages = request.JSON;
    const chatGPT = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages
    });
    const chatGPTMessage=chatGPT.data.choices[0].message;

    console.log(chatGPTMessage);

    return json(chatGPTMessage);
});