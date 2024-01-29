import mongoose from "mongoose"

const fileSchema = new mongoose.Schema(
    {
        name: { type: String },
        size: { type: Number },
        downloads: { type: Number, default: 0 }
    },
    { timestamps: true }
)

export default mongoose.models?.File || mongoose.model("File", fileSchema)