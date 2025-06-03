const StatCard = ({ title, value, iconColorClass, iconBgClass, IconComponent }) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-white/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClass}`}>
          {IconComponent && <IconComponent className={`w-6 h-6 ${iconColorClass}`} />}
        </div>
      </div>
    </div>
  );
};

export default StatCard;    