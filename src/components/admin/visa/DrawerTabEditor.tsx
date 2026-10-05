import { Fragment, type ReactNode } from "react";
import AdminTextInput from "../ui/AdminTextInput";
import RichTextEditor from "../trips/RichTextEditor";
import type {
  EditableDetail,
  EditableDownload,
  EditableDownloadDoc,
  EditableNoticeDoc,
  EditableRequiredDoc,
} from "./data";

export type DrawerTabKey = "documents" | "notice" | "downloads";

export const DRAWER_TABS: { key: DrawerTabKey; label: string }[] = [
  { key: "documents", label: "需備資料" },
  { key: "notice", label: "辦證須知" },
  { key: "downloads", label: "文件下載" },
];

/** Rows separated by a divider, as in the design (no divider above the first row). */
function DividedRows<T extends { _id: string }>({
  items,
  render,
}: {
  items: T[];
  render: (item: T, index: number) => ReactNode;
}) {
  return items.map((item, index) => (
    <Fragment key={item._id}>
      {index > 0 && <div className="h-px w-full bg-[#E0E3E8]" />}
      {render(item, index)}
    </Fragment>
  ));
}

function DocDescription({
  index,
  value,
  onChange,
}: {
  index: number;
  value: string;
  onChange: (html: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[7px]">
      <span className="text-sm font-medium leading-[1.45em] text-[#090909]">文件說明 {index + 1}</span>
      <RichTextEditor value={value} onChange={onChange} placeholder="輸入文件說明" />
    </div>
  );
}

export default function DrawerTabEditor({
  tab,
  detail,
  onChange,
}: {
  tab: DrawerTabKey;
  detail: EditableDetail;
  onChange: (patch: Partial<EditableDetail>) => void;
}) {
  const label = DRAWER_TABS.find((t) => t.key === tab)?.label ?? "";
  const otherLabels = DRAWER_TABS.filter((t) => t.key !== tab).map((t) => t.label);

  const updateDoc = (id: string, patch: Partial<EditableRequiredDoc>) => {
    onChange({
      required_docs: detail.required_docs.map((doc) => (doc._id === id ? { ...doc, ...patch } : doc)),
    });
  };

  const updateNoticeDoc = (id: string, patch: Partial<EditableNoticeDoc>) => {
    onChange({
      notice_docs: detail.notice_docs.map((doc) => (doc._id === id ? { ...doc, ...patch } : doc)),
    });
  };

  const updateDownload = (id: string, patch: Partial<EditableDownloadDoc>) => {
    onChange({
      downloads: detail.downloads.map((file) => (file._id === id ? { ...file, ...patch } : file)),
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-[14px] border border-[#E0E3E8] bg-white p-[18px]">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-bold leading-[1.45em] text-[#090909]">目前編輯：{label}</span>
        <span className="text-xs leading-[1.45em] text-[#535F71]">
          切換上方頁籤即可編輯「{otherLabels.join("」「")}」內容
        </span>
      </div>

      {tab === "documents" && (
        <>
          <AdminTextInput
            label="區塊標題"
            value={detail.required_docs_title}
            onChange={(required_docs_title) => onChange({ required_docs_title })}
          />
          <DividedRows
            items={detail.required_docs}
            render={(doc, index) => (
              <>
                <AdminTextInput
                  label={`文件標題 ${index + 1}`}
                  value={doc.title}
                  onChange={(title) => updateDoc(doc._id, { title })}
                />
                <DocDescription
                  index={index}
                  value={doc.body_html}
                  onChange={(body_html) => updateDoc(doc._id, { body_html })}
                />
                {doc.downloads.length > 0 && (
                  <DocLinks files={doc.downloads} onChange={(downloads) => updateDoc(doc._id, { downloads })} />
                )}
              </>
            )}
          />
        </>
      )}

      {tab === "notice" && (
        <>
          <AdminTextInput
            label="區塊標題"
            value={detail.notice_title}
            onChange={(notice_title) => onChange({ notice_title })}
          />
          <DividedRows
            items={detail.notice_docs}
            render={(doc, index) => (
              <>
                <AdminTextInput
                  label={`文件標題 ${index + 1}`}
                  value={doc.title}
                  onChange={(title) => updateNoticeDoc(doc._id, { title })}
                />
                <DocDescription
                  index={index}
                  value={doc.body_html}
                  onChange={(body_html) => updateNoticeDoc(doc._id, { body_html })}
                />
              </>
            )}
          />
        </>
      )}

      {tab === "downloads" && (
        <DividedRows
          items={detail.downloads}
          render={(file, index) => (
            <>
              <AdminTextInput
                label={`文件標題 ${index + 1}`}
                value={file.title}
                onChange={(title) => updateDownload(file._id, { title })}
              />
              <AdminTextInput
                label={`文件說明 ${index + 1}`}
                value={file.description}
                onChange={(description) => updateDownload(file._id, { description })}
              />
              <LinkFields
                index={index}
                file={file}
                onChange={(patch) => updateDownload(file._id, patch)}
              />
            </>
          )}
        />
      )}
    </div>
  );
}

function LinkFields({
  index,
  file,
  onChange,
}: {
  index: number;
  file: EditableDownload;
  onChange: (patch: Partial<EditableDownload>) => void;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <AdminTextInput
          label={`下載檔案 ${index + 1}　標籤文字`}
          value={file.label}
          onChange={(label) => onChange({ label })}
        />
      </div>
      <div className="flex-1">
        <AdminTextInput
          label={`下載檔案 ${index + 1}　連結網址`}
          value={file.url}
          // A hand-typed URL no longer points at the uploaded media item.
          onChange={(url) => onChange({ url, media_id: null })}
        />
      </div>
    </div>
  );
}

function DocLinks({
  files,
  onChange,
}: {
  files: EditableDownload[];
  onChange: (files: EditableDownload[]) => void;
}) {
  return files.map((file, index) => (
    <LinkFields
      key={file._id}
      index={index}
      file={file}
      onChange={(patch) => onChange(files.map((f) => (f._id === file._id ? { ...f, ...patch } : f)))}
    />
  ));
}
