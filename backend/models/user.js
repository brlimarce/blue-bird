/**
 * -- User
 * This serves as the model
 * for the user.
 */
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

// -- Schema
const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

/**
 * -- Methods
 * This contains the needed hooks
 * and custom methods.
 */

// Hashes the password before saving the user.
UserSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password'))
        return next();
    return bcrypt.genSalt((saltError, salt) => {
        if (saltError)
            return next(saltError);
        return bcrypt.hash(user.password, salt, (hashError, hash) => {
            if (hashError)
                return next(hashError);
            user.password = hash;
            return next();
        });
    });
});

// Compares the password using `bcrypt`.
UserSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, callback);
}

// -- Model
const User = mongoose.model('User', UserSchema);
export default User;