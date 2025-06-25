// pages/api/enrollments/[id]/status.js
import connectToDatabase from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const { id: courseId } = req.query;

    const existing = await Enrollment.findOne({
      userId: user._id,
      courseId: courseId
    });

    res.status(200).json({
      enrolled: !!existing,
      enrollmentId: existing?._id || null
    });
  } catch (error) {
    console.error('Enrollment status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
