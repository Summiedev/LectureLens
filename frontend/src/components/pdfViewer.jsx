import React, { useEffect, useRef, useState } from 'react';
import { pdfjsLib } from '../pdf-worker';

const PDFSlideViewer = ({ file, slideIndex }) => {
  const canvasRef = useRef();
  const [pdfDoc, setPdfDoc] = useState(null);

  useEffect(() => {
    const loadPDF = async () => {
      const loadingTask = pdfjsLib.getDocument(file);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
    };

    loadPDF();
  }, [file]);

  useEffect(() => {
    const renderSlide = async () => {
      if (!pdfDoc || !canvasRef.current) return;
      const page = await pdfDoc.getPage(slideIndex + 1);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      await page.render(renderContext).promise;
    };

    renderSlide();
  }, [pdfDoc, slideIndex]);

  return <canvas ref={canvasRef} className="w-full h-auto border shadow-md" />;
};

export default PDFSlideViewer;
