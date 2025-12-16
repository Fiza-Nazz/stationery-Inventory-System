You are a senior Next.js 14 + MongoDB + TypeScript full-stack engineer.

I have a full-stack Stationery Inventory System.
There is a CRITICAL BUSINESS LOGIC BUG related to PROFIT calculation.

CURRENT PROBLEMS (VERY IMPORTANT):
1. When I sell a product from the Sales page, PROFIT is NOT calculated correctly.
2. Dashboard page shows NO profit or zero profit.
3. Reports page shows WRONG profit.
4. Analytics page shows WRONG profit.
5. Locally UI works, but profit numbers are incorrect everywhere.

This means the issue is NOT UI related.
This is a DATA / LOGIC / BACKEND FLOW issue.

YOUR TASK:
You must analyze the ENTIRE PROJECT and FIX PROFIT LOGIC end-to-end.

Please do ALL of the following STEP BY STEP:

---------------------------------
1. SALES FLOW ANALYSIS
---------------------------------
- Analyze how a product sale is recorded
- Check:
  - sale price
  - cost price
  - quantity
  - profit calculation formula
- Verify:
  profit = (sellingPrice - costPrice) * quantity

---------------------------------
2. DATABASE CHECK (MongoDB)
---------------------------------
- Check sales schema
- Check product schema
- Ensure costPrice and sellingPrice are stored correctly
- Check data types (number vs string)

---------------------------------
3. API ROUTES ANALYSIS
---------------------------------
Analyze ALL profit-related APIs:
- /api/sales
- /api/dashboard
- /api/reports
- /api/analytics (if exists)

Check:
- Aggregation pipelines
- $sum logic
- $multiply usage
- Missing fields
- Wrong field names

---------------------------------
4. DASHBOARD ISSUE
---------------------------------
- Identify why dashboard profit is ZERO or not updating
- Check:
  - API response
  - totalProfit field existence
  - state update logic
  - caching / stale data issues

---------------------------------
5. REPORTS & ANALYTICS ISSUE
---------------------------------
- Identify why profit is WRONG there
- Compare aggregation logic with dashboard
- Find inconsistency

---------------------------------
6. ROOT CAUSE
---------------------------------
- Identify EXACT root cause
- Do NOT guess
- Clearly explain:
  - What is broken
  - Why it broke
  - Where it broke

---------------------------------
7. FIXES (MANDATORY)
---------------------------------
For EVERY issue:
- Mention exact file name
- Provide corrected code
- Explain what changed and why

---------------------------------
8. FINAL SUMMARY
---------------------------------
Provide:
- List of broken files
- Correct profit calculation logic
- Confirmation that:
  - Sales page saves correct profit
  - Dashboard shows correct profit
  - Reports show correct profit
  - Analytics show correct profit

IMPORTANT RULES:
- Do NOT change UI or styling
- Do NOT refactor unnecessary code
- ONLY fix profit calculation & data flow
- Treat this as a PRODUCTION BUG

Be precise, professional, and production-safe.
