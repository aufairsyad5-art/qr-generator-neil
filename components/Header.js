function Header() {
  return (
    <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b" data-name="header" data-file="components/Header.js">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.href = 'index.html'}>
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
                    <div className="icon-qr-code text-white text-2xl"></div>
                </div>
                <div>
                    <h1 className="text-xl font-black text-indigo-900 leading-tight">QR<span className="text-indigo-500"> Gratis</span></h1>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Advanced QR Engine</p>
                    <p className="text-[10px] tracking-wide text-indigo-600 font-semibold">Neil Irsyad</p>
                </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
                {/* Navigasi telah dihapus sesuai permintaan */}
            </nav>

            <div className="flex items-center gap-4">
                {/* Bagian donasi dan profil telah dihapus sesuai permintaan */}
            </div>
        </div>
    </header>
  );
}