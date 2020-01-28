const fs = require('fs');
    fs.writeFile('./write.txt', 'write test data', (err) => {
        if(err) throw err;
    });
    fs.readFile('./write.txt', (err, data) => {
        if(err) throw err;
        console.log(data);
    })    
