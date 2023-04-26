module.exports = mongoose => {
  mongoose.set("strictQuery", false);

  var schema = mongoose.Schema(
    {
      name: String,
      mobile: { type: Number, required: true },
      country: String,
      email: {
        type: String,
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, `Please fill valid email address`],
        validate: {
          validator: function () {
            return new Promise((res, rej) => {
              User.findOne({ email: this.email, _id: { $ne: this._id } })
                .then(data => {
                  if (data) {
                    res(false)
                  } else {
                    res(true)
                  }
                })
                .catch(err => {
                  res(false)
                })
            })
          }, message: 'Email Already Taken'
        }
      },
      zipcode: { type: Number, required: true },
      state: String,
      city: String,
      password: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const User = mongoose.model("user", schema);
  return User;
};
