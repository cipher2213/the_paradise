import Visitor from '../models/visitor.js';

export const trackVisitor = async (req, res, next) => {
  try {
    // Avoid counting admin or API routes
    if (req.path.startsWith('/api/admin')) return next();

    console.log('Visitor middleware called for:', req.path); // Debug log

    // Get the only visitor document (or create it)
    let visitorData = await Visitor.findOne();
    if (!visitorData) {
      visitorData = await Visitor.create({ count: 1 });
      console.log('Visitor document created'); // Debug log
    } else {
      visitorData.count += 1;
      await visitorData.save();
      console.log('Visitor count incremented:', visitorData.count); // Debug log
    }
  } catch (error) {
    console.error('Visitor tracking error:', error);
  }
  next();
};
