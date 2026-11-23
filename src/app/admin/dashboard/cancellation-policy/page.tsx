import PolicyPageEditor from "@/components/admin/policy-page/PolicyPageEditor";

export default function AdminCancellationPolicyPage() {
  return (
    <PolicyPageEditor
      config={{
        cmsKey: "cancellation-policy",
        label: "取消／退訂規定",
        description:
          "編輯此頁面內容，包含取消／退訂規定與手續費標準，對應前台「旅客須知及服務條款」取消／退訂規定頁籤。",
        sectionsTitle: "取消／退訂規定內容",
        sectionsDescription:
          "編輯旅客解除契約之手續費標準與退費規定，依序對應前台「取消／退訂規定」頁籤的四個段落。",
      }}
    />
  );
}
