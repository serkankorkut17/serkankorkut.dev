"use client";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

const QRCodeGenerator = () => {
  const [inputValue, setInputValue] = useState("https://serkankorkut.dev/");
  const [logoSrc, setLogoSrc] = useState(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#000000");
  const [qrLevel, setQrLevel] = useState("H");
  const [logoWidth, setLogoWidth] = useState(128);
  const [logoHeight, setLogoHeight] = useState(128);
  const qrRef = useRef(null);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadSVG = () => {
    const svgElement = qrRef.current.querySelector("svg");
    const serializer = new XMLSerializer();
    const svgBlob = new Blob([serializer.serializeToString(svgElement)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.svg";
    link.click();

    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    const svgElement = qrRef.current.querySelector("svg");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const scaleFactor = 4;
    canvas.width = 512 * scaleFactor;
    canvas.height = 512 * scaleFactor;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "qrcode.png";
      link.click();
    };

    img.src = url;
  };

  return (
    <section className="flex flex-col p-4 sm:p-6 lg:p-8 lg:px-24 bg-white text-black min-h-screen mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">QR Code Generator</h1>
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Column - Controls */}
        <div className="w-full lg:w-1/3 space-y-4 sm:space-y-6">
          {/* Text Input */}
          <div className="space-y-2">
            <label className="block font-medium">Content:</label>
            <input
              type="text"
              placeholder="Enter text or URL"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-sm text-sm sm:text-base"
            />
          </div>

          {/* QR Level Selection */}
          <div className="space-y-2">
            <label className="block font-medium">QR Code Level:</label>
            <select 
              value={qrLevel} 
              onChange={(e) => setQrLevel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-sm text-sm sm:text-base"
            >
              <option value="L">L - Low</option>
              <option value="M">M - Medium</option>
              <option value="Q">Q - Quartile</option>
              <option value="H">H - High</option>
            </select>
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="block font-medium">Upload Logo:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleLogoUpload} 
              className="w-full text-sm sm:text-base"
            />
          </div>

          {/* Logo Dimensions */}
          {logoSrc && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block font-medium">Logo Width (px):</label>
                <input
                  type="number"
                  value={logoWidth}
                  onChange={(e) => setLogoWidth(Number(e.target.value))}
                  min="20"
                  max="150"
                  className="w-full p-2 border border-gray-300 rounded-sm text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-medium">Logo Height (px):</label>
                <input
                  type="number"
                  value={logoHeight}
                  onChange={(e) => setLogoHeight(Number(e.target.value))}
                  min="20"
                  max="150"
                  className="w-full p-2 border border-gray-300 rounded-sm text-sm sm:text-base"
                />
              </div>
            </div>
          )}

          {/* Color Selection */}
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <label className="block font-medium">Background:</label>
              <input 
                type="color" 
                value={bgColor} 
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-10" 
              />
            </div>
            <div className="space-y-2 flex-1">
              <label className="block font-medium">Foreground:</label>
              <input 
                type="color" 
                value={fgColor} 
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full h-10" 
              />
            </div>
          </div>

          {/* Download Buttons */}
          {inputValue && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                onClick={downloadSVG} 
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600 text-sm sm:text-base"
              >
                Download SVG
              </button>
              <button 
                onClick={downloadPNG} 
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-sm hover:bg-orange-600 text-sm sm:text-base"
              >
                Download PNG (HD)
              </button>
            </div>
          )}
        </div>

        {/* Right Column - QR Code Display */}
        <div className="w-full lg:w-2/3 flex justify-center items-start">
          <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg w-full max-w-xl">
            {inputValue && (
              <div ref={qrRef} className="w-full">
                <QRCodeSVG
                  value={inputValue}
                  size={512}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  level={qrLevel}
                  className="w-full h-auto"
                  imageSettings={
                    logoSrc
                      ? {
                          src: logoSrc,
                          height: logoHeight,
                          width: logoWidth,
                          excavate: true,
                        }
                      : undefined
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QRCodeGenerator;