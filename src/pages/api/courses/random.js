
import connectToDatabase from '../../../lib/mongodb';
import Course from '../../../models/Course';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    await connectToDatabase();

    const randomCourses = await Course.aggregate([{ $sample: { size: 3 } }]);

    return res.status(200).json({ success: true, data: randomCourses });
  } catch (error) {
    console.error('Error fetching random courses:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch random courses' });
  }
}
