
let db = require('odbc')();
const fs = require('fs');
const { fileBasePath, connectionString } = require('./config.json');
const folders = ['subfolder'];
let logFile;
let logFileNm = __dirname + '/logfiles/logfile.txt';
let chokidar = require('chokidar'); // https://github.com/paulmillr/chokidar

console.log('Running...');

//If data in logfile, save it.
if(fs.existsSync(logFileNm)){
    const stats = fs.statSync(logFileNm);
    if(stats.size > 0){
        let nowStr = Date.now();
        let newLogFileName = __dirname + '/logfiles/logfile' + nowStr + '.txt';
        fs.rename(logFileNm,newLogFileName,function (err) {
            if (err) throw err;
            proceed();
        });
    }else{proceed();}
}else{proceed();}    

function proceed(){
    logFile = fs.createWriteStream(logFileNm);
    db.open(connectionString, function (err) {
        if (err) return logit(err.toString());

        //watching for files in five folders
        folders.forEach((folder)=>{
            let watchPath = fileBasePath+'/'+folder+'/'+'*.pdf';
            let watcher = chokidar.watch( watchPath, {
            ignored: /[\/\\]\./, 
            persistent: false,
            cwd: fileBasePath,
            })
            //Run watcher...
            .on('add', lookInTable);
        });
    });
}


function logit(...args){
    console.log(args.join(' '));
    logFile.write(args.join(' ')+'\n');
}

function lookInTable(path){  //watched returns path to look like 'Checklist\BGA53840.pdf' because I set cwd option
    //logit('Looking at file:',path);
    const [Dir,Vin8] = path.replace('.pdf','').split('\\');  

    if(Vin8.length > 8){return}; 
    db.query('lookupPDF ?, ?', [Dir,Vin8], function (err, data) {
        if (err) logit(err.toString());
        //logit('Lookup:',JSON.stringify(data));
        if(data[0]){renameFile(data);}
    });

}

function renameFile(data) {
    let {Stock_Number, Type, Vin8} = data[0];
    if(Stock_Number && Type && Vin8){
        Stock_Number=Stock_Number.trim();
        Type=Type.trim();
        Vin8=Vin8.trim(); 
        const oldFile = fileBasePath+'/'+Type+'/'+Vin8+'.pdf';
        const newFile = fileBasePath+'/'+Type+'/'+Stock_Number+'.pdf';
                                //logit('Would rename '+Type+'\\'+Vin8+'.pdf to '+Stock_Number+'.pdf');return;//////////////////////
        fs.rename(oldFile, newFile, function (err) {
            if (err) {logit(err); throw err;}
            if (Vin8==Stock_Number){
                logit('Linked '+Type+'\\'+Vin8+'.pdf');
            }else{
                logit('Renamed '+Type+'\\'+Vin8+'.pdf to '+Stock_Number+'.pdf');
            }
            updateTable(Type, Stock_Number, newFile);
        });        
    }
}

function updateTable(Type, Stock_Number, newFile) {
    newFile = newFile.replace(/\//g,'\\');
    db.query('updatePDF ?, ?, ?', [Type,Stock_Number,newFile], function (err, data) {
        if (err) logit(err.toString());
        //logit('updatePDF called:'+Type+':'+Stock_Number+':'+newFile+':');
    });

}

