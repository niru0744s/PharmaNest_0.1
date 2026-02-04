const cron = require('node-cron');
const Product = require('../modules/Products');
const Host = require('../modules/Host');
const { sendEmail } = require('../utils/emailService');

const runInventoryCheck = async () => {
    try {
        console.log('--- Starting Inventory Monitoring Job ---');

        // Find all products that are low or out of stock
        // We'll use the threshold defined in the document
        const lowStockProducts = await Product.find({
            $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
        }).populate('hostId', 'email firstName lastName');

        if (lowStockProducts.length === 0) {
            console.log('No products currently below threshold.');
            return;
        }

        // Group products by Host
        const hostGroups = lowStockProducts.reduce((acc, product) => {
            const hostId = product.hostId._id.toString();
            if (!acc[hostId]) {
                acc[hostId] = {
                    email: product.hostId.email,
                    name: product.hostId.firstName,
                    products: []
                };
            }
            acc[hostId].products.push(product);
            return acc;
        }, {});

        // Send emails to each host
        for (const hostId in hostGroups) {
            const group = hostGroups[hostId];

            const productListHtml = group.products.map(p => `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px;">${p.name}</td>
                    <td style="padding: 10px; color: ${p.quantity === 0 ? 'red' : 'orange'};">
                        ${p.quantity === 0 ? 'Out of Stock' : p.quantity}
                    </td>
                    <td style="padding: 10px;">${p.sku || 'N/A'}</td>
                </tr>
            `).join('');

            const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #2563eb; text-align: center;">PharmaNest Inventory Alert</h2>
                    <p>Hi ${group.name},</p>
                    <p>The following products in your inventory are running low or out of stock. Please restock them to avoid shipment delays.</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <thead>
                            <tr style="background-color: #f8fafc; text-align: left;">
                                <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Product</th>
                                <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Quantity</th>
                                <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">SKU</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productListHtml}
                        </tbody>
                    </table>
                    
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="${process.env.FRONTEND_URL}/host/inventory" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Update Inventory</a>
                    </div>
                </div>
            `;

            await sendEmail({
                to: group.email,
                subject: '⚠️ Low Stock Alert: PhamaNest Inventory Item(s)',
                html: emailHtml
            });
            console.log(`Sent low stock alert to host: ${group.email} (${group.products.length} items)`);
        }

        console.log('--- Inventory Monitoring Job Completed ---');
    } catch (error) {
        console.error('Inventory monitoring job error:', error);
    }
};

// Schedule to run daily at midnight
cron.schedule('0 0 * * *', runInventoryCheck);

// Also export for manual triggering if needed
module.exports = { runInventoryCheck };
