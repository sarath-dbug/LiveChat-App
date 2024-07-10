// validators.js

function validateFields({ name, email, password, mobile }) {
    if (!name || !email || !password || !mobile) {
        throw { status: 400, message: 'All necessary input fields have not been filled' };
    }

    // Validate mobile number (assuming it should be a 10-digit number)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
        throw { status: 400, message: 'Invalid mobile number format' };
    }

    // Validate password (minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        throw { status: 400, message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character' };
    }
}

module.exports = { validateFields };
