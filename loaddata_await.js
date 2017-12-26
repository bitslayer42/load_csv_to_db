const fs = require('fs');
const readline = require('readline');
const { spawn } = require('child_process');
const { server, username, password } = require('./config.json');
const importsPath = __dirname + "/imports/";
const sqlsPath = __dirname + "/sqls/";
let logFile = __dirname + '/logfile.txt';
//const tableArr = ['t1','t2','t3'];

function getTableNames(importsPath) {
    return new Promise(function (resolve, reject) {  //promisify readdir
        fs.readdir(importsPath, function (error, items) {
            if (error) {
                reject(error);
            } else {
                let tableNameStr = items.map( 
                    function(item){
                        return "'" + item.slice(0,-4) + "'";
                    }
                ).join(',');
                let tableArr = items.map(  //array of tablenames
                    function(item){
                        return item.slice(0,-4);
                    }
                )    
                resolve( [tableArr,tableNameStr] );                
            }
        });
    });
}

async function runPreSql() {
    await sleep(1000); 
    console.log('runPreSql');
}

const getSchemas = async (tableArr)=>{
    await sleep(1000); 
    console.log('getSchemas');
    return tableArr.map( (tableName) => {
        return [
            tableName,
            'somecolumn',
        ]
    });
};

const processFile = async (tableName)=>{
    await sleep(1000); 
    console.log('processFile');
    return 'Processed file: ' + tableName;
}

(async function runAll() {
    //try {
        const [tableArr,tableNameStr] = await getTableNames(importsPath);
        console.log(tableArr,tableNameStr);
        // await runPreSql();                              //started first
        // const schemaDetail = await getSchemas(tableArr,tableNameStr); //  [ 'tblnm', 'colnm', 'type', 'ord' ],

        // console.log(schemaDetail);
        // const promiseArray = tableArr.map(async (tableName) => {
        //     const content = await processFile(tableName);
        //     return content;
        // });
        // const resultArray = await Promise.all(promiseArray);

        // console.log(resultArray,'afterallissaidanddone');
    // }catch(e){
    //     console.log(e);
    // }
})();  // immediately-invoked function expression



//utility to simulate time...
async function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// async function foo() {
//     await sleep(1000); 
//     console.log('foo');
//     return('foo');
// }
