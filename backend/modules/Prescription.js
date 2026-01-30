const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    consultationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultation',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    medicines: [{
        name: String,
        dosage: String, // e.g., "1-0-1"
        duration: String, // e.g., "5 days"
        instructions: String // e.g., "After food"
    }],
    advice: String,
    followUpDate: Date,
    pdfUrl: {
        url: String,
        public_id: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
