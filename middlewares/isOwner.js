const isOwner = (Model, ownerField = 'createdBy', idParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params[idParam]);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });

      if (resource[ownerField].toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = isOwner;
