Hi Gemini, I need your help as a Next.js full-stack expert. I have a Next.js 14 project and want you to **analyze every file** in the project to detect potential production build errors.

Specifically, please do the following:

1. **Check all page.tsx and route.ts files**: Ensure no page.tsx file is being imported directly anywhere. Next.js 14 does not allow importing page.tsx files.
2. **Check all imports**: Identify any incorrect or invalid imports that might break production build (like importing page.tsx, wrong paths, or missing modules).
3. **Check environment variables usage**: Ensure all sensitive variables like MONGODB_URI are correctly referenced using `process.env` and are not hardcoded.
4. **Check MongoDB connection code**: Ensure the connection string format is correct (`mongodb://` or `mongodb+srv://`) and matches the environment variables.
5. **Check all API routes**: Identify any potential runtime errors, aggregation errors, or schema mismatches.
6. **Check for TypeScript errors**: Highlight any TS errors that will cause the build to fail in production.
7. **Check lib/ and models/**: Ensure all utility and model files are properly exported and can be imported safely.
8. **Provide actionable recommendations**: For every detected issue, suggest how to fix it step by step.

After analysis, give a **summary of all issues** that would prevent production deployment and exact fixes for each.

Please analyze the **entire project directory**, including app/, lib/, models/, and any other custom folders.
