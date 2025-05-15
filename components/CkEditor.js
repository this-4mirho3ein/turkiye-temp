"use client";

import dynamic from "next/dynamic";
import React from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Dynamic import of CKEditor component
const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false }
);

// Define styles for the editor
const editorStyles = {
  container: {
    direction: "ltr",
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden",
  },
};

// CKEditor wrapper component
const CKEditorWrapper = ({ data, onChange }) => (
  <div className="ckeditor-container" style={editorStyles.container}>
    <style jsx global>{`
      .ck-editor {
        width: 100% !important;
        max-width: 100% !important;
      }
      .ck-editor__editable {
        min-height: 200px;
        max-height: 400px;
        direction: rtl !important;
      }
      .ck-editor__editable_inline {
        overflow-y: auto !important;
        overflow-x: hidden !important;
      }
      .ck.ck-editor__main {
        max-width: 100%;
        overflow-x: hidden !important;
      }
      .ck-content {
        direction: rtl !important;
      }
    `}</style>
    <CKEditor
      editor={ClassicEditor}
      data={data}
      config={{
        toolbar: {
          items: [
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "undo",
            "redo",
          ],
          shouldNotGroupWhenFull: true,
        },
        language: {
          ui: "fa",
          content: "fa",
        },
        alignment: {
          options: ["right", "left", "center", "justify"],
          defaultAlignment: "right",
        },
        typing: {
          direction: "rtl",
        },
        htmlSupport: {
          allow: [
            {
              name: /.*/,
              attributes: {
                dir: ["rtl"],
              },
            },
          ],
        },
        removePlugins: ["Title"],
        width: "100%",
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange("description", data);
      }}
    />
  </div>
);

export default CKEditorWrapper;
