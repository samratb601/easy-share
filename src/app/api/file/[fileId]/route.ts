
import connectDB from '@/db/config';
import { NextRequest, NextResponse } from 'next/server';
import File from '@/models/file';
connectDB();

export const GET = async (req: NextRequest, { params }: any) => {
    const { fileId } = params
    try {
        const res = await File.findOne({ _id: fileId });
        if (res) {
            return NextResponse.json({ data: res, success: true })
        } else {
            throw new Error("Not found")
        }
    } catch (error) {
        return NextResponse.json({
            message: error || "Not found",
            success: false
        })
    }
}