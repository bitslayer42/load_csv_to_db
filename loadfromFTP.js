const XLSX = require('xlsx');
let db = require('odbc')();
const fs = require('fs');
const readline = require('readline');
const parse = require('csv-parse');
const glob = require("glob");


const { fileBasePath, connectionString } = require('./config.json');
const uploads = [
    {type:"csv",file:"/photo/LINKS.TXT",table:"linktable"},
    {type:"excel",file:"/example/data.xls",table:"exampledata"},
];
//let sqlFile = fs.createWriteStream("./out.sql");
let logFile;

//If data in logfile, save it.
const logFileNm = __dirname + '/logfiles/logfile.txt';
if(fs.existsSync(logFileNm)){
    let nowStr = Date.now();
    let newLogFileName = __dirname + '/logfiles/logfile' + nowStr + '.txt';
    fs.rename(logFileNm,newLogFileName,function (err) {
        if (err) {logFile.write(err.toString());return;}
        proceed();
    });
}else{proceed();}  

function proceed(){
    logFile = fs.createWriteStream(logFileNm);

    db.open(connectionString, function (err) {
        if (err) {logFile.write(err.toString());return;}
        //Iterate through files
        uploads.forEach((upload)=>{ 
                if(upload.type==="excel"){
                    processExcelFile(upload.file,upload.table);
                }else if(upload.type==="csv"){
                    processCsvFile(upload.file,upload.table);
                }
        });
    });
}

function processExcelFile(file,table) {
    let str1 = '', str2 = '';
    let queryStr;
    try {
        var workbook = XLSX.readFile(fileBasePath + file);
    } catch (err) {
        logFile.write(err.toString());
        return;
     }
    var jsonObj = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1'],{raw:true});
    //console.log(jsonObj);
    queryStr = "DELETE " + table ;
    sendToDb(queryStr);

    jsonObj.forEach(row=>{
        let colNameArr=[], valueArr=[];
        for (var col in row) {
            colNameArr.push(col);//console.log(col);
            valueArr.push(row[col]);
        }
        let colNames = "["+colNameArr.join("],[").replace(/\.|\n| /g,"")+"]" ;
        let values = "'"+valueArr.join("','")+"'";
        queryStr = "INSERT INTO " + table + "(" + colNames + ")VALUES(" + values + ")";
        sendToDb(queryStr);
    });
    logFile.write("Table "+table+" Loaded\n");
}

function processCsvFile(file,table) {
    let firstLine = true;
    let queryStr,colNames,values;

    queryStr = "DELETE " + table ;
    sendToDb(queryStr);
    glob(fileBasePath + file,function(err,files){
        if(files.length===1){
            let rl = readline.createInterface({
                input: fs.createReadStream(files[0])
            });
            rl.on('line', (line) => {
                //csv-parse: returns [[1,2,3]]
                parse(line, function(err, parsed){ 
                    if(parsed){
                        fields = parsed[0].map(field=>field.replace(/'/,"''"));
                        if(firstLine) { 
                            colNames = "["+fields.join("],[").replace(/'| /g,"")+"]" ;
                            firstLine = false;
                        }else{
                            values = "'"+fields.join("','")+"'";
                            queryStr = "INSERT INTO " + table + "(" + colNames + ")VALUES(" + values + ")";
                            sendToDb(queryStr);
                        }
                    }
                })
            });
            rl.on('error', function(err){
                logFile.write(err);
            });
            rl.on('close', () => {
                logFile.write("Table "+table+" Loaded\n");
            });
        }
    });
}

function sendToDb(queryStr){
    //sqlFile.write(queryStr+'\n'); 
    return;
    db.query(queryStr, function (err, data) {
        if (err) logFile.write(err.toString());
    });
}


