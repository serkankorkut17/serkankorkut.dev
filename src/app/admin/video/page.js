"use client";

import withAdminAuth from "@/components/Admin/withAdminAuth";
import { useRef, useState } from "react";

function VideoUploader() {
	const [videoURL, setVideoURL] = useState(null);
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const [screenshot, setScreenshot] = useState(null);

	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setVideoURL(url);
		}
	};

	const captureFrame = () => {
		if (!videoRef.current || !canvasRef.current) return;

		const video = videoRef.current;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

		const imageDataUrl = canvas.toDataURL("image/png");
		setScreenshot(imageDataUrl);
	};

	return (
		<div className="p-4">
			<input type="file" accept="video/*" onChange={handleFileChange} />
			{videoURL && (
				<div className="mt-4">
					<video
						ref={videoRef}
						src={videoURL}
						controls
						style={{ width: "100%", maxWidth: "600px" }}
					/>
					<button
						onClick={captureFrame}
						className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-sm"
					>
						Bu anı kaydet (screenshot)
					</button>
					<canvas ref={canvasRef} style={{ display: "none" }} />
				</div>
			)}
			{screenshot && (
				<div className="mt-4">
					<p>Alınan kare:</p>
					<img src={screenshot} alt="Screenshot from video" />
				</div>
			)}
		</div>
	);
}

export default withAdminAuth(VideoUploader);