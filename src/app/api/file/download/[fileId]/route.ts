import connectDB from "@/db/config";
import { NextRequest, NextResponse } from "next/server";
import File from "@/models/file"
import path from "path";
import fs from "fs/promises"
import { FileType } from "@/types";

export const GET = async (req: NextRequest, { params }: any) => {
    const { fileId } = params
    try {
        await connectDB()
        const file = await File.findOne({ _id: fileId });
        if (file) {
            file.downloads++
            await file.save()
            const filePath = path.join(process.cwd(), 'public/uploads', file.name);
            const response = await fs.readFile(filePath)
            return new Response(response);
        } else {
            throw new Error("File Not found.")
        }
    } catch (error) {
        return NextResponse.json({
            message: error || "Not found",
            success: false
        })
    }
}

