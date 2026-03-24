const PDFDocument = require('pdfkit');

const generatePrescriptionPDF = (prescription, doctorData, patientData) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        // Header
        doc.fillColor('#2563eb').fontSize(25).text('PharmaNest', { align: 'center' });
        doc.fillColor('#64748b').fontSize(10).text('Digital Healthcare Simplified', { align: 'center' });
        doc.moveDown();

        // Doctor Info
        doc.fillColor('#0f172a').fontSize(12).text(`Dr. ${doctorData.userId.firstName} ${doctorData.userId.lastName}`, { align: 'right' });
        doc.fontSize(10).text(doctorData.specialization, { align: 'right' });
        doc.text(`Reg No: ${doctorData.licenseNumber || 'N/A'}`, { align: 'right' });
        doc.moveDown();

        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#e2e8f0');
        doc.moveDown();

        // Patient Info
        doc.fillColor('#0f172a').fontSize(12).text(`Patient Name: ${patientData.firstName} ${patientData.lastName}`);
        doc.fontSize(10).text(`Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown();

        // Diagnosis
        doc.fillColor('#2563eb').fontSize(14).text('DIAGNOSIS');
        doc.fillColor('#0f172a').fontSize(12).text(prescription.diagnosis);
        doc.moveDown();

        // Medicines Table
        doc.fillColor('#2563eb').fontSize(14).text('PRESCRIPTION (Rx)');
        doc.moveDown(0.5);

        prescription.medicines.forEach((med, index) => {
            doc.fillColor('#0f172a').fontSize(11).text(`${index + 1}. ${med.name}`);
            doc.fillColor('#64748b').fontSize(9).text(`   Dosage: ${med.dosage} | Duration: ${med.duration}`);
            if (med.instructions) {
                doc.text(`   Instructions: ${med.instructions}`);
            }
            doc.moveDown(0.5);
        });

        doc.moveDown();

        // Advice
        if (prescription.advice) {
            doc.fillColor('#2563eb').fontSize(14).text('ADVICE');
            doc.fillColor('#0f172a').fontSize(11).text(prescription.advice);
            doc.moveDown();
        }

        // Footer
        const bottom = Math.max(doc.y + 20, 730);
        doc.moveTo(50, bottom).lineTo(550, bottom).stroke('#e2e8f0');
        doc.fillColor('#64748b').fontSize(8).text(
            'This is a digitally generated prescription and does not require a physical signature.',
            50,
            bottom + 10,
            { align: 'center' }
        );

        doc.end();
    });
};

module.exports = { generatePrescriptionPDF };
