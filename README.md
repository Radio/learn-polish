# Learn Polish

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

Helps you learning commonly used phrases and structures in Polish.

## Fetching tokens from Google Sheets

You will need a credentials file stored at `var/etc/google-api-credentials.json`.

Obtain the credentials file here:
https://console.developers.google.com/projectselector/apis/dashboard

Then run:

```
npm run fetch-tokens
```

It might prompt for an authorization.

In case of any problems with accessing Google API try deleting the access-token file at `var/etc/access-token.json`.
