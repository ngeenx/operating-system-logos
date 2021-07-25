/**
 * This simple server generates available logo list for readme table in markdown format
 * Server start: node list.js
 */

const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 2021;
const sizeList = [16, 24, 32, 48, 64, 128];

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    try {
        let osList = JSON.parse(fs.readFileSync('list.json')),
            tableMarkdown = `| Preview | Code | Name | Status |\n| ------- | ---- | ---- | ------ |\n`,
            availableItems = 0;

        osList = Object.entries(osList);

        osList.forEach(osItem => {
            let logoStackCount = 0,
                missingSizes = [];

            sizeList.forEach(size => {
                let logoPath = `${size}x${size}/${osItem[0]}.png`;

                if (fs.existsSync(logoPath)) {
                    logoStackCount += 1;
                } else {
                    missingSizes.push(size);
                }
            });

            if (logoStackCount == 0) {
                tableMarkdown += `| ............ | ${osItem[0]} | ${osItem[1]} | ❌ |\n`;

                console.log(`❌ ${osItem[1]} (${osItem[0]}): all logos not found.\n--------------------------`);
            } else if (logoStackCount == sizeList.length) {
                tableMarkdown += `| ![](src/48x48/${osItem[0]}.png "${osItem[0]}") | ${osItem[0]} | ${osItem[1]} | ✅ |\n`;

                availableItems += 1;
            } else if (logoStackCount > 0 && logoStackCount < sizeList.length) {
                tableMarkdown += `| ............ | ${osItem[0]} | ${osItem[1]} | ⭕ |\n`;

                console.log(`⭕ ${osItem[1]} (${osItem[0]}): ${sizeList.length - logoStackCount} logos missing (sizes: ${missingSizes.join(', ')})\n--------------------------`);
            }
        });

        console.log(`\nTotal: ${osList.length}, available: ${availableItems}, unavailable: ${osList.length - availableItems}\n\n`);
        res.end(tableMarkdown);
    } catch (err) {
        res.end(err);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});