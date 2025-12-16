import mongoose from "mongoose";
import connectDB from "../db";
import Sale from "../../models/Sales";
import Product from "../../models/Product";

async function recalculateProfit() {
  await connectDB();
  console.log("Starting profit recalculation for all sales...");

  try {
    const sales = await Sale.find({});
    let updatedCount = 0;

    for (const sale of sales) {
      let currentTotalProfit = 0;
      let hasProductMissing = false;

      const updatedItems = await Promise.all(sale.items.map(async (item: any) => {
        const product = await Product.findById(item.productId);
        let itemProfit = 0;

        if (product && typeof product.costPrice === 'number' && product.costPrice >= 0) {
          itemProfit = (item.price - product.costPrice) * item.quantity;
        } else {
          // If product or its costPrice is invalid/missing, we cannot accurately recalculate.
          // Log it and keep original item profit if it exists, or 0.
          console.warn(`Product ID ${item.productId} for Sale ID ${sale._id} has missing or invalid costPrice. Cannot recalculate item profit accurately.`);
          itemProfit = item.profit || 0; // Fallback to original profit or 0
          hasProductMissing = true;
        }
        currentTotalProfit += itemProfit;
        return { ...item, profit: itemProfit }; // Ensure item also stores its profit
      }));
      
      // Update the sale document with the new total profit
      // Only update if currentTotalProfit is different from stored totalProfit, 
      // or if there were missing products which might indicate data needing re-check.
      if (sale.totalProfit !== currentTotalProfit || hasProductMissing) {
        sale.totalProfit = currentTotalProfit;
        // Optionally, update the items array if you want to store item-level profit permanently
        sale.items = updatedItems; 
        await sale.save();
        updatedCount++;
        console.log(`Updated Sale ID: ${sale._id} with new totalProfit: ${currentTotalProfit}`);
      }
    }
    console.log(`Profit recalculation complete. Total sales updated: ${updatedCount}`);
  } catch (error) {
    console.error("Error during profit recalculation:", error);
  } finally {
    mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

recalculateProfit();
