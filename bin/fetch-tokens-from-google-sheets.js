const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const async = require('async');

// If modifying these scopes, delete credentials.json.
const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/drive.metadata.readonly'
];
const ACCESS_TOKEN_PATH = 'var/etc/access-token.json';
const CREDENTIALS_PATH = 'var/etc/google-api-credentials.json';
const TOKENS_OUTPUT_PATH = 'var/cache/tokens-from-google-sheets.json';
const TOKENS_DRIVE_FOLDER_ID = '13ndkmbwzugijR2NY5QM_J8TSUou_rnYP';

if (!fs.existsSync('var')) {
  fs.mkdirSync('var');
}

if (!fs.existsSync('var/etc')) {
  fs.mkdirSync('var/etc');
}

if (!fs.existsSync('var/cache')) {
  fs.mkdirSync('var/cache');
}

// Load client secrets from a local file.
fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), readAndStoreTokens);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize (credentials, callback) {
  const oAuth2Client = new google.auth.OAuth2(
    credentials.installed.client_id,
    credentials.installed.client_secret,
    credentials.installed.redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(ACCESS_TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken (oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.mkdir()
      fs.writeFile(ACCESS_TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Access Token stored to', ACCESS_TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listTokenFiles (auth, callback) {
  const drive = google.drive({version: 'v3', auth});
  const query = [
    'trashed = false',
    'mimeType = "application/vnd.google-apps.spreadsheet"',
    `"${TOKENS_DRIVE_FOLDER_ID}" in parents`
  ];
  drive.files.list({
    pageSize: 10,
    q: query.join(' and '),
    fields: 'nextPageToken, files(id, name)'
  }, (err, res) => {
    if (err) {
      return callback(new Error('The API returned an error: ' + err));
    }

    const files = res.data.files;
    if (!files.length) {
      return callback(new Error(`No files found. Folder ID: ${TOKENS_DRIVE_FOLDER_ID}`));
    }

    callback(null, files);
  });
}

/**
 * Read the tokens form all files in Tokens directory. Merge then and write to a compiled file.
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function readAndStoreTokens (auth) {
  const sheets = google.sheets({version: 'v4', auth});

  let curriedReadTokensFromSingleFile = (sheets, file) =>
    callback =>
      readTokensFromSingleFile(sheets, file, callback);

  listTokenFiles(auth, (err, files) => {
    if (err) {
      return console.error(err);
    }

    async.parallel(
      files.map(file => curriedReadTokensFromSingleFile(sheets, file)),
      (err, results) => {
        if (err) {
          return console.error(err);
        }

        writeTokens(TOKENS_OUTPUT_PATH, [].concat(...results), (err) => {
          if (err) {
            return console.error(err);
          }

          console.log('Tokens stored to', TOKENS_OUTPUT_PATH);
        });
      });
  });
}

function readTokensFromSingleFile (sheets, file, callback) {
  console.log(`Reading tokens from ${file.name}...`);
  sheets.spreadsheets.values.get({
    spreadsheetId: file.id,
    range: 'A1:K'
  }, (err, res) => {
    if (err) {
      callback(new Error('The API returned an error: ' + err));
      return;
    }

    const rows = res.data.values;
    if (!rows.length) {
      callback(null, []);
    }

    const headers = rows.shift();
    const tokens = rows.filter(row => row.length).map(row => {
      return headers.reduce((rowData, property, index) => {
        if (typeof row[index] !== 'undefined') {
          rowData[property] = row[index];
        }
        return rowData;
      }, {});
    });

    callback(null, tokens);
  });
}

/**
 * Write tokens to a json file.
 * @param {Array} tokens
 */
function writeTokens (path, tokens, callback) {
  fs.writeFile(path, JSON.stringify(tokens), callback);
}
