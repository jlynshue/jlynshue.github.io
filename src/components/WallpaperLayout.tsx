import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { initWallpaper } from "../pages/wallpaper";

export default function WallpaperLayout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = initWallpaper(canvasRef.current);
    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <div className="brand wp">
      <canvas
        ref={canvasRef}
        className="wp-bg"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Outlet />
    </div>
  );
}
