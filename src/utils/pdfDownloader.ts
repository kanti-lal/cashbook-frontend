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

    // Create temporary link
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    // Append to body and click
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("PDF Download Error:", error);
    throw error;
  }
};
