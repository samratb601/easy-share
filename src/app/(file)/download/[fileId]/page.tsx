"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FileType } from "@/types";
import { calculateExpiry, calculateFileSize } from "@/utils/file.utils";

export default function Page() {
  const { fileId } = useParams();

  const [isFetching, setIsFetching] = useState(true);
  const [fileDetails, setFileDetails] = useState<FileType>();
  const [percentage, setPercentage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    (async () => {
      setIsFetching(true);
      const res = await axios.get(`/api/file/${fileId}`);
      // console.log(res);
      res.data.success && setFileDetails(res.data.data);
      setIsFetching(false);
    })();
  }, []);

  const downloadFile = async () => {
    setErrMsg("")
    try {
      setIsDownloading(true);
      const res = await axios.get(`/api/file/download/${fileId}`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / fileDetails?.size!
          );
          console.log(progressEvent, percentCompleted);
          setPercentage(percentCompleted);
        },
      });

      console.log(res.data);
      if (!res.data) {
        return;
      }
      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileDetails?.name!;
      link.click();
    } catch (e) {
      console.log("File download Error : ", e);
      setErrMsg("Oops! Some error occured. Try downloading again.")
    } finally {
      setIsDownloading(false);
    }
  };

  const fileSize = calculateFileSize(fileDetails?.size!);
  const expiry = calculateExpiry(fileDetails?.createdAt as Date);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {isFetching ? (
        <h2 className="font-semibold text-gray-600 text-lg">
          Fetching file details ....
        </h2>
      ) : !isFetching && !fileDetails ? (
        <h2 className="font-semibold text-gray-700 text-xl">
          Oops! File details Not found!
        </h2>
      ) : (
        <div className="w-[80%] rounded-lg shadow-2xl p-8">
          <div className="w-full rounded-lg border-2 border-dashed p-8">
            <div className="text-gray-700">
              <span className="font-semibold">File name :</span>{" "}
              {fileDetails?.name} <br />
              <span className="font-semibold">File size : </span> {fileSize}{" "}
              <br />
              <span className="font-semibold"> Will expire in :</span>{" "}
              {expiry ? expiry : "Expired"}
              <br />
            </div>

            {expiry && (
              <button
                type="button"
                className={`relative overflow-hidden p-0 h-[35px] mt-10 w-full block 
              ${
                isDownloading
                  ? "border-2 border-blue-600"
                  : "bg-blue-600 disabled:bg-blue-500"
              } 
              my-3 text-slate-50 rounded-full hover:shadow transition delay-50 duration-50 hover:translate-y-[0.5px] tracking-wider font-semibold text-sm`}
                onClick={downloadFile}
                disabled={isDownloading || percentage > 0}
              >
                {isDownloading ? (
                  <div
                    className=" bg-blue-600 h-full rounded-full flex items-center justify-center"
                    style={{ width: `${percentage}%` }}
                  >{`${percentage} %`}</div>
                ) : percentage >= 100 ? (
                  "Downloaded"
                ) : (
                  "Download"
                )}
              </button>
            )}
            {
              errMsg && (
                <p className="text-sm font-semibold text-yellow-600">{errMsg}</p>
              )
            }
          </div>
        </div>
      )}
    </main>
  );
}
