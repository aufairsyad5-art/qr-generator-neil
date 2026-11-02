function HistoryList({ items, onSelect }) {
    if (!items || items.length === 0) {
        return (
            <div className="glass-card p-8 text-center" data-name="history-empty" data-file="components/HistoryList.js">
                <div className="icon-clock text-gray-300 text-4xl mb-3 mx-auto"></div>
                <p className="text-gray-400 text-sm italic">Belum ada riwayat pembuatan</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4" data-name="history-list" data-file="components/HistoryList.js">
            {items.map((item) => (
                <div 
                    key={item.id}
                    onClick={() => onSelect(item.config)}
                    className="glass-card p-4 flex items-center gap-4 hover:border-indigo-300 hover:shadow-indigo-50 cursor-pointer group transition-all"
                >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <div className="icon-qr-code text-xl"></div>
                    </div>
                    <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-gray-800 truncate text-sm">
                            {item.text || 'Tanpa teks'}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-medium">
                            {new Date(item.timestamp).toLocaleString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: 'numeric',
                                month: 'short'
                            })}
                        </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="icon-chevron-right text-indigo-400"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}