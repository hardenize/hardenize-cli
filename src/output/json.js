module.exports = printJson;

function printJson(data) {
    console.log(JSON.stringify(data, null, 2));
}