import PolicyPageEditor from "@/components/admin/policy-page/PolicyPageEditor";

export default function AdminAnnouncementsPage() {
  return (
    <PolicyPageEditor
      config={{
        cmsKey: "announcements",
        label: "聲明公告專區",
        description:
          "編輯此頁面內容，包含旅遊警示、個資保護、智慧財產權與其他重要公告，對應前台「旅客須知及服務條款」聲明公告專區頁籤。",
        sectionsTitle: "聲明公告內容",
        sectionsDescription:
          "編輯旅遊警示、個資保護、智慧財產權等公告內容，依序對應前台「聲明公告專區」頁籤的四個段落。",
      }}
    />
  );
}
