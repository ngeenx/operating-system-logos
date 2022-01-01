/**
 * This simple server generates available logo list for readme table in markdown format
 * Server start: node list.js
 */

const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1',
    port = 2021,
    sizeList = [16, 24, 32, 48, 64, 128],
    baseRepoAddress = 'https://raw.githubusercontent.com/EgoistDeveloper/operating-system-logos/master',
    previewSize = '48x48';

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    try {
        let osList = JSON.parse(fs.readFileSync('list.json')),
            tableMarkdown = `| Preview | Code | Name | Status |\n| ------- | ---- | ---- | ------ |\n`,
            availableItems = 0;

        osList = Object.entries(osList);

        osList.forEach(osItem => {
            const osCode = osItem[0],
                osName = osItem[1];
                
            let logoStackCount = 0,
                missingSizes = [];

            // count exists and missing images for target logo
            sizeList.forEach(size => {
                let logoPath = `${size}x${size}/${osCode}.png`;

                if (fs.existsSync(logoPath)) {
                    logoStackCount += 1;
                } else {
                    missingSizes.push(size);
                }
            });
            
            //#region markdown print

            if (logoStackCount == 0) {
                tableMarkdown += `| ............ | ${osCode} | ${osName} | ❌ |\n`;

                console.log(`❌ ${osName} (${osCode}): all logos not found.\n--------------------------`);
            } else if (logoStackCount == sizeList.length) {
                tableMarkdown += `| ![](${baseRepoAddress}/src/${previewSize}/${osCode}.png "${osCode} (${previewSize})") | ${osCode} | ${osName} | ✅ |\n`;

                availableItems += 1;
            } else if (logoStackCount > 0 && logoStackCount < sizeList.length) {
                tableMarkdown += `| ............ | ${osCode} | ${osName} | ⭕ |\n`;

                console.log(`⭕ ${osName} (${osCode}): ${sizeList.length - logoStackCount} logos missing (sizes: ${missingSizes.join(', ')})\n--------------------------`);
            }

            //#endregion
        });

        console.log(`\nTotal: ${osList.length}, available: ${availableItems}, unavailable: ${osList.length - availableItems}\n\n`);
        
        res.end(tableMarkdown);
    } catch (err) {
        res.end(err.toString());
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});