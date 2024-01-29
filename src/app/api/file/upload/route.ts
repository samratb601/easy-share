import { NextRequest, NextResponse } from 'next/server';
import * as dateFn from "date-fns";
import { join } from 'path';
import { mkdir, stat, writeFile } from 'fs/promises';
import mime from "mime";
import File from '@/models/file';
import connectDB from '@/db/config';


// export const config = {
//     api: {
//         bodyParser: false,
//         timeout: 0
//     }
// }



export const POST =
    async (req: NextRequest, res: NextResponse) => {
        console.log("req recieved")
        const formData = await req.formData();
        // Remember to enforce type here and after use some lib like zod.js to check it
        const file = formData.get('file') as File;

        // Thats it, you have your file
        const buffer = Buffer.from(await file.arrayBuffer());
        const relativeUploadDir = `/uploads`;
        const uploadDir = join(process.cwd(), "public", relativeUploadDir);
        try {
            await stat(uploadDir);
        } catch (e: any) {
            if (e.code === "ENOENT") {
                await mkdir(uploadDir, { recursive: true });
            } else {
                console.error(
                    "Error while trying to create directory when uploading a file\n",
                    e
                );
                return NextResponse.json(
                    { error: "Something went wrong." },
                    { status: 500 }
                );
            }
        }

        try {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const filename = `${file.name.replace(/\.[^/.]+$/,"")}-${uniqueSuffix}.${mime.getExtension(file.type)}`;
            await writeFile(`${uploadDir}/${filename}`, buffer);
            await connectDB();
            const doc = new File({
                name: filename,
                size: file.size,
            });
            const res = await doc.save();
            console.log(res)
            return NextResponse.json({
                fileUrl: `${relativeUploadDir}/${filename}`,
                fileId: res?._id
            });
        } catch (e) {
            console.error("Error while trying to upload a file\n", e);
            return NextResponse.json(
                { error: "Something went wrong." },
                { status: 500 }
            );
        }
    }
