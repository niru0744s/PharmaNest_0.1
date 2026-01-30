const Doctor = require('../../modules/Doctor');
const Consultation = require('../../modules/Consultation');
const User = require('../../modules/User');
const Prescription = require('../../modules/Prescription');
const { generatePrescriptionPDF } = require('../../utils/pdfGenerator');
const { cloudinary } = require('../../cloudConfig');
const ErrorResponse = require('../../utils/ErrorResponse');

// Get all verified doctors
exports.getDoctors = async (req, res, next) => {
    try {
        let doctors = await Doctor.find({ isVerified: true }).populate('userId', 'firstName lastName email');

        // Filter out doctors whose userId is null (if the user was deleted but doctor record remains)
        doctors = doctors.filter(doc => doc.userId !== null);

        res.status(200).json({
            success: true,
            doctors
        });
    } catch (error) {
        next(error);
    }
};

// Book a consultation
exports.bookConsultation = async (req, res, next) => {
    try {
        const { doctorId, type, scheduledDate, slot, reason } = req.body;
        const userId = req.user._id;

        const consultation = await Consultation.create({
            userId,
            doctorId,
            type,
            scheduledDate,
            slot,
            reason,
            roomName: `room_${userId}_${doctorId}_${Date.now()}`
        });

        res.status(201).json({
            success: true,
            consultation
        });
    } catch (error) {
        next(error);
    }
};

// Get user's consultations (Patient or Doctor)
exports.getUserConsultations = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Find if user is also a doctor
        const doctorProfile = await Doctor.findOne({ userId });

        let query = { userId };
        if (doctorProfile) {
            query = { $or: [{ userId }, { doctorId: doctorProfile._id }] };
        }

        const consultations = await Consultation.find(query)
            .populate({
                path: 'doctorId',
                populate: { path: 'userId', select: 'firstName lastName email' }
            })
            .populate('userId', 'firstName lastName email')
            .sort({ scheduledDate: -1 });

        res.status(200).json({
            success: true,
            consultations
        });
    } catch (error) {
        next(error);
    }
};

// Update consultation status (for doctors/admin)
exports.updateConsultationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const consultation = await Consultation.findByIdAndUpdate(id, { status }, { new: true });

        if (!consultation) {
            return next(new ErrorResponse('Consultation not found', 404));
        }

        res.status(200).json({
            success: true,
            consultation
        });
    } catch (error) {
        next(error);
    }
};

// Create prescription for a consultation
exports.createPrescription = async (req, res, next) => {
    try {
        const { diagnosis, medicines, advice, followUpDate } = req.body;
        const consultationId = req.params.id;

        const consultation = await Consultation.findById(consultationId)
            .populate('userId')
            .populate({
                path: 'doctorId',
                populate: { path: 'userId' }
            });

        if (!consultation) {
            return next(new ErrorResponse('Consultation not found', 404));
        }

        // Generate PDF
        const pdfBuffer = await generatePrescriptionPDF(
            { diagnosis, medicines, advice },
            consultation.doctorId,
            consultation.userId
        );

        // Upload to Cloudinary
        const uploadResponse = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'PharmaNest_Prescriptions',
                    resource_type: 'raw',
                    public_id: `prescription_${consultationId}`,
                    format: 'pdf'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(pdfBuffer);
        });

        const prescription = await Prescription.create({
            consultationId,
            patientId: consultation.userId._id,
            doctorId: consultation.doctorId._id,
            diagnosis,
            medicines,
            advice,
            followUpDate,
            pdfUrl: {
                url: uploadResponse.secure_url,
                public_id: uploadResponse.public_id
            }
        });

        // Mark consultation as completed
        consultation.status = 'completed';
        await consultation.save();

        res.status(201).json({
            success: true,
            prescription
        });
    } catch (error) {
        next(error);
    }
};

// Add review for a doctor
exports.addDoctorReview = async (req, res, next) => {
    try {
        const { doctorId, rating, comment } = req.body;
        const userId = req.user._id;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return next(new ErrorResponse('Doctor not found', 404));
        }

        // Simpler review system for now, updating doctor stats
        const totalRating = (doctor.rating * doctor.reviewsCount) + rating;
        doctor.reviewsCount += 1;
        doctor.rating = (totalRating / doctor.reviewsCount).toFixed(1);

        await doctor.save();

        res.status(200).json({
            success: true,
            message: 'Feedback submitted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Register as a doctor
exports.registerDoctor = async (req, res, next) => {
    try {
        const { specialization, experience, licenseNumber, consultationFees, bio, availability } = req.body;
        const userId = req.user._id;

        const existingDoctor = await Doctor.findOne({ userId });
        if (existingDoctor) {
            return next(new ErrorResponse('You are already registered as a doctor', 400));
        }

        const doctor = await Doctor.create({
            userId,
            specialization,
            experience,
            licenseNumber,
            consultationFees,
            bio,
            availability: availability || [],
            isVerified: true
        });

        // Update user role to 'doctor'
        await User.findByIdAndUpdate(userId, { role: 'doctor' });

        res.status(201).json({
            success: true,
            message: 'Doctor registration successful',
            doctor
        });
    } catch (error) {
        next(error);
    }
};

// Instant "Consult Now" Booking
exports.instantBooking = async (req, res, next) => {
    try {
        const { doctorId, type, reason } = req.body;
        const userId = req.user._id;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return next(new ErrorResponse('Doctor not found', 404));
        }

        if (!doctor.isOnline) {
            return next(new ErrorResponse('Doctor is currently offline', 400));
        }

        const consultation = await Consultation.create({
            userId,
            doctorId,
            type: type || 'chat',
            scheduledDate: new Date(),
            status: 'ongoing',
            reason: reason || 'Instant Consultation',
            roomName: `room_${userId}_${doctorId}_${Date.now()}`
        });

        // Notify doctor via Socket.io using their userId room
        const { getIO } = require('../../utils/socket');
        const io = getIO();

        io.to(doctor.userId.toString()).emit('new_instant_consultation', {
            consultationId: consultation._id,
            roomName: consultation.roomName,
            patientName: `${req.user.firstName} ${req.user.lastName}`,
            type: consultation.type
        });

        res.status(201).json({
            success: true,
            consultation
        });
    } catch (error) {
        next(error);
    }
};
