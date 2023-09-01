import { useEffect, useState } from "react";

const useIsMobile = (breakpoint = 640) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handlePageResized = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Add event listeners without redundant checks
    window.addEventListener("resize", handlePageResized);
    window.addEventListener("orientationchange", handlePageResized);

    // Initial call to set isMobile
    handlePageResized();

    // Clean up the event listeners
    return () => {
      window.removeEventListener("resize", handlePageResized);
      window.removeEventListener("orientationchange", handlePageResized);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
