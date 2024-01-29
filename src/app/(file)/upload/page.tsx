"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

export default function Page() {
  const [file, setFile] = useState<File>();
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [fileUrl, setFileUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  function onChangeFileInput(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] as File);
  }

  async function upload() {
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    setIsFileUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000 * 3));
    const res = await axios.post("/api/file/upload", data, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total!
        );
        setPercentage(percentCompleted);
      },
    });
    console.log(res);
    if (res.data.fileId) {
      setFileUrl(`${window.location.origin}/download/${res.data.fileId}`);
    }
    setIsFileUploading(false);
  }

  const copyUrl = () => {
    window.navigator.clipboard.writeText(fileUrl);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000 * 5);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-[80%] rounded-lg shadow-2xl p-8">
        <div className="w-full rounded-lg border-2 border-dashed p-8">
          {
            <div className="my-3">
              {isFileUploading ? (
                <>
                  <Image
                    src={require("../../../../public/assets/icons8-upload-to-cloud-gif.gif")}
                    alt=""
                    className="mx-auto"
                  />
                  <p className="text-center font-semibold text-gray-600 tracking-wide">
                    Uploading {file?.name}
                  </p>
                </>
              ) : (
                <label className="w-full cursor-pointer">
                  <input
                    type="file"
                    hidden
                    name="file"
                    onChange={onChangeFileInput}
                  />

                  <Image
                    src={require("../../../../public/assets/icons8-upload-to-cloud.png")}
                    alt=""
                    className="mx-auto w-[50px]"
                  />
                  <p className="text-center font-semibold text-gray-700 tracking-wide">
                    {file ? file.name : "Upload files"}
                  </p>
                </label>
              )}
            </div>
          }

          <button
            type="button"
            className={`relative overflow-hidden p-0 h-[35px] mt-10 w-full block 
            ${
              isFileUploading
                ? "border-2 border-blue-600"
                : "bg-blue-600 disabled:bg-blue-500"
            } 
            my-3 text-slate-50 rounded-full hover:shadow transition delay-50 duration-50 hover:translate-y-[0.5px] tracking-wider font-semibold text-sm`}
            onClick={upload}
            disabled={isFileUploading || percentage > 0}
          >
            {isFileUploading ? (
              <div
                className=" bg-blue-600 h-full rounded-full flex items-center justify-center"
                style={{ width: `${percentage}%` }}
              >{`${percentage} %`}</div>
            ) : percentage >= 100 ? (
              "Uploaded"
            ) : (
              "Start Upload"
            )}
          </button>

          {fileUrl && (
            <div className="truncate mt-6">
              <p className="font-semibold text-gray-500 text-center">
                Upload completed
              </p>
              <div className="grid grid-cols-12">
                <div className="truncate col-span-11">
                  <Link
                    href={fileUrl}
                    className="text-blue-600 font-semibold text-sm tracking-wider"
                  >
                    {fileUrl}
                  </Link>
                </div>
                <div className="truncate col-span-1">
                  <button
                    className="bg-yellow-600 p-1 rounded-md invert"
                    onClick={copyUrl}
                  >
                    <Image
                      src={require(`../../../../public/assets/${
                        isCopied ? "tick.png" : "copy.png"
                      }`)}
                      alt=""
                      width={20}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
