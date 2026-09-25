import AdminTextInput from "../ui/AdminTextInput";
import RichTextEditor from "../trips/RichTextEditor";
import type { DrawerTab } from "./data";

export default function DrawerTabEditor({
  tab,
  otherTabLabels,
  onChange,
}: {
  tab: DrawerTab;
  otherTabLabels: string[];
  onChange: (patch: Partial<DrawerTab>) => void;
}) {
  const updateDocument = (id: string, patch: Partial<DrawerTab["documents"][number]>) => {
    onChange({
      documents: tab.documents.map((doc) => (doc.id === id ? { ...doc, ...patch } : doc)),
    });
  };

  const updateLink = (id: string, patch: Partial<DrawerTab["downloadLinks"][number]>) => {
    onChange({
      downloadLinks: tab.downloadLinks.map((link) => (link.id === id ? { ...link, ...patch } : link)),
    });
  };

  const thirdDocument = tab.documents[2];

  return (
    <div className="flex flex-col gap-4 rounded-[14px] border border-[#E0E3E8] bg-white p-[18px]">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-bold leading-[1.45em] text-[#090909]">目前編輯：{tab.label}</span>
        {otherTabLabels.length > 0 && (
          <span className="text-xs leading-[1.45em] text-[#535F71]">
            切換上方頁籤即可編輯「{otherTabLabels.join("」「")}」內容
          </span>
        )}
      </div>

      <AdminTextInput
        label="區塊標題"
        value={tab.sectionTitle}
        onChange={(sectionTitle) => onChange({ sectionTitle })}
      />

      {tab.documents.map((doc, index) => (
        <div key={doc.id} className="flex flex-col gap-4 border-t border-[#E0E3E8] pt-4">
          <AdminTextInput
            label={`文件標題 ${index + 1}`}
            value={doc.title}
            onChange={(title) => updateDocument(doc.id, { title })}
          />
          <div className="flex flex-col gap-[7px]">
            <span className="text-sm font-medium leading-[1.45em] text-[#090909]">
              文件說明 {index + 1}
            </span>
            <RichTextEditor
              value={doc.description}
              onChange={(description) => updateDocument(doc.id, { description })}
              placeholder="輸入文件說明"
            />
          </div>

          {doc.id === thirdDocument?.id &&
            tab.downloadLinks.map((link, linkIndex) => (
              <div key={link.id} className="flex gap-4">
                <div className="flex-1">
                  <AdminTextInput
                    label={`下載檔案 ${linkIndex + 1}　標籤文字`}
                    value={link.label}
                    onChange={(label) => updateLink(link.id, { label })}
                  />
                </div>
                <div className="flex-1">
                  <AdminTextInput
                    label={`下載檔案 ${linkIndex + 1}　連結網址`}
                    value={link.url}
                    onChange={(url) => updateLink(link.id, { url })}
                  />
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
