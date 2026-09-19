"use client";

type IconProps = { className?: string };

function FlightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M13.3643 9.52749L14.7993 16.0649C14.879 16.4636 14.7196 16.7825 14.4007 17.0216L14.0021 17.1811C13.6034 17.3406 13.2048 17.2608 12.9656 16.9419L10.1753 12.7165L7.78351 14.311V16.7027L6.98625 17.5L5.39175 15.1082L3 13.5137L3.79725 12.7165H6.189L7.78351 10.3247L3.55808 7.53436C3.23918 7.29519 3.15945 6.89656 3.3189 6.49794L3.55808 6.09931C3.71753 5.78041 4.03643 5.62096 4.43505 5.70069L10.9725 7.13574L13.7629 4.34536C14.9588 3.14948 16.5533 2.75086 17.3505 3.14948C17.7491 3.94674 17.3505 5.54124 16.1546 6.73711L13.3643 9.52749Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HighlightsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M10 2.5L11.8 7.2L16.5 9L11.8 10.8L10 15.5L8.2 10.8L3.5 9L8.2 7.2L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DailyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5.2 5.2C6.4 5.2 7.4 4.2 7.4 3C7.4 1.8 6.4 1 5.2 1C4 1 3 1.8 3 3C3 4.2 4 5.2 5.2 5.2ZM14.8 19C16 19 17 18 17 16.8C17 15.6 16 14.6 14.8 14.6C13.6 14.6 12.6 15.6 12.6 16.8C12.6 18 13.6 19 14.8 19Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M5 5.5C6 9 13.5951 4.69015 15.5 8.5C17.4049 12.3098 8.5 13 8 15C7.5 17 9.5 18 12.5 17.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="2.5 2.5"
      />
    </svg>
  );
}

function NoticeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 8.4998V13.9998M10 5.7998H10.01"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShareIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path d="M7 10.5L14.5 5M7 9.5L14.5 15" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 12C6.10457 12 7 11.1046 7 10C7 8.89543 6.10457 8 5 8C3.89543 8 3 8.89543 3 10C3 11.1046 3.89543 12 5 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M15.5 6.5C16.6046 6.5 17.5 5.60457 17.5 4.5C17.5 3.39543 16.6046 2.5 15.5 2.5C14.3954 2.5 13.5 3.39543 13.5 4.5C13.5 5.60457 14.3954 6.5 15.5 6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M15.5 17.5C16.6046 17.5 17.5 16.6046 17.5 15.5C17.5 14.3954 16.6046 13.5 15.5 13.5C14.3954 13.5 13.5 14.3954 13.5 15.5C13.5 16.6046 14.3954 17.5 15.5 17.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function PrintIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path d="M5 2.5H11.5L15.5 6.5V17.5H5V2.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M11.5 2.5V6.5H15.5M7.5 11H13M7.5 14H12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TopIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5 12L10 7L15 12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ANCHORS = [
  { id: "flights", label: "航班資訊", Icon: FlightIcon },
  { id: "highlights", label: "行程特色", Icon: HighlightsIcon },
  { id: "daily", label: "每日安排", Icon: DailyIcon },
  { id: "notice", label: "訂購須知", Icon: NoticeIcon },
] as const;

function AnchorButton({
  Icon,
  label,
  onClick,
  roundedClass = "",
}: {
  Icon: (props: IconProps) => React.ReactElement;
  label: string;
  onClick: () => void;
  roundedClass?: string;
}) {
  return (
    <div className="group relative flex justify-end">
      <span
        className={`pointer-events-none absolute right-full top-1/2 z-20 -mr-px flex h-[50px] -translate-y-1/2 items-center whitespace-nowrap rounded-l-[10px] bg-[#086BD1] px-4 text-[13px] font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100`}
      >
        {label}
      </span>
      <button
        type="button"
        onClick={onClick}
        className={`relative z-10 flex h-[50px] w-14 shrink-0 cursor-pointer items-center justify-center text-[#535F71] transition-colors group-hover:rounded-none group-hover:bg-[#0053E0] group-hover:text-white ${roundedClass}`}
      >
        <Icon className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function StickySideAnchor() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: document.title, url: window.location.href });
        return;
      } catch {
        // user cancelled or share failed, fall back to clipboard
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      window.alert("行程連結已複製");
    }
  };

  return (
    <div className="fixed right-0 top-1/2 z-30 hidden -translate-y-1/2 flex-col rounded-l-[18px] border border-r-0 border-[#E0E3E8] bg-[#FAFAFA] shadow-[0px_10px_28px_0px_rgba(5,20,41,0.08)] lg:flex">
      {ANCHORS.map((anchor, index) => (
        <AnchorButton
          key={anchor.id}
          Icon={anchor.Icon}
          label={anchor.label}
          onClick={() => scrollTo(anchor.id)}
          roundedClass={index === 0 ? "rounded-tl-[18px]" : undefined}
        />
      ))}
      <AnchorButton Icon={ShareIcon} label="分享行程" onClick={handleShare} />
      <AnchorButton Icon={PrintIcon} label="列印 PDF" onClick={() => window.print()} />
      <AnchorButton
        Icon={TopIcon}
        label="TOP"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        roundedClass="rounded-bl-[18px]"
      />
    </div>
  );
}
