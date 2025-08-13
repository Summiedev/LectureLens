import { useRef, useEffect, useState } from "react";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs-core";
import * as blazeface from "@tensorflow-models/blazeface";
import * as fld from "@tensorflow-models/face-landmarks-detection";

export default function FastFocusTracker({
  sessionId,
  studentUUID,
  slideIndex,
}) {
  const videoRef = useRef();
  const canvasRef = useRef(document.createElement("canvas"));
  const [blaze, setBlaze] = useState();
  const [detector, setDetector] = useState();
  const [debug, setDebug] = useState({ status: "init", face: false, focus: 0 });

  canvasRef.current.width = 256;
  canvasRef.current.height = 256;

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        await new Promise((r) => (videoRef.current.onloadedmetadata = r));
        videoRef.current.play();
      } catch (e) {
        console.error("Camera error", e);
      }
    })();
  }, []);

  // load models
  useEffect(() => {
    (async () => {
      await tf.setBackend("webgl");
      await tf.ready();
      const [bf, md] = await Promise.all([
        blazeface.load(),
        fld.createDetector(fld.SupportedModels.MediaPipeFaceMesh, {
          runtime: "tfjs",
          maxFaces: 1,
        }),
      ]);
      setBlaze(bf);
      setDetector(md);
      setDebug((d) => ({ ...d, status: "models-loaded" }));
    })();
  }, []);

  // detection loop
  useEffect(() => {
    if (!blaze || !detector) return;
    let alive = true;

    async function detect() {
      if (!alive || videoRef.current.readyState < 2) {
        return setTimeout(detect, 500);
      }

      // draw to small canvas
      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, 256, 256);

      // face presence
      const faces = await blaze.estimateFaces(canvasRef.current, false);
      if (faces.length === 0) {
        setDebug((d) => ({ ...d, status: "no-face", face: false, focus: 0 }));
      } else {
        const face = faces[0];
        const box = face.topLeft.concat(face.bottomRight); // [x1,y1,x2,y2]
        const x1 = box[0],
          y1 = box[1],
          x2 = box[2],
          y2 = box[3];
        const w = x2 - x1,
          h = y2 - y1;

        // area ratio
        const areaRatio = Math.min(1, (w * h) / (256 * 256));

        // landmark detection on that small canvas
        const [mesh] = await detector.estimateFaces(canvasRef.current);
        let poseScore = 0;
        if (mesh && mesh.keypoints) {
          // nose
          const nose =
            mesh.keypoints.find((k) => k.name === "noseTip") ||
            mesh.keypoints[1];
          // center of this box
          const cx = x1 + w / 2,
            cy = y1 + h / 2;
          const dx = Math.abs(nose.x - cx) / w; // normalized to box width
          const dy = Math.abs(nose.y - cy) / h; // normalized to box height
          const dev = Math.hypot(dx, dy);
          poseScore = Math.max(0, 1 - dev); // smaller dev → closer to 1
        }

        // combine
        const focus = Math.round((areaRatio * 0.5 + poseScore * 0.5) * 100);
        setDebug({ status: "face-detected", face: true, focus });

        // POST backend
        if (sessionId) {
          // fetch(`/api/sessions/${sessionId}/attention`, {
          //   method: "POST",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify({
          //     studentUUID,
          //     slideIndex,
          //     attentionScore: focus / 100,
          //     timestamp: Date.now(),
          //   }),
          // }).catch(console.error);
        }
      }

      setTimeout(detect, 1000);
    }

    detect();
    return () => {
      alive = false;
    };
  }, [blaze, detector, sessionId, studentUUID, slideIndex]);

  return (
    <div className="p-2 bg-gray-100 rounded-md">
      <video
        ref={videoRef}
        className="w-48 h-36 rounded border mb-2"
        muted
        playsInline
      />
      <div className="text-sm">
        <div>Status: {debug.status}</div>
        <div>Face: {debug.face ? "✅" : "❌"}</div>
        <div>Focus: {debug.focus}%</div>
      </div>
    </div>
  );
}
