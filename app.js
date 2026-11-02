// Important: DO NOT remove this ErrorBoundary component.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-3xl shadow-2xl">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="icon-circle-alert text-4xl text-red-500"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Waduh, ada masalah!</h1>
            <p className="text-gray-600 mb-6">Terjadi kesalahan tak terduga dalam aplikasi.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [qrConfig, setQrConfig] = React.useState({
    text: 'Selamat datang di QR Gratis!',
    color: '#000000',
    backgroundColor: '#ffffff',
    size: 512,
    margin: 4,
    logo: null,
    labels: {
        top: '',
        bottom: '',
        left: '',
        right: ''
    }
  });

  const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
    // Load history from Trickle Database in real app, here we use local storage for demo fallback if needed
    // But prioritized using Trickle API if requested.
    const saved = localStorage.getItem('qr_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleGenerate = async (config, saveToHistory = true) => {
    try {
        setQrConfig(config);

        if (!saveToHistory) return;
        
        // Add to history
        const newEntry = {
            id: Date.now(),
            text: config.text,
            timestamp: new Date().toISOString(),
            config: config
        };
        
        const updatedHistory = [newEntry, ...history.slice(0, 9)];
        setHistory(updatedHistory);
        localStorage.setItem('qr_history', JSON.stringify(updatedHistory));
    } catch (error) {
        console.error('Generation logic error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" data-name="app" data-file="app.js">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7 space-y-8">
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <div className="icon-settings text-white text-xl"></div>
                        </div>
                        <h2 className="text-2xl font-bold">Kustomisasi QR</h2>
                    </div>
                    <GeneratorForm onGenerate={handleGenerate} initialValues={qrConfig} />
                </section>
                
                <section className="hidden lg:block">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                            <div className="icon-clock text-white text-xl"></div>
                        </div>
                        <h2 className="text-2xl font-bold">Riwayat Terakhir</h2>
                    </div>
                    <HistoryList items={history} onSelect={setQrConfig} />
                </section>
            </div>

            {/* Right Column: Preview */}
            <div className="lg:col-span-5">
                <div className="sticky top-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <div className="icon-eye text-white text-xl"></div>
                        </div>
                        <h2 className="text-2xl font-bold">Preview & Download</h2>
                    </div>
                    <QRCodeDisplay config={qrConfig} />
                    
                    {/* Mobile History */}
                    <section className="lg:hidden mt-12">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                                <div className="icon-clock text-white text-xl"></div>
                            </div>
                            <h2 className="text-2xl font-bold">Riwayat Terakhir</h2>
                        </div>
                        <HistoryList items={history} onSelect={setQrConfig} />
                    </section>
                </div>
            </div>

        </div>
      </main>

      <footer className="bg-white border-t py-12 text-center">
        <div className="mb-4">
            <span className="text-xl font-black text-indigo-900">QR<span className="text-indigo-500"> Gratis</span></span>
        </div>
        <p className="text-gray-400 text-sm font-medium">© 2026 Neil Irsyad Aufa</p>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);