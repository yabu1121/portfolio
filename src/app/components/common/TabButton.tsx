type TabButtonProps<T extends string>= {
  title: T;
  label: string; 
  tab: T;
  setTab:(tab: T) => void;
}

export const TabButton = <T extends string>({
  title, 
  label,
  tab, 
  setTab
}:TabButtonProps<T>) => {
  return (
    <button 
      className={`text-black bg-blue-200 w-1/3 mx-auto h-8 rounded-md font-bold my-2 cursor-pointer ${tab == title && 'bg-blue-400 text-white'}`} 
      onClick={() => setTab(title)}
    >
      {label}
    </button>
  )
}
