import { notFound } from "next/navigation";

/** 「取消／退訂規定」改為前台寫死（src/components/terms/staticPolicyPages.ts），後台設定頁停用。 */
export default function AdminCancellationPolicyPage() {
  notFound();
}

// 原本的後台設定頁（恢復時取消註解並移除上方的 notFound）：
// import PolicyPageEditor from "@/components/admin/policy-page/PolicyPageEditor";
//
// export default function AdminCancellationPolicyPage() {
//   return (
//     <PolicyPageEditor
//       config={{
//         cmsKey: "cancellation-policy",
//         label: "取消／退訂規定",
//         description:
//           "編輯此頁面內容，包含取消／退訂規定與手續費標準，對應前台「旅客須知及服務條款」取消／退訂規定頁籤。",
//         sectionsTitle: "取消／退訂規定內容",
//         sectionsDescription:
//           "編輯旅客解除契約之手續費標準與退費規定，依序對應前台「取消／退訂規定」頁籤的四個段落。",
//       }}
//     />
//   );
// }
