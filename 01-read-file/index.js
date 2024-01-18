const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, 'text.txt');
const { stdout } = process;


const stream = fs.ReadStream(filePath, "utf-8");
stream.on("data", (chunk) => {
    stdout.write('\n');
    stdout.write(chunk);
    stdout.write('\n');
});