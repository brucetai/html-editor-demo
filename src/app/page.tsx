"use client";

import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

// 動態載入 Monaco Editor（避免 SSR 問題）
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function Home() {
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const [html, setHtml] = useState<string>("");

  // Tiptap 編輯器
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<h2>這是一個可視化/HTML 雙模式編輯器範例</h2><p>你可以在這裡輸入內容，或切換到 HTML 模式直接編輯原始碼。</p>",
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
  });

  // 切換到 HTML 模式時，將 Tiptap 內容同步到 Monaco
  const handleModeChange = (newMode: "visual" | "html") => {
    if (newMode === "html" && editor) {
      setHtml(editor.getHTML());
    }
    setMode(newMode);
  };

  // HTML 編輯器內容變更時，更新 Tiptap
  const handleHtmlChange = (value: string | undefined) => {
    setHtml(value || "");
    if (editor && value !== undefined) {
      editor.commands.setContent(value, false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === "visual" ? "default" : "outline"}
            onClick={() => handleModeChange("visual")}
          >
            可視化編輯
          </Button>
          <Button
            variant={mode === "html" ? "default" : "outline"}
            onClick={() => handleModeChange("html")}
          >
            HTML 編輯
          </Button>
        </div>
        <div className="border rounded min-h-[300px] bg-white">
          {mode === "visual" && editor && (
            <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[300px]" />
          )}
          {mode === "html" && (
            <div className="min-h-[300px]">
              <MonacoEditor
                height="300px"
                defaultLanguage="html"
                value={html}
                onChange={handleHtmlChange}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          )}
        </div>
        <div className="mt-6">
          <h3 className="font-bold mb-2">即時預覽：</h3>
          <div
            className="border rounded p-4 bg-gray-100 min-h-[100px]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </main>
  );
}
