type ComingSoonContentProps = {
  title: string;
};

export default function ComingSoonContent({ title }: ComingSoonContentProps) {
  return (
    <div className="flex w-full max-w-[1200px] flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <h2 className="font-serif text-[28px] font-bold text-[#090909] sm:text-4xl">{title}</h2>
      </div>
      <div className="flex min-h-[220px] w-full flex-col items-center justify-center gap-2 rounded-[22px] border border-dashed border-[#C3C6D6] bg-white px-6 py-16 text-center">
        <p className="text-base font-medium text-[#535F71]">內容準備中，敬請期待</p>
        <p className="text-sm text-[#738091]">如需相關資訊，歡迎先聯繫專屬旅遊顧問或客服專線。</p>
      </div>
    </div>
  );
}
