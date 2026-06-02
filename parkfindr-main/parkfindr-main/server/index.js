require('dotenv').config()
const express  = require('express')
const mongoose = require('mongoose')
const cors     = require('cors')
const { User, Session } = require('./models')

const app  = express()
const PORT = process.env.PORT || 3001
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/parkfindr'

// ── Middleware ───────────────────────────────────────────────
app.use(cors())
app.use(express.json())

// ── DB connect ───────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected →', MONGO_URI))
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1) })

// ── Simple auth helper (no JWT needed for local demo) ────────
// We just send userId back and the client stores it in localStorage
// (For a real production app you'd use JWT tokens)

// ── Auth Routes ──────────────────────────────────────────────

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, password, vehicleNumber, vehicleType } = req.body
    if (!fullName || !email || !password || !vehicleNumber || !vehicleType) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) return res.status(409).json({ error: 'Email already registered. Please log in.' })

    const passwordHash = await User.hashPassword(password)
    const user = await User.create({ fullName, email, vehicleNumber, vehicleType, passwordHash })
    const profile = toProfile(user)
    res.status(201).json({ userId: user._id, profile })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(401).json({ error: 'No account found for this email. Please sign up.' })
    const ok = await user.checkPassword(password)
    if (!ok) return res.status(401).json({ error: 'Incorrect password.' })
    res.json({ userId: user._id, profile: toProfile(user) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/auth/profile/:userId
app.get('/api/auth/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(toProfile(user))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/auth/profile/:userId
app.patch('/api/auth/profile/:userId', async (req, res) => {
  try {
    const allowed = ['totalVisits', 'hoursParked', 'amountSpent', 'vehicleNumber', 'vehicleType', 'fullName']
    const updates = {}
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k] })
    const user = await User.findByIdAndUpdate(req.params.userId, updates, { new: true })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(toProfile(user))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Parking Session Routes ────────────────────────────────────

// POST /api/sessions  — start parking
app.post('/api/sessions', async (req, res) => {
  try {
    const { userId, locationId, locationName, locationArea, category,
            slotId, vehicleNumber, vehicleType, hourlyRate } = req.body
    const session = await Session.create({
      userId, locationId, locationName, locationArea, category,
      slotId, vehicleNumber, vehicleType, hourlyRate,
      entryTime: new Date(), status: 'active',
    })
    res.status(201).json(toSession(session))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/sessions/active/:userId  — get active session
app.get('/api/sessions/active/:userId', async (req, res) => {
  try {
    const session = await Session.findOne({ userId: req.params.userId, status: 'active' })
    res.json(session ? toSession(session) : null)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/sessions/history/:userId  — get paid sessions
app.get('/api/sessions/history/:userId', async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.params.userId, status: 'paid' })
                                  .sort({ exitTime: -1 })
    res.json(sessions.map(toSession))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/sessions/:id/end  — end parking (calc cost)
app.patch('/api/sessions/:id/end', async (req, res) => {
  try {
    const { couponCode } = req.body
    const session = await Session.findById(req.params.id)
    if (!session) return res.status(404).json({ error: 'Session not found' })

    const exitTime = new Date()
    const hours = (exitTime - session.entryTime) / 3600000
    const totalAmount = Math.max(Math.ceil(hours * session.hourlyRate), session.hourlyRate / 4) // min 15-min charge

    await session.updateOne({ exitTime, totalAmount, couponCode: couponCode || null, status: 'pendingPayment' })
    res.json({ ...toSession(session), exitTime, totalAmount, couponCode, status: 'pendingPayment' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/sessions/:id/pay  — complete payment
app.patch('/api/sessions/:id/pay', async (req, res) => {
  try {
    const { paymentMethod, paidAmount, userId } = req.body
    const paidAt = new Date()
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { paymentMethod, paidAmount, paidAt, status: 'paid', paymentStatus: 'paid' },
      { new: true }
    )
    if (!session) return res.status(404).json({ error: 'Session not found' })

    // Update user stats
    const user = await User.findById(userId)
    if (user) {
      const hours = (session.exitTime - session.entryTime) / 3600000
      await user.updateOne({
        $inc: { totalVisits: 1, hoursParked: hours, amountSpent: paidAmount }
      })
    }
    res.json(toSession(session))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/sessions/occupied/:locationId  — which slots are taken
app.get('/api/sessions/occupied/:locationId', async (req, res) => {
  try {
    const sessions = await Session.find({ locationId: req.params.locationId, status: 'active' }, 'slotId')
    res.json(sessions.map(s => s.slotId))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }))

// ── Helpers ──────────────────────────────────────────────────
function toProfile(u) {
  return {
    uid: u._id.toString(),
    fullName: u.fullName,
    email: u.email,
    vehicleNumber: u.vehicleNumber,
    vehicleType: u.vehicleType,
    totalVisits: u.totalVisits,
    hoursParked: u.hoursParked,
    amountSpent: u.amountSpent,
  }
}

function toSession(s) {
  return {
    id: s._id.toString(),
    userId: s.userId.toString(),
    locationId: s.locationId,
    locationName: s.locationName,
    locationArea: s.locationArea,
    category: s.category,
    slotId: s.slotId,
    vehicleNumber: s.vehicleNumber,
    vehicleType: s.vehicleType,
    hourlyRate: s.hourlyRate,
    entryTime: s.entryTime?.toISOString(),
    exitTime: s.exitTime?.toISOString(),
    totalAmount: s.totalAmount,
    couponCode: s.couponCode,
    paymentMethod: s.paymentMethod,
    paidAmount: s.paidAmount,
    status: s.status,
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ParkFindr API running on http://0.0.0.0:${PORT}`)
  console.log(`   From phone on same WiFi: http://<YOUR_LAPTOP_IP>:${PORT}`)
})
