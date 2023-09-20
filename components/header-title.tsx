const HeaderTitle = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 mt-4">
      <span className="text-3xl md:text-5xl font-bold">發現與分享</span>
      <span className="text-3xl md:text-5xl  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-700 to-orange-400">
        AI 強化提示
      </span>
      <p className="text-sm px-2 md:px-0 md:text-xl ">
        <span className="text-zinc-400  md:text-2xl font-semibold mr-2">
          AIPrompt
        </span>
        是一個開源的人工智慧提示工具
        <br /> 為現代世界提供發現、創建和分享創意提示
      </p>
    </div>
  );
};

export default HeaderTitle;
