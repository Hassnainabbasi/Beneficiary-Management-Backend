import mongoose from "mongoose"

const { Schema } = mongoose;

const userClearSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId, 
            ref: "users", 
            required: true, 
          },
          remarks :{ type: String, required: true }, 
          updateStatus :{ type: String, required: true } ,
    }, {
    timestamps: true
}
)

const userClear = mongoose.model("userclear", userClearSchema)

export default userClear;