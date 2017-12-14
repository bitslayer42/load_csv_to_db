# load_csv_to_db

Node.js script to read tab delimited files into SQL server.
Run from command line as _node loaddata_.
Add db credentials to config.json based on configExample.json.

Filenames must match tablenames, plus a csv extension. 
First row of file is column names.

Place csv files into *imports* subfolder.
Temporary sql files are written to *sqls* subfolder.

Data in files can't have newlines or tabs in fields.
