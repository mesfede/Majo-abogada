const http = require('http');

const data = JSON.stringify({
  fullName: "Roberto Test",
  email: "roberto@test.com",
  message: "Necesito asesoramiento por un divorcio de mutuo acuerdo con mi ex pareja, sin hijos menores. Tenemos una casa en comun.",
  caseType: "Divorcio"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/consultas',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let chunks = '';
  res.on('data', (d) => { chunks += d; });
  res.on('end', () => { console.log(chunks); });
});

req.on('error', (error) => { console.error(error); });
req.write(data);
req.end();
