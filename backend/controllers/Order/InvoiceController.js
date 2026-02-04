const PDFDocument = require('pdfkit');
const Orders = require('../../modules/orders');
const fs = require('fs');

module.exports.generateInvoice = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Fetch Order Details
        const order = await Orders.findOne({ _id: orderId, user: req.user._id })
            .populate('products.product', 'name price')
            .populate('address', 'name mobileNum address pincode')
            .populate('user', 'firstName lastName email')
            .lean();

        if (!order) {
            return res.status(404).send({
                success: 0,
                message: 'Order not found'
            });
        }

        // Create PDF Document
        const doc = new PDFDocument({ margin: 50 });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);

        doc.pipe(res);

        // --- PDF Content ---

        // 1. Header
        doc.fontSize(20).text('PharmaNest', { align: 'left' })
            .fontSize(10).text('Your Trusted Pharmacy', { align: 'left' })
            .moveDown();

        doc.fontSize(20).text('INVOICE', { align: 'right' });
        doc.fontSize(10).text(`Invoice Number: ${order._id}`, { align: 'right' });
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: 'right' });
        doc.moveDown();

        // 2. Billing Details
        doc.text(`Bill To:`, { bold: true });
        doc.text(order.address.name);
        doc.text(order.address.address);
        doc.text(`Pincode: ${order.address.pincode}`);
        doc.text(`Phone: ${order.address.mobileNum}`);
        doc.moveDown();

        // 3. Table Header
        const tableTop = 250;
        const itemX = 50;
        const qtyX = 300;
        const priceX = 370;
        const totalX = 450;

        doc.font('Helvetica-Bold');
        doc.text('Item', itemX, tableTop);
        doc.text('Quantity', qtyX, tableTop);
        doc.text('Price', priceX, tableTop);
        doc.text('Total', totalX, tableTop);
        doc.moveTo(itemX, tableTop + 15).lineTo(totalX + 50, tableTop + 15).stroke();

        // 4. Table Rows
        let y = tableTop + 25;
        doc.font('Helvetica');

        order.products.forEach(item => {
            const unitPrice = item.product?.price || 0;
            const productTotal = unitPrice * item.quantity;
            const itemName = item.name || item.product?.name || "Unknown Product";

            doc.text(itemName.substring(0, 35) + (itemName.length > 35 ? '...' : ''), itemX, y);
            doc.text(item.quantity.toString(), qtyX, y);
            doc.text(`Rs. ${unitPrice}`, priceX, y);
            doc.text(`Rs. ${productTotal}`, totalX, y);

            y += 20;
        });

        // 5. Totals
        doc.moveTo(itemX, y).lineTo(totalX + 50, y).stroke();
        y += 15;

        doc.font('Helvetica-Bold');
        doc.text(`Total Amount: Rs. ${order.totalAmount}`, totalX - 50, y, { align: 'right' });

        // 6. Footer
        doc.fontSize(10).text('Thank you for shopping with PharmaNest!', 50, 700, { align: 'center', width: 500 });


        doc.end();

    } catch (error) {
        console.error('Generate invoice error:', error);
        if (!res.headersSent) {
            res.status(500).send({
                success: 0,
                message: 'Failed to generate invoice'
            });
        }
    }
};
