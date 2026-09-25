export type DrawerDocument = {
  id: string;
  title: string;
  description: string;
};

export type DownloadLink = {
  id: string;
  label: string;
  url: string;
};

export type DrawerTab = {
  id: string;
  label: string;
  visible: boolean;
  sectionTitle: string;
  documents: DrawerDocument[];
  downloadLinks: DownloadLink[];
};

export type ServiceItem = {
  id: string;
  name: string;
  visible: boolean;
  fields: { label: string; value: string }[];
  drawerTabs: DrawerTab[];
};

function emptyDocuments(prefix: string, count: number): DrawerDocument[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-doc-${i + 1}`,
    title: "",
    description: "",
  }));
}

// 需備資料 has 4 document slots with 2 download links attached to the 3rd slot;
// 辦證須知 and 文件下載 only have 2 document slots and no download links.
function drawerTab(
  partial: Partial<DrawerTab> & { id: string; label: string },
  documentCount = 2
): DrawerTab {
  return {
    visible: true,
    sectionTitle: partial.label,
    documents: emptyDocuments(partial.id, documentCount),
    downloadLinks: [],
    ...partial,
  };
}

export function createServiceItem(id: string, fieldLabels: string[]): ServiceItem {
  return {
    id,
    name: "",
    visible: true,
    fields: fieldLabels.map((label) => ({ label, value: "" })),
    drawerTabs: [
      drawerTab(
        {
          id: `${id}-docs`,
          label: "需備資料",
          downloadLinks: [
            { id: `${id}-docs-link-1`, label: "", url: "" },
            { id: `${id}-docs-link-2`, label: "", url: "" },
          ],
        },
        4
      ),
      drawerTab({ id: `${id}-notice`, label: "辦證須知" }),
      drawerTab({ id: `${id}-download`, label: "文件下載" }),
    ],
  };
}

export const INITIAL_PASSPORT_ITEMS: ServiceItem[] = [
  {
    id: "passport-1",
    name: "中華民國護照｜14 歲以上",
    visible: true,
    fields: [
      { label: "效期", value: "10 年" },
      { label: "辦理天數", value: "11 個工作天" },
      { label: "代辦費用", value: "NT$ 1,800" },
    ],
    drawerTabs: [
      drawerTab({
        id: "passport-1-docs",
        label: "需備資料",
        sectionTitle: "需準備文件清單",
        documents: [
          {
            id: "passport-1-doc-1",
            title: "1. 身分證正本",
            description:
              "若未領身分證者，需附戶口名簿正、影本或3個月內戶籍謄本正本代替，身分證及戶口名簿正本驗畢退還須以外交部實際工作天為主。",
          },
          {
            id: "passport-1-doc-2",
            title: "2. 6 個月內 2吋彩色白底 實體照片1張",
            description:
              "晶片護照照片規格：頭頂到下巴距離需介於3.2公分至3.6公分之間，需露耳朵、眉毛，不可露齒、不可配戴粗框或有色鏡片之眼鏡，不得使用合成照片。",
          },
          {
            id: "passport-1-doc-3",
            title: "3. 委任書",
            description: "依送件方式使用對應表單，可直接下載範本。",
          },
          {
            id: "passport-1-doc-4",
            title: "4. 舊護照正本",
            description: "首次申請免附；換發或部分情況需檢附。",
          },
        ],
        downloadLinks: [
          { id: "passport-1-link-1", label: "下載 D 式委任書", url: "/files/poa-d.pdf" },
          { id: "passport-1-link-2", label: "下載 E 式委任書", url: "/files/poa-e.pdf" },
        ],
      }),
      drawerTab({ id: "passport-1-notice", label: "辦證須知" }),
      drawerTab({ id: "passport-1-submit", label: "文件下載" }),
    ],
  },
  {
    id: "passport-2",
    name: "中華民國護照｜14 歲以上・特急件",
    visible: true,
    fields: [
      { label: "效期", value: "10 年" },
      { label: "辦理天數", value: "" },
      { label: "代辦費用", value: "" },
    ],
    drawerTabs: [
      drawerTab(
        {
          id: "passport-2-docs",
          label: "需備資料",
          downloadLinks: [
            { id: "passport-2-docs-link-1", label: "", url: "" },
            { id: "passport-2-docs-link-2", label: "", url: "" },
          ],
        },
        4
      ),
      drawerTab({ id: "passport-2-notice", label: "辦證須知" }),
      drawerTab({ id: "passport-2-submit", label: "文件下載" }),
    ],
  },
  {
    id: "passport-3",
    name: "中華民國護照｜未滿 14 歲",
    visible: true,
    fields: [
      { label: "效期", value: "" },
      { label: "辦理天數", value: "" },
      { label: "代辦費用", value: "" },
    ],
    drawerTabs: [
      drawerTab(
        {
          id: "passport-3-docs",
          label: "需備資料",
          downloadLinks: [
            { id: "passport-3-docs-link-1", label: "", url: "" },
            { id: "passport-3-docs-link-2", label: "", url: "" },
          ],
        },
        4
      ),
      drawerTab({ id: "passport-3-notice", label: "辦證須知" }),
      drawerTab({ id: "passport-3-submit", label: "文件下載" }),
    ],
  },
  {
    id: "passport-4",
    name: "中華民國護照｜未滿 14 歲・特急件",
    visible: true,
    fields: [
      { label: "效期", value: "" },
      { label: "辦理天數", value: "" },
      { label: "代辦費用", value: "" },
    ],
    drawerTabs: [
      drawerTab(
        {
          id: "passport-4-docs",
          label: "需備資料",
          downloadLinks: [
            { id: "passport-4-docs-link-1", label: "", url: "" },
            { id: "passport-4-docs-link-2", label: "", url: "" },
          ],
        },
        4
      ),
      drawerTab({ id: "passport-4-notice", label: "辦證須知" }),
      drawerTab({ id: "passport-4-submit", label: "文件下載" }),
    ],
  },
  {
    id: "passport-5",
    name: "護照遺失補發／毀損",
    visible: true,
    fields: [
      { label: "效期", value: "" },
      { label: "辦理天數", value: "" },
      { label: "代辦費用", value: "" },
    ],
    drawerTabs: [
      drawerTab(
        {
          id: "passport-5-docs",
          label: "需備資料",
          downloadLinks: [
            { id: "passport-5-docs-link-1", label: "", url: "" },
            { id: "passport-5-docs-link-2", label: "", url: "" },
          ],
        },
        4
      ),
      drawerTab({ id: "passport-5-notice", label: "辦證須知" }),
      drawerTab({ id: "passport-5-submit", label: "文件下載" }),
    ],
  },
];

export const INITIAL_VISA_ITEMS: ServiceItem[] = [
  {
    id: "visa-cn",
    name: "中國台胞證｜五年期",
    visible: true,
    fields: [
      { label: "效期／停留", value: "5 年" },
      { label: "辦理天數", value: "專員確認" },
      { label: "費用", value: "專員報價" },
    ],
    drawerTabs: [
      drawerTab(
        {
          id: "visa-cn-docs",
          label: "需備資料",
          downloadLinks: [
            { id: "visa-cn-docs-link-1", label: "", url: "" },
            { id: "visa-cn-docs-link-2", label: "", url: "" },
          ],
        },
        4
      ),
      drawerTab({
        id: "visa-cn-notice",
        label: "辦證須知",
        sectionTitle: "辦證須知",
        documents: [
          {
            id: "visa-cn-notice-1",
            title: "",
            description:
              "此辦證項目為年滿14歲之申請者辦理\n首次辦理護照需已做人別確認的簡式護照資料表才能代送\n役男【115年度為96年次~79年次出生尚未當兵之男子，含僑民役男】、國軍人員及替代現役出國須申請出境核准\n辦證天數：約 11 個工作天（代辦約加6個工作天）\n辦證費用：TWD 1,800\n入境可停留天數：由移民官決定\n效期及入境次數：以外交部核發為準最長10年\n備註:\n為收齊證件後一日開始申辦證照流程 需要辦理天數為辦證天數加上代辦工作天，不含繳件日及證照寄回指定取件人之日期 如遇特殊原因，將以服務人員與您聯繫為主",
          },
          {
            id: "visa-cn-notice-2",
            title: "委任書",
            description:
              "★護照委任書說明\n‧本人(申請者或監護人)親自送件給旅行社辦證，請填寫『D式委任書』 D式委任書-未成年監護人委任範例：7歲以上未滿18歲且未婚者，由監護人委任旅行社辦證 E式委任書-成年者範例：年滿18歲以上或未滿18歲但已結婚者，本人以複委託方式由親屬、同事、同學委託旅行社辦證 E式委任書-未成年直接委任範例：7歲以上未滿18歲且未婚者，由監護人同意申請人自行以複委託方式由親屬、同事、同學委託旅行社辦證\n‧若申請人為7歲以上未滿18歲且未婚者，可由 -「監護人」委任或以複委託方式送件給旅行社辦證 -或監護人同意「申請者」自行委任或以複委託方式送件給旅行社辦證\n‧若申請人為未滿7歲或受監護宣告者 -只能由「監護人」委任或以複委託方式送件給旅行社辦證",
          },
        ],
      }),
      drawerTab({ id: "visa-cn-submit", label: "文件下載" }),
    ],
  },
  {
    id: "visa-jp",
    name: "日本｜依入境身分確認",
    visible: true,
    fields: [
      { label: "效期／停留", value: "" },
      { label: "辦理天數", value: "" },
      { label: "費用", value: "" },
    ],
    drawerTabs: [
      drawerTab(
        {
          id: "visa-jp-docs",
          label: "需備資料",
          downloadLinks: [
            { id: "visa-jp-docs-link-1", label: "", url: "" },
            { id: "visa-jp-docs-link-2", label: "", url: "" },
          ],
        },
        4
      ),
      drawerTab({ id: "visa-jp-notice", label: "辦證須知" }),
      drawerTab({ id: "visa-jp-submit", label: "文件下載" }),
    ],
  },
  {
    id: "visa-kr",
    name: "韓國｜依入境身分確認",
    visible: true,
    fields: [
      { label: "效期／停留", value: "" },
      { label: "辦理天數", value: "" },
      { label: "費用", value: "" },
    ],
    drawerTabs: [
      drawerTab(
        {
          id: "visa-kr-docs",
          label: "需備資料",
          downloadLinks: [
            { id: "visa-kr-docs-link-1", label: "", url: "" },
            { id: "visa-kr-docs-link-2", label: "", url: "" },
          ],
        },
        4
      ),
      drawerTab({ id: "visa-kr-notice", label: "辦證須知" }),
      drawerTab({ id: "visa-kr-submit", label: "文件下載" }),
    ],
  },
  {
    id: "visa-th",
    name: "泰國｜依最新簽證規定",
    visible: true,
    fields: [
      { label: "效期／停留", value: "" },
      { label: "辦理天數", value: "" },
      { label: "費用", value: "" },
    ],
    drawerTabs: [
      drawerTab(
        {
          id: "visa-th-docs",
          label: "需備資料",
          downloadLinks: [
            { id: "visa-th-docs-link-1", label: "", url: "" },
            { id: "visa-th-docs-link-2", label: "", url: "" },
          ],
        },
        4
      ),
      drawerTab({ id: "visa-th-notice", label: "辦證須知" }),
      drawerTab({ id: "visa-th-submit", label: "文件下載" }),
    ],
  },
  {
    id: "visa-vn",
    name: "越南｜電子簽證",
    visible: true,
    fields: [
      { label: "效期／停留", value: "" },
      { label: "辦理天數", value: "" },
      { label: "費用", value: "" },
    ],
    drawerTabs: [
      drawerTab(
        {
          id: "visa-vn-docs",
          label: "需備資料",
          downloadLinks: [
            { id: "visa-vn-docs-link-1", label: "", url: "" },
            { id: "visa-vn-docs-link-2", label: "", url: "" },
          ],
        },
        4
      ),
      drawerTab({ id: "visa-vn-notice", label: "辦證須知" }),
      drawerTab({ id: "visa-vn-submit", label: "文件下載" }),
    ],
  },
  {
    id: "visa-us",
    name: "美國｜ESTA／美簽",
    visible: true,
    fields: [
      { label: "效期／停留", value: "" },
      { label: "辦理天數", value: "" },
      { label: "費用", value: "" },
    ],
    drawerTabs: [
      drawerTab(
        {
          id: "visa-us-docs",
          label: "需備資料",
          downloadLinks: [
            { id: "visa-us-docs-link-1", label: "", url: "" },
            { id: "visa-us-docs-link-2", label: "", url: "" },
          ],
        },
        4
      ),
      drawerTab({ id: "visa-us-notice", label: "辦證須知" }),
      drawerTab({ id: "visa-us-submit", label: "文件下載" }),
    ],
  },
  {
    id: "visa-ca",
    name: "加拿大｜電子旅行授權／簽證",
    visible: true,
    fields: [
      { label: "效期／停留", value: "" },
      { label: "辦理天數", value: "" },
      { label: "費用", value: "" },
    ],
    drawerTabs: [
      drawerTab(
        {
          id: "visa-ca-docs",
          label: "需備資料",
          downloadLinks: [
            { id: "visa-ca-docs-link-1", label: "", url: "" },
            { id: "visa-ca-docs-link-2", label: "", url: "" },
          ],
        },
        4
      ),
      drawerTab({ id: "visa-ca-notice", label: "辦證須知" }),
      drawerTab({ id: "visa-ca-submit", label: "文件下載" }),
    ],
  },
  {
    id: "visa-au",
    name: "澳洲｜ETA／簽證",
    visible: true,
    fields: [
      { label: "效期／停留", value: "" },
      { label: "辦理天數", value: "" },
      { label: "費用", value: "" },
    ],
    drawerTabs: [
      drawerTab(
        {
          id: "visa-au-docs",
          label: "需備資料",
          downloadLinks: [
            { id: "visa-au-docs-link-1", label: "", url: "" },
            { id: "visa-au-docs-link-2", label: "", url: "" },
          ],
        },
        4
      ),
      drawerTab({ id: "visa-au-notice", label: "辦證須知" }),
      drawerTab({ id: "visa-au-submit", label: "文件下載" }),
    ],
  },
  {
    id: "visa-nz",
    name: "紐西蘭｜NZeTA／簽證",
    visible: true,
    fields: [
      { label: "效期／停留", value: "" },
      { label: "辦理天數", value: "" },
      { label: "費用", value: "" },
    ],
    drawerTabs: [
      drawerTab(
        {
          id: "visa-nz-docs",
          label: "需備資料",
          downloadLinks: [
            { id: "visa-nz-docs-link-1", label: "", url: "" },
            { id: "visa-nz-docs-link-2", label: "", url: "" },
          ],
        },
        4
      ),
      drawerTab({ id: "visa-nz-notice", label: "辦證須知" }),
      drawerTab({ id: "visa-nz-submit", label: "文件下載" }),
    ],
  },
];
