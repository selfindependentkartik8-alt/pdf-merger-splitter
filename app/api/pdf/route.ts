import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const mode = formData.get("mode") as string;
    const pageRange = (formData.get("pageRange") as string) || "";

    const uploadedFiles = formData.getAll("files");

    if (!uploadedFiles.length) {
      return NextResponse.json(
        { error: "No PDF file uploaded." },
        { status: 400 }
      );
    }

    const files = uploadedFiles.filter(
      (file): file is File => file instanceof File
    );

    if (!files.length) {
      return NextResponse.json(
        { error: "Invalid PDF files." },
        { status: 400 }
      );
    }

    // =========================
    // MERGE PDFs
    // =========================

    if (mode === "Merge PDFs") {
      if (files.length < 2) {
        return NextResponse.json(
          { error: "Please select at least two PDFs." },
          { status: 400 }
        );
      }

      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();

        const sourcePdf = await PDFDocument.load(bytes);

        const pages = await mergedPdf.copyPages(
          sourcePdf,
          sourcePdf.getPageIndices()
        );

        pages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const output = await mergedPdf.save();

      return new NextResponse(Buffer.from(output), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition":
            'attachment; filename="merged.pdf"',
          "Cache-Control": "no-store",
        },
      });
    }

    // =========================
    // SPLIT / EXTRACT PDF
    // =========================

    if (mode === "Split PDF") {
      const file = files[0];

      if (!pageRange.trim()) {
        return NextResponse.json(
          { error: "Please enter the page range." },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();

      const sourcePdf = await PDFDocument.load(bytes);

      const totalPages = sourcePdf.getPageCount();

      const pageNumbers = parsePageRange(
        pageRange,
        totalPages
      );

      if (!pageNumbers.length) {
        return NextResponse.json(
          {
            error:
              "Invalid page range. Example: 1-3, 5, 8-10",
          },
          { status: 400 }
        );
      }

      const outputPdf = await PDFDocument.create();

      const pages = await outputPdf.copyPages(
        sourcePdf,
        pageNumbers.map((page) => page - 1)
      );

      pages.forEach((page) => {
        outputPdf.addPage(page);
      });

      const output = await outputPdf.save();

      return new NextResponse(Buffer.from(output), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition":
            'attachment; filename="split-pages.pdf"',
          "Cache-Control": "no-store",
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid operation." },
      { status: 400 }
    );
  } catch (error) {
    console.error("PDF processing error:", error);

    return NextResponse.json(
      {
        error:
          "Unable to process the PDF. Make sure the file is valid and try again.",
      },
      { status: 500 }
    );
  }
}

// =========================
// PAGE RANGE PARSER
// Examples:
// 1
// 1-3
// 1,3,5
// 1-3,5,8-10
// =========================

function parsePageRange(
  input: string,
  totalPages: number
): number[] {
  const result = new Set<number>();

  const parts = input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  for (const part of parts) {
    // Range: 1-5
    if (part.includes("-")) {
      const range = part
        .split("-")
        .map((value) => Number(value.trim()));

      if (range.length !== 2) {
        continue;
      }

      let start = range[0];
      let end = range[1];

      if (
        !Number.isInteger(start) ||
        !Number.isInteger(end)
      ) {
        continue;
      }

      if (start > end) {
        [start, end] = [end, start];
      }

      start = Math.max(1, start);
      end = Math.min(totalPages, end);

      for (let page = start; page <= end; page++) {
        result.add(page);
      }
    }

    // Single page: 5
    else {
      const page = Number(part);

      if (
        Number.isInteger(page) &&
        page >= 1 &&
        page <= totalPages
      ) {
        result.add(page);
      }
    }
  }

  return Array.from(result).sort(
    (a, b) => a - b
  );
}