import React, {useState, useEffect} from "react";
import "./styles/styles.css"
import {startSearch} from "../../actions/SearchAction"

export default function SearchPage() {
    const [images, setImages] = useState<FileList | null>()
    const [response, setResponse] = useState<JSON>()
    
    function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        let files = (e.target as HTMLInputElement).files
        setImages(files)
    }

    async function submitImage() {

      if (images != null) {
        const file = images[0]
        let b64: string = (await file2Base64(file))
        let tempResult: JSON = await startSearch(b64)
        setResponse(tempResult)
      }
    }

    const file2Base64 = (file:File):Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            let encoded = reader.result?.toString().replace(/^data:(.*,)?/, '')
            if (encoded != null && (encoded.length % 4) > 0) {
              encoded += '='.repeat(4 - (encoded.length % 4));
            }
            resolve(encoded as string);
          };
          reader.onerror = error => reject(error);
        });
    }


    return (
        <div>
          <input type="file" multiple accept="image/*" onChange={onImageChange} />
          {images == null ? "Can't submit": <button className="button" onClick={submitImage}>Submit</button>}
          {images == null ? "No Display": <img src={URL.createObjectURL(images[0])} />}
          <div>
            {response == null ? "No response yet" : JSON.stringify(response)}
          </div>
        </div>
    )
}