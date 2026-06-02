const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// ── User ────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  fullName:        { type: String, required: true },
  email:           { type: String, required: true, unique: true, lowercase: true },
  passwordHash:    { type: String, required: true },
  vehicleNumber:   { type: String, required: true },
  vehicleType:     { type: String, required: true, enum: ['Car', 'SUV', 'Bike'] },
  totalVisits:     { type: Number, default: 0 },
  hoursParked:     { type: Number, default: 0 },
  amountSpent:     { type: Number, default: 0 },
}, { timestamps: true })

userSchema.methods.checkPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

userSchema.statics.hashPassword = (plain) => bcrypt.hash(plain, 10)

const User = mongoose.model('User', userSchema)

// ── Parking Session ─────────────────────────────────────────
const sessionSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  locationId:    String,
  locationName:  String,
  locationArea:  String,
  category:      String,
  slotId:        String,
  vehicleNumber: String,
  vehicleType:   String,
  hourlyRate:    Number,
  entryTime:     { type: Date, default: Date.now },
  exitTime:      Date,
  totalAmount:   Number,
  couponCode:    String,
  paymentMethod: String,
  paidAmount:    Number,
  paidAt:        Date,
  status:        { type: String, enum: ['active', 'pendingPayment', 'paid'], default: 'active' },
}, { timestamps: true })

const Session = mongoose.model('ParkingSession', sessionSchema)

module.exports = { User, Session }
