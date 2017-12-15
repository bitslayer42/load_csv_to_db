# load_csv_to_db

Node.js script to read tab delimited files into SQL server.
Runs multiple files concurrently, so has a big speed up on multicore servers.

To use, 
1. Install Node from nodejs.org.
2. Add db credentials to a new file config.json based on configExample.json.
3. Place csv files into *imports* subfolder. Temporary sql files are written to *sqls* subfolder.
4. Run from command line as _node loaddata_.

Filenames must match tablenames, plus a csv extension. 
First row of file is column names.

Data in files can't have newlines or tabs in fields.
Error messages will come up if files don't match, with helpful hints about where the discrepancies are.
