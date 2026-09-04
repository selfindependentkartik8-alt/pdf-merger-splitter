"use client";

import { useState } from "react";

type Mode = "Merge PDFs" | "Split PDF";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function headingHighlight(text: string) {
  const match = text.match(
    /^(merged|split|selected|output|pages|result|file|download)\s*[:\-—]/i
  );

  if (!match) {
    return (
      <p className="text-sm leading-7 text-zinc-300">
        {text}
      </p>
    );
  }

  return (
    <div className="mb-3 rounded-xl border border-[#dc143c]/25 bg-[#dc143c]/10 px-4 py-3 text-sm font-bold text-[#ff6b85]">
      {text}
    </div>
  );
}

export default function Home() {
  const [mode, setMode] =
    useState<Mode>("Merge PDFs");

  const [files, setFiles] = useState<File[]>([]);
  const [pageRange, setPageRange] = useState("");

  const [result, setResult] = useState<{
    name: string;
    size: number;
    message: string;
    url: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = Array.from(
      e.target.files || []
    );

    setError("");
    setResult(null);

    const pdfs = selected.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name
          .toLowerCase()
          .endsWith(".pdf")
    );

    if (!pdfs.length) {
      setFiles([]);
      setError("Please select PDF files only.");
      return;
    }

    if (mode === "Merge PDFs") {
      setFiles(pdfs);
    } else {
      setFiles([pdfs[0]]);
    }
  };

  const processFiles = async () => {
    if (!files.length) {
      setError(
        mode === "Merge PDFs"
          ? "Please select at least two PDFs."
          : "Please select a PDF first."
      );
      return;
    }

    if (
      mode === "Merge PDFs" &&
      files.length < 2
    ) {
      setError(
        "Please select at least two PDFs to merge."
      );
      return;
    }

    if (
      mode === "Split PDF" &&
      !pageRange.trim()
    ) {
      setError(
        "Please enter the page range you want to extract."
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("mode", mode);
      formData.append(
        "pageRange",
        pageRange
      );

      const response = await fetch(
        "/api/pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const data =
          await response
            .json()
            .catch(() => null);

        throw new Error(
          data?.error ||
            "Unable to process PDF."
        );
      }

      const blob =
        await response.blob();

      if (!blob.size) {
        throw new Error(
          "The generated PDF is empty."
        );
      }

      const name =
        mode === "Merge PDFs"
          ? "merged.pdf"
          : "split-pages.pdf";

      const url =
        URL.createObjectURL(blob);

      setResult({
        name,
        size: blob.size,
        url,
        message:
          mode === "Merge PDFs"
            ? `Merged ${files.length} PDF files successfully.`
            : `Selected pages were extracted successfully.`,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!result) return;

    const link =
      document.createElement("a");

    link.href = result.url;
    link.download = result.name;

    document.body.appendChild(link);

    link.click();

    link.remove();
  };

  const clearAll = () => {
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }

    setFiles([]);
    setPageRange("");
    setResult(null);
    setError("");
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#25060d] via-[#080607] to-black text-white">

      {/* AMBIENT CRIMSON GLOW */}

      <div className="pointer-events-none absolute left-1/2 top-[-220px] h-[600px] w-[850px] max-w-[100vw] -translate-x-1/2 rounded-full bg-[#dc143c]/20 blur-[170px]" />

      <div className="pointer-events-none absolute left-[-180px] top-[45%] h-[350px] w-[350px] rounded-full bg-[#dc143c]/8 blur-[150px]" />

      <div className="pointer-events-none absolute right-[-180px] top-[65%] h-[350px] w-[350px] rounded-full bg-[#dc143c]/8 blur-[150px]" />

      {/* NAVBAR */}

      <nav className="relative z-20 mx-4 mt-5 rounded-3xl border border-[#dc143c]/20 bg-black/75 px-4 py-4 shadow-2xl backdrop-blur-2xl sm:mx-auto sm:max-w-6xl sm:px-6">

        <div className="flex items-center justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#dc143c]/30 bg-[#dc143c]/10">

              <img
                src="/logo.png"
                alt="KrishAIWorks"
                className="h-full w-full rounded-full object-cover"
              />

            </div>

            <div className="min-w-0">

              <h2 className="truncate text-sm font-bold sm:text-base">
                KrishAIWorks
              </h2>

              <p className="text-[10px] text-zinc-500 sm:text-xs">
                AI Solutions That Work
              </p>

            </div>

          </div>

          <div className="hidden items-center gap-7 text-sm text-zinc-300 md:flex">

            <a
              href="#home"
              className="transition hover:text-[#ff6b85]"
            >
              Home
            </a>

            <a
              href="#features"
              className="transition hover:text-[#ff6b85]"
            >
              Features
            </a>

            <a
              href="#how"
              className="transition hover:text-[#ff6b85]"
            >
              How To Use
            </a>

            <a
              href="#faq"
              className="transition hover:text-[#ff6b85]"
            >
              FAQ
            </a>

            <a
              href="https://www.instagram.com/krishaiworks/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#ffe8ed] px-5 py-2 font-medium text-black transition hover:bg-white"
            >
              Follow
            </a>

          </div>

          <a
            href="#tool"
            className="rounded-full border border-[#dc143c]/30 bg-[#dc143c]/10 px-4 py-2 text-xs text-[#ff6b85] md:hidden"
          >
            Try
          </a>

        </div>

      </nav>

      {/* HERO */}

      <section
        id="home"
        className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-16 text-center sm:px-8 sm:pt-24"
      >

        <div className="rounded-full border border-[#dc143c]/30 bg-[#dc143c]/10 px-4 py-2 text-xs text-[#ff6b85]">
          📄 PDF Merger & Splitter
        </div>

        <p className="mt-4 text-xs text-zinc-500">
          Built by{" "}
          <span className="font-semibold text-[#ff6b85]">
            KrishAIWorks
          </span>
        </p>

        <h1 className="mt-7 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">

          Manage PDFs.
          <br />

          <span className="bg-gradient-to-r from-white via-[#ff9aae] to-[#dc143c] bg-clip-text text-transparent">
            Your Way.
          </span>

        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
          Merge multiple PDF files into one document
          or extract exactly the pages you need.
        </p>

        <div className="mt-7 flex max-w-full flex-wrap justify-center gap-3">

          <span className="rounded-full border border-[#dc143c]/20 bg-[#dc143c]/10 px-4 py-2 text-xs text-zinc-300">
            📎 Merge PDFs
          </span>

          <span className="rounded-full border border-[#dc143c]/20 bg-[#dc143c]/10 px-4 py-2 text-xs text-zinc-300">
            ✂️ Split Pages
          </span>

          <span className="rounded-full border border-[#dc143c]/20 bg-[#dc143c]/10 px-4 py-2 text-xs text-zinc-300">
            ⚡ Fast
          </span>

        </div>

      </section>

      {/* TOOL */}

      <section
        id="tool"
        className="relative z-10 mx-auto max-w-5xl px-4 pb-24 sm:px-8"
      >

        <div className="rounded-[2rem] border border-[#dc143c]/20 bg-black/80 p-4 shadow-2xl shadow-[#dc143c]/5 backdrop-blur-2xl sm:p-7">

          <div className="mb-7">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6b85]">
              PDF Tool
            </p>

            <h2 className="mt-3 text-xl font-bold sm:text-2xl">
              Merge or split your PDF.
            </h2>

          </div>

          {/* MODE */}

          <div className="grid gap-3 sm:grid-cols-2">

            {(
              [
                "Merge PDFs",
                "Split PDF",
              ] as Mode[]
            ).map((item) => (

              <button
                key={item}
                type="button"
                onClick={() => {
                  if (result?.url) {
                    URL.revokeObjectURL(
                      result.url
                    );
                  }

                  setMode(item);
                  setFiles([]);
                  setPageRange("");
                  setResult(null);
                  setError("");
                }}
                className={`rounded-xl border px-5 py-4 text-sm font-semibold transition ${
                  mode === item
                    ? "border-[#dc143c]/60 bg-[#dc143c]/15 text-[#ff6b85]"
                    : "border-zinc-800 bg-[#080808] text-zinc-500 hover:border-[#dc143c]/30 hover:text-zinc-300"
                }`}
              >
                {item === "Merge PDFs"
                  ? "📎 Merge PDFs"
                  : "✂️ Split PDF"}
              </button>

            ))}

          </div>

          {/* UPLOAD */}

          <label className="mt-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {mode === "Merge PDFs"
              ? "Select PDF Files"
              : "Select PDF"}
          </label>

          <label className="mt-3 flex min-h-[210px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#dc143c]/30 bg-[#090607] px-5 text-center transition hover:border-[#dc143c]/60 hover:bg-[#dc143c]/5">

            <input
              type="file"
              accept=".pdf,application/pdf"
              multiple={
                mode === "Merge PDFs"
              }
              onChange={handleFiles}
              className="hidden"
            />

            <div className="text-5xl">
              📄
            </div>

            <p className="mt-4 text-sm font-semibold text-zinc-200">
              {files.length
                ? `${files.length} PDF ${
                    files.length === 1
                      ? "file"
                      : "files"
                  } selected`
                : mode === "Merge PDFs"
                ? "Choose multiple PDF files"
                : "Choose a PDF file"}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              {mode === "Merge PDFs"
                ? "Select two or more PDFs"
                : "Select one PDF document"}
            </p>

          </label>

          {/* FILE LIST */}

          {files.length > 0 && (

            <div className="mt-5 space-y-2">

              {files.map(
                (file, index) => (

                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#dc143c]/10 bg-[#090607] px-4 py-3"
                  >

                    <div className="min-w-0">

                      <p className="truncate text-sm font-medium text-zinc-300">
                        {index + 1}.{" "}
                        {file.name}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        {formatSize(
                          file.size
                        )}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

          {/* PAGE RANGE */}

          {mode === "Split PDF" && (

            <div className="mt-5">

              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Pages To Extract
              </label>

              <input
                value={pageRange}
                onChange={(e) =>
                  setPageRange(
                    e.target.value
                  )
                }
                placeholder="Example: 1-3, 5, 8-10"
                className="mt-2 h-12 w-full rounded-xl border border-[#dc143c]/15 bg-[#080607] px-4 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-[#dc143c]/50"
              />

              <p className="mt-2 text-xs text-zinc-600">
                Use page numbers or ranges
                separated by commas.
              </p>

            </div>

          )}

          {/* PROCESS BUTTON */}

          <button
            type="button"
            onClick={processFiles}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-[#dc143c] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#dc143c]/10 transition hover:bg-[#ed234b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "⚙️ Processing PDF..."
              : mode === "Merge PDFs"
              ? "📎 Merge PDFs"
              : "✂️ Split PDF"}
          </button>

          {/* CLEAR */}

          <button
            type="button"
            onClick={clearAll}
            className="mt-3 w-full py-2 text-xs text-zinc-600 transition hover:text-[#ff6b85]"
          >
            Clear Everything
          </button>

          {/* ERROR */}

          {error && (

            <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              ⚠️ {error}
            </div>

          )}

          {/* RESULT */}

          {result && (

            <div className="mt-8 rounded-3xl border border-[#dc143c]/25 bg-[#080607] p-5 sm:p-7">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6b85]">
                Result
              </p>

              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                Your PDF Is Ready.
              </h3>

              <div className="mt-6 rounded-2xl border border-[#dc143c]/15 bg-black p-5">

                {headingHighlight(
                  `Result: ${result.message}`
                )}

                {headingHighlight(
                  `File: ${result.name}`
                )}

                {headingHighlight(
                  `Output Size: ${formatSize(
                    result.size
                  )}`
                )}

              </div>

              <p className="mt-5 text-sm leading-7 text-zinc-400">
                Your processed PDF has been
                generated successfully. Click
                the button below when you are
                ready to download it.
              </p>

              {/* DOWNLOAD BUTTON */}

              <button
                type="button"
                onClick={downloadPdf}
                className="mt-6 w-full rounded-xl bg-[#ffe8ed] px-5 py-4 text-sm font-bold text-black transition hover:bg-white"
              >
                ⬇️ Download PDF
              </button>

              {/* PROCESS AGAIN */}

              <button
                type="button"
                onClick={() => {
                  if (result?.url) {
                    URL.revokeObjectURL(
                      result.url
                    );
                  }

                  setResult(null);
                }}
                className="mt-3 w-full rounded-xl border border-[#dc143c]/20 bg-[#dc143c]/5 px-5 py-3 text-xs font-semibold text-[#ff6b85] transition hover:bg-[#dc143c]/10"
              >
                🔄 Process Another PDF
              </button>

            </div>

          )}

        </div>

      </section>

      {/* FEATURES */}

      <section
        id="features"
        className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-8"
      >

        <div className="grid gap-5 md:grid-cols-3">

          {[
            [
              "📎",
              "Merge PDFs",
              "Combine multiple PDF documents into one clean file.",
            ],
            [
              "✂️",
              "Extract Pages",
              "Select exactly the pages you need from a PDF.",
            ],
            [
              "📱",
              "Mobile Friendly",
              "Use the tool comfortably from your phone, tablet or computer.",
            ],
          ].map(
            ([icon, title, description]) => (

              <div
                key={title}
                className="rounded-3xl border border-[#dc143c]/10 bg-black/70 p-6 backdrop-blur-xl transition hover:border-[#dc143c]/30"
              >

                <div className="text-3xl">
                  {icon}
                </div>

                <h3 className="mt-5 text-base font-bold">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-500">
                  {description}
                </p>

              </div>

            )
          )}

        </div>

      </section>

      {/* HOW TO USE */}

      <section
        id="how"
        className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-8"
      >

        <div className="text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6b85]">
            How To Use
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Manage your PDF in three steps.
          </h2>

        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">

          {[
            [
              "01",
              "Choose Tool",
              "Select Merge PDFs or Split PDF.",
            ],
            [
              "02",
              "Upload",
              "Choose your PDF documents and configure the pages if needed.",
            ],
            [
              "03",
              "Download",
              "Generate your new PDF and download it when ready.",
            ],
          ].map(
            ([number, title, description]) => (

              <div
                key={number}
                className="rounded-3xl border border-[#dc143c]/10 bg-black/70 p-6"
              >

                <span className="text-sm font-bold text-[#ff6b85]">
                  {number}
                </span>

                <h3 className="mt-5 text-lg font-bold">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-500">
                  {description}
                </p>

              </div>

            )
          )}

        </div>

      </section>

      {/* FAQ */}

      <section
        id="faq"
        className="relative z-10 mx-auto max-w-4xl px-4 py-20 sm:px-8"
      >

        <div className="text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6b85]">
            FAQ
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Frequently Asked Questions
          </h2>

        </div>

        <div className="mt-10 space-y-4">

          {[
            [
              "Can I merge multiple PDFs?",
              "Yes. Select two or more PDF files and combine them into a single document.",
            ],
            [
              "Can I extract specific pages?",
              "Yes. Use Split PDF and enter the page numbers or ranges you want.",
            ],
            [
              "Does it work on mobile?",
              "Yes. The interface is designed to work across phones, tablets and desktop screens.",
            ],
            [
              "Does the PDF download automatically?",
              "No. After processing, you can review the result and download the PDF whenever you are ready.",
            ],
          ].map(
            ([question, answer]) => (

              <div
                key={question}
                className="rounded-3xl border border-[#dc143c]/10 bg-black/70 p-6"
              >

                <h3 className="text-sm font-bold">
                  {question}
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-500">
                  {answer}
                </p>

              </div>

            )
          )}

        </div>

      </section>

      {/* CTA */}

      <section className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center sm:px-8">

        <div className="rounded-[2rem] border border-[#dc143c]/20 bg-gradient-to-b from-[#dc143c]/15 to-black p-8 sm:p-12">

          <h2 className="text-3xl font-bold sm:text-4xl">
            Take control of your PDFs.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-500">
            Merge documents or extract the exact
            pages you need in just a few clicks.
          </p>

          <a
            href="#tool"
            className="mt-7 inline-flex rounded-xl bg-[#ffe8ed] px-6 py-3 text-sm font-semibold text-black transition hover:bg-white"
          >
            Manage A PDF
          </a>

        </div>

      </section>

     {/* FOOTER */}

<footer className="relative z-10 border-t border-[#dc143c]/10 px-4 py-10">

  <div className="mx-auto max-w-6xl">

    {/* RELATED TOOLS */}

    <div className="mb-10">

      <div className="mb-6 text-center">

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#dc143c]/70">
          Explore More
        </p>

        <h3 className="mt-2 text-2xl font-bold">
          More PDF &amp; AI Tools
        </h3>

        <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-500">
          Explore more free tools from KrishAIWorks to manage PDFs,
          documents, and everyday digital tasks.
        </p>

      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* PDF Compressor */}

        <a
          href="https://pdfcompressor.krishaiworks.com/"
          className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#dc143c]/30 hover:bg-[#dc143c]/[0.04]"
        >

          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#dc143c]/20 bg-[#dc143c]/10 text-lg">
            📄
          </div>

          <h4 className="font-semibold transition-colors group-hover:text-[#dc143c]">
            PDF Compressor
          </h4>

          <p className="mt-2 text-xs leading-5 text-zinc-500">
            Compress PDF files and reduce their size quickly.
          </p>

        </a>


        {/* PDF AI Summarizer */}

        <a
          href="https://pdfaisummarizer.krishaiworks.com/"
          className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#dc143c]/30 hover:bg-[#dc143c]/[0.04]"
        >

          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#dc143c]/20 bg-[#dc143c]/10 text-lg">
            🤖
          </div>

          <h4 className="font-semibold transition-colors group-hover:text-[#dc143c]">
            PDF AI Summarizer
          </h4>

          <p className="mt-2 text-xs leading-5 text-zinc-500">
            Summarize lengthy PDF documents quickly with AI.
          </p>

        </a>


        {/* Image to PDF Converter */}

        <a
          href="https://imagetopdfconverter.krishaiworks.com/"
          className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#dc143c]/30 hover:bg-[#dc143c]/[0.04]"
        >

          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#dc143c]/20 bg-[#dc143c]/10 text-lg">
            🖼️
          </div>

          <h4 className="font-semibold transition-colors group-hover:text-[#dc143c]">
            Image to PDF Converter
          </h4>

          <p className="mt-2 text-xs leading-5 text-zinc-500">
            Convert images into clean PDF documents instantly.
          </p>

        </a>


        {/* Image Resizer & Compressor */}

        <a
          href="https://imageresizercompressor.krishaiworks.com/"
          className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#dc143c]/30 hover:bg-[#dc143c]/[0.04]"
        >

          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#dc143c]/20 bg-[#dc143c]/10 text-lg">
            📐
          </div>

          <h4 className="font-semibold transition-colors group-hover:text-[#dc143c]">
            Image Resizer &amp; Compressor
          </h4>

          <p className="mt-2 text-xs leading-5 text-zinc-500">
            Resize and compress images quickly while keeping them optimized.
          </p>

        </a>

      </div>

    </div>


    {/* FOOTER BOTTOM */}

    <div className="flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#dc143c]/20">

          <img
            src="/logo.png"
            alt="KrishAIWorks"
            className="h-full w-full rounded-full object-cover"
          />

        </div>

        <div>

          <p className="text-sm font-bold">
            KrishAIWorks
          </p>

          <p className="text-xs text-zinc-600">
            AI Solutions That Work
          </p>

        </div>

      </div>

      <p className="text-xs text-zinc-600">
        © {new Date().getFullYear()} KrishAIWorks.
        All rights reserved.
      </p>

    </div>

  </div>

</footer>

    </main>
  );
}