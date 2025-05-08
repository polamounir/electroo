import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const handleDownloadPdf = async (
  order,
  printableRef,
  setIsPrinting,
  toast,
  itemStatus
) => {
  setIsPrinting(true);
  toast.info("جارِ إنشاء ملف PDF...");

  try {
    const element = printableRef.current;

    const clone = element.cloneNode(true);
    const container = document.createElement("div");
    container.appendChild(clone);
    document.body.appendChild(container);

    const allElements = container.querySelectorAll("*");
    allElements.forEach((el) => {
      const computedStyle = window.getComputedStyle(el);
      const bgColor = computedStyle.backgroundColor;
      const color = computedStyle.color;

      if (bgColor && bgColor.startsWith("rgb")) {
        el.style.backgroundColor = bgColor;
      } else {
        el.style.backgroundColor = "transparent";
      }

      if (color && color.startsWith("rgb")) {
        el.style.color = color;
      } else {
        el.style.color = "#000000";
      }
    });

    const printStyle = document.createElement("style");
    printStyle.innerHTML = `
      * { 
        font-family: "Arial", sans-serif !important;
        color-scheme: light only !important;
      }
      .print-section { padding: 20px; }
      img { max-width: 100%; height: auto; }
    `;
    clone.appendChild(printStyle);

    const scale = 2;

    const canvas = await html2canvas(clone, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      removeContainer: true,
    });

    document.body.removeChild(container);

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    pdf.addImage(
      canvas.toDataURL("image/jpeg", 1.0),
      "JPEG",
      0,
      position,
      imgWidth,
      imgHeight
    );
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 1.0),
        "JPEG",
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;
    }

    const filename = `Order-${order.orderId}-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    pdf.save(filename);
    toast.success("تم تحميل الفاتورة بنجاح");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("حدث خطأ أثناء إنشاء ملف PDF");
  } finally {
    setIsPrinting(false);
  }
};
