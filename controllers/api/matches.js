const fs = require('fs');
const gameJson = require('../../todayGames.json');

// fs.readFile('games.json', 'utf8', function readFileCallback(err, data) {
//     if (err) {
//         console.log(err);
//     } else {
//         obj = JSON.parse(data); //now it an object
//         json = JSON.stringify(obj); //convert it back to json
//         fs.writeFile('myjsonfile.json', json, 'utf8', callback); // 
//     }
// });

exports.getGameJson = (req, res, next) => {
    res.json(gameJson);
}

