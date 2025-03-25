import { UploadForm } from "@/components/ui/upload/UploadForm";
import React from "react";

function page() {
  return (
    <>
      <div className="p-5">
        <div className="p-5 border border-black">
          <UploadForm></UploadForm>
        </div>
      </div>
    </>
  );
}

export default page;
