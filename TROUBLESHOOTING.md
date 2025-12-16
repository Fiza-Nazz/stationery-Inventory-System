# Troubleshooting Common Issues

## MongoDB Connection Errors

### 1. IP Address Not Whitelisted

**Error Message:**
`MongoNetworkError: connect ECONNREFUSED ...` followed by a message like `It is likely that you are trying to access the database from an IP that isn't whitelisted.`

**Cause:**
Your application's IP address is not authorized to connect to your MongoDB Atlas cluster. Atlas uses an IP access list as a security measure.

**Solution:**
You need to add your IP address to the whitelist in your MongoDB Atlas project settings.

1.  **Log in to MongoDB Atlas.**
2.  Navigate to the **Network Access** section in the left-hand sidebar (under the "Security" category).
3.  Click the **Add IP Address** button.
4.  **Option A (Recommended for Development):** Click **Add Current IP Address**. Atlas will auto-fill your current IP. Add a description (e.g., "Home Office") and click **Confirm**.
5.  **Option B (For temporary debugging, less secure):** Enter `0.0.0.0/0` into the "Access List Entry" field. This allows access from any IP address.
6.  Wait a few minutes for the cluster to update with the new network rules.
7.  Restart your application.

### 2. MongoParseError (Legacy Options)

**Error Message:**
`MongoParseError: options usenewurlparser, useunifiedtopology are not supported`

**Cause:**
This happens with newer versions of the Mongoose library (`v6.x` and above) which have deprecated old connection options.

**Solution:**
The database connection logic in `lib/db.ts` should not include `useNewUrlParser` or `useUnifiedTopology` in the `mongoose.connect()` options. The current code in this project has already been updated to handle this correctly. If you see this error, ensure you are using the latest version of the code from this repository.
