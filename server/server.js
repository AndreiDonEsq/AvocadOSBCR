const http = require("http");

const sqlite3 = require('sqlite3').verbose();

const host = 'localhost';
const port = 8000;

// const db = new sqlite3.Database('partners.db');

//  db.serialize(function() {
//   // Create a table

// //   db.run("CREATE TABLE IF NOT EXISTS Partners (id INTEGER PRIMARY KEY, name TEXT)");
  
// //   // Insert data into the table
// //   db.run("INSERT INTO Partners (name) VALUES ('www.emag.ro')");
// //   db.run("INSERT INTO Partners (name) VALUES ('www.cel.ro')");

//   db.each("SELECT id, name FROM Partners", function(err, row) {
//     console.log(row.id + ": " + row.name);
//  });
// });

// db.close()


// const requestListener = function (req, res) {
//     res.writeHead(200);
//     const db = new sqlite3.Database('partners.db');

//     const response = [];
  
//     db.each("SELECT id, name FROM Partners", function(err, row) {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       response.push({"id" : row.id, "Name" : row.name});
//     }, function() {
//       res.end(JSON.stringify(response));
//       db.close();
//     });
//   };
  

// const server = http.createServer(requestListener);
// server.listen(port, host, () => {
//     console.log(`Server is running on http://${host}:${port}`);
// });

const server = http.createServer((req, res) => {
    if (req.url === '/api/partners' && req.method === 'GET') {
      // Handle GET request for /api/partners
      const db = new sqlite3.Database('partners.db');
      
      db.all('SELECT id, name FROM Partners', (err, rows) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
        db.close()
      });
    } else if (req.url === '/api/partners' && req.method === 'POST') {
      // Handle POST request for /api/partners
      let body = '';
      
      req.on('data', chunk => {
        body += chunk;
      });
      
      req.on('end', () => {
        const db = new sqlite3.Database('partners.db');
        const { name } = JSON.parse(body);
        
        if (!name) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Name is required' }));
          return;
        }
        
        db.run('INSERT INTO Partners (name) VALUES (?)', [name], function(err) {
          if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
          }
          
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ id: this.lastID, name }));
          db.close()
        });
      });
    } else {
      // Handle other routes
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  });
  
  server.listen(3000, () => {
    console.log('Server is running on port 3000');
  });