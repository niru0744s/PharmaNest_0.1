const express = require('express');
const router = express.Router();
const {
    getDoctors,
    bookConsultation,
    instantBooking,
    getUserConsultations,
    updateConsultationStatus,
    createPrescription,
    addDoctorReview,
    registerDoctor
} = require('../controllers/Consultation/consultationController');
const { userMiddleware } = require('../middleware/tokenVerify');

router.get('/doctors', getDoctors);
router.post('/register-doctor', userMiddleware, registerDoctor);
router.post('/book', userMiddleware, bookConsultation);
router.post('/instant', userMiddleware, instantBooking);
router.get('/my-consultations', userMiddleware, getUserConsultations);
router.patch('/:id/status', userMiddleware, updateConsultationStatus);
router.post('/:id/prescription', userMiddleware, createPrescription);
router.post('/review', userMiddleware, addDoctorReview);

module.exports = router;
