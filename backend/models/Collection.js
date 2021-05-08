const mongoose = require('mongoose');

const CollectionSchema = mongoose.Schema({
  type: String,
  name: String,
  public: Boolean,
  owners: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  artists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
    },
  ],
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'itemModel',
    },
  ],
  itemModel: {
    type: String,
    required: true,
    enum: ['Track', 'Album', 'Artist', 'Collection'],
  },
});

module.exports = mongoose.model('Collection', CollectionSchema);
