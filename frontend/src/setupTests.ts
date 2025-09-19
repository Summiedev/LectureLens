import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

vi.mock("react-pdf", () => {
  return {
    Document: ({ children }: React.PropsWithChildren) =>
      React.createElement("div", { "data-testid": "pdf-doc" }, children),
    Page: () => React.createElement("div", { "data-testid": "pdf-page" }),
    pdfjs: { GlobalWorkerOptions: { workerSrc: "" } }, // satisfies imports
  };
});

// Optional: minimal DOMMatrix shim (not used when react-pdf is mocked)
if (!("DOMMatrix" in globalThis)) {
  // @ts-expect-error blah
  globalThis.DOMMatrix = class DOMMatrix {};
}
