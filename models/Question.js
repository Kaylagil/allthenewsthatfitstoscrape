// requiring mongoose
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// create a new UserSchema object
var QuestionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// creates our model from the above schema
var Question = mongoose.model("Question", QuestionSchema);

// Export the Question model
module.exports = Question;
