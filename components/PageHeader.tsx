interface PageHeaderProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export function PageHeader({
  title,
  subtitle,
  buttonText,
  onButtonClick,
}: PageHeaderProps) {
  return (
    <div
      className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8
        bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
    >
      <div>
        <h1
          className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600
            bg-clip-text text-transparent mb-2"
        >
          {title}
        </h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>

      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3
            rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200
            shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
