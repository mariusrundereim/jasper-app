"use client";

import { Expand, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import { Note } from "../types/notes";
import { useAutosave } from "../hooks/use-autosave";

interface MarkdownEditorProps {
  note: Note;
  onUpdateNote: (note: Partial<Note>) => void;
}

function MarkdownEditor({ note, onUpdateNote }: MarkdownEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [content, setContent] = useState(note.content);
  const [preview, setPreview] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Autosave
  useAutosave(content, (value) => {
    onUpdateNote({ content: value });
  });

  // Process markdown
  const processMarkdown = useCallback(async (markdown: string) => {
    setIsProcessing(true);
    try {
      const result = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(markdown);

      setPreview(result.toString());
    } catch (error) {
      console.error("Error processing markdown:", error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  useEffect(() => {
    processMarkdown(content);
  }, [content, processMarkdown]);

  const editorContent = (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-2">
        <input
          value={note.title}
          onChange={(e) => onUpdateNote({ title: e.target.value })}
          className="max-w-md rounded-md border-transparent bg-transparent px-2 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="rounded-md p-2 hover:bg-gray-100"
        >
          <Expand className="h-4 w-4" />
        </button>
      </div>

      <Tabs.Root defaultValue="code" className="flex-1">
        <Tabs.List className="flex border-b px-2">
          <Tabs.Trigger
            value="code"
            className="px-4 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
          >
            Code
          </Tabs.Trigger>
          <Tabs.Trigger
            value="preview"
            className="px-4 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
          >
            Preview
          </Tabs.Trigger>
        </Tabs.List>

        <div className="flex-1 overflow-auto p-4">
          <Tabs.Content value="code" className="h-full">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-full min-h-[500px] w-full resize-none rounded-md border border-gray-200 bg-gray-50 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your markdown here..."
            />
          </Tabs.Content>

          <Tabs.Content value="preview">
            {isProcessing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div
                className="prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            )}
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );

  if (isFullscreen) {
    return (
      <Dialog.Root open={isFullscreen} onOpenChange={setIsFullscreen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed inset-4 overflow-hidden bg-white">
            {editorContent}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return editorContent;
}

export default MarkdownEditor;
