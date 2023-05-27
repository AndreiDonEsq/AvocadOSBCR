const http = require("http");

const sqlite3 = require("sqlite3").verbose();

const server = http.createServer((req, res) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "chrome-extension://dhgbflmciegpmknahfplcnofcgbgfjge"
    );

    if (req.url === "/api/partners" && req.method === "GET") {
        // Handle GET request for /api/partners
        const db = new sqlite3.Database("partners.db");

        db.all("SELECT id, name FROM Partners", (err, rows) => {
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
    } else {
        // Handle other routes
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not Found" }));
    }
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
