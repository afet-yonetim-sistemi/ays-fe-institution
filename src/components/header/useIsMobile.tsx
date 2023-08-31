import { useEffect, useState } from "react";

const useIsMobile = (breakpoint = 640) => {
  const checkForDevice = () => window.innerWidth < breakpoint;

  const [isMobile, setIsMobile] = useState(checkForDevice());

  useEffect(() => {
    const handlePageResized = () => {
      setIsMobile(checkForDevice());
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handlePageResized);
      window.addEventListener("orientationchange", handlePageResized);
      window.addEventListener("load", handlePageResized);
      window.addEventListener("reload", handlePageResized);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handlePageResized);
        window.removeEventListener("orientationchange", handlePageResized);
        window.removeEventListener("load", handlePageResized);
        window.removeEventListener("reload", handlePageResized);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isMobile;
};

export default useIsMobile;
