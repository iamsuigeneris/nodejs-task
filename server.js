const http = require('http')
const fs = require('fs')
const { parse } = require('querystring')


const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        collectRequestData(req, result => {
            console.log(result.message);
            res.end(result.message);
            fs.appendFileSync('./message.txt',result.message) 
        });   
    }
    else{
        res.end(`
        <!doctype html>
            <html>
                <body>
                    <h1>Please enter a message</h1>
                    <form action="/message" method="post">
                        <label>Message</label>
                        <input type="text" name="message" /><br />
                        <label>Submit Message</label>
                        <button>Submit</button>
                    </form>
                </body>
            </html>
        `)
    }
})

server.listen(8080)

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}