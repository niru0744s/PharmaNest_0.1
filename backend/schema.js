const joi = require('joi');

// Password validation schema
const passwordSchema = joi.string()
        .min(8)
        .max(128)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
        .required()
        .messages({
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
                'string.min': 'Password must be at least 8 characters long',
                'string.max': 'Password must not exceed 128 characters'
        });

module.exports.emailSent = joi.object({
        email: joi.string().email().required(),
});

module.exports.otpVerify = joi.object({
        otp: joi.string().required(),
        id: joi.string().required()
});

module.exports.userCredentials = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        phoneNumber: joi.number().required(),
        pass: passwordSchema
});

module.exports.hostCredentials = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        pass: passwordSchema
});

module.exports.loginSchema = joi.object({
        email: joi.string().required(),
        password: joi.string().required()
});

module.exports.products = joi.object({
        name: joi.string().required(),
        brand: joi.string().required(),
        form: joi.string().required(),
        strength: joi.string().required(),
        category: joi.string().valid(
                "Medicine",
                "OTC_Medicine",
                "First_Aid",
                "Hygiene",
                "Baby_product",
                "Supplements",
                "Test_kits"
        ).required(),
        mainPrice: joi.number().required(),
        price: joi.number().required(),
        description: joi.string().required(),
        imageUrl: joi.string().allow("", null),
        quantity: joi.number().required(),
        composition: joi.string().allow("", null),
        benefits: joi.array().items(joi.string()).allow(null),
        usage: joi.string().allow("", null),
        sideEffects: joi.string().allow("", null),
        precautions: joi.string().allow("", null),
        storage: joi.string().allow("", null),
        manufacturer: joi.string().allow("", null),
});

module.exports.location = joi.object({
        name: joi.string().required(),
        mobileNum: joi.number().required(),
        pincode: joi.number().required(),
        address: joi.string().required(),
});

module.exports.registerSchema = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().email().required(),
        phoneNumber: joi.string().required(),
        password: passwordSchema,
        role: joi.string().valid('user', 'host').required()
});