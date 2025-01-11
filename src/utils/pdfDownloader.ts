// export const downloadPDF = async (response: any, filename: string) => {
//   try {
//     // Convert response to blob
//     const blob = new Blob([response.data], {
//       type: response.headers["content-type"] || "application/pdf",
//     });

//     // Validate PDF
//     if (blob.size === 0) {
//       throw new Error("Empty PDF received");
//     }

//     // Create object URL
//     const url = window.URL.createObjectURL(blob);

//     // Create temporary link
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = filename;

//     // Append to body and click
//     document.body.appendChild(link);
//     link.click();

//     // Cleanup
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);

//     return true;
//   } catch (error) {
//     console.error("PDF Download Error:", error);
//     throw error;
//   }
// };

export const downloadPDF = async (response: any, filename: string) => {
  try {
    // Convert response to blob
    const blob = new Blob([response.data], {
      type: response.headers["content-type"] || "application/pdf",
    });

    // Validate PDF
    if (blob.size === 0) {
      throw new Error("Empty PDF received");
    }

    // Create object URL
    const url = window.URL.createObjectURL(blob);

    // Check if device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // For mobile devices, create a temporary link with download attribute
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.setAttribute("target", "_blank");

      // For iOS Safari, we need to use a different approach
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        // First try direct download
        link.click();

        // If that doesn't work, try opening in new tab
        setTimeout(() => {
          window.open(url, "_blank");
        }, 100);
      } else {
        // For Android devices
        link.click();

        // Fallback: If download doesn't start, open in new tab
        setTimeout(() => {
          if (!document.querySelector(`a[href="${url}"]`)) {
            window.open(url, "_blank");
          }
        }, 1000);
      }

      // Clean up the link
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 1500);
    } else {
      // Desktop behavior remains unchanged
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Cleanup object URL after a delay
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 2000);

    return true;
  } catch (error) {
    console.error("PDF Download Error:", error);
    throw error;
  }
};
