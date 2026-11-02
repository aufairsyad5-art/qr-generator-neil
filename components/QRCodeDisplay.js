function QRCodeDisplay({ config }) {
    const canvasRef = React.useRef(null);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [copyStatus, setCopyStatus] = React.useState('');

    const getContrastText = (hexColor) => {
        const hex = hexColor.replace('#', '');
        const red = parseInt(hex.substring(0, 2), 16);
        const green = parseInt(hex.substring(2, 4), 16);
        const blue = parseInt(hex.substring(4, 6), 16);
        const luminance = ((red * 299) + (green * 587) + (blue * 114)) / 1000;
        return luminance > 155 ? '#000000' : '#ffffff';
    };

    React.useEffect(() => {
        if (!config.text) return;
        
        const generateQR = async () => {
            try {
                setIsGenerating(true);
                
                const QRCodeLib = window.QRCode;
                if (!QRCodeLib) {
                    throw new Error('Pustaka QR Code belum siap.');
                }

                const qrSize = 512;
                const labelPadding = 80;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                
                // Temporary canvas for QR only
                const tempCanvas = document.createElement('canvas');
                await QRCodeLib.toCanvas(tempCanvas, config.text, {
                    width: qrSize,
                    margin: config.margin || 4,
                    color: {
                        dark: config.color || '#000000',
                        light: config.backgroundColor || '#ffffff'
                    },
                    errorCorrectionLevel: 'H'
                });

                // Calculate final dimensions based on which labels are present
                const extraLeft = config.labels?.left ? labelPadding : 0;
                const extraRight = config.labels?.right ? labelPadding : 0;
                const extraTop = config.labels?.top ? labelPadding : 0;
                const extraBottom = config.labels?.bottom ? labelPadding : 0;
                
                canvas.width = qrSize + extraLeft + extraRight;
                canvas.height = qrSize + extraTop + extraBottom;

                // Draw Background
                ctx.fillStyle = config.backgroundColor || '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw QR Code centered in the remaining space
                const qrX = extraLeft;
                const qrY = extraTop;
                ctx.drawImage(tempCanvas, qrX, qrY);

                // Setup Font
                ctx.font = 'bold 24px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const labelColor = config.color || '#000000';
                const textColor = getContrastText(labelColor);

                // Render Labels
                if (config.labels?.top) {
                    ctx.fillStyle = labelColor;
                    ctx.fillRect(0, 0, canvas.width, labelPadding);
                    ctx.fillStyle = textColor;
                    ctx.fillText(config.labels.top, canvas.width / 2, labelPadding / 2);
                }
                
                if (config.labels?.bottom) {
                    ctx.fillStyle = labelColor;
                    ctx.fillRect(0, canvas.height - labelPadding, canvas.width, labelPadding);
                    ctx.fillStyle = textColor;
                    ctx.fillText(config.labels.bottom, canvas.width / 2, canvas.height - (labelPadding / 2));
                }

                if (config.labels?.left) {
                    ctx.fillStyle = labelColor;
                    ctx.fillRect(0, 0, labelPadding, canvas.height);
                    ctx.fillStyle = textColor;
                    ctx.save();
                    ctx.translate(labelPadding / 2, canvas.height / 2);
                    ctx.rotate(-Math.PI / 2);
                    ctx.fillText(config.labels.left, 0, 0);
                    ctx.restore();
                }

                if (config.labels?.right) {
                    ctx.fillStyle = labelColor;
                    ctx.fillRect(canvas.width - labelPadding, 0, labelPadding, canvas.height);
                    ctx.fillStyle = textColor;
                    ctx.save();
                    ctx.translate(canvas.width - (labelPadding / 2), canvas.height / 2);
                    ctx.rotate(Math.PI / 2);
                    ctx.fillText(config.labels.right, 0, 0);
                    ctx.restore();
                }

                // Draw logo if exists
                if (config.logo) {
                    const img = new Image();
                    await new Promise((resolve, reject) => {
                        img.onload = () => {
                            const logoSize = qrSize * 0.22;
                            const x = qrX + (qrSize - logoSize) / 2;
                            const y = qrY + (qrSize - logoSize) / 2;
                            
                            ctx.fillStyle = config.backgroundColor || '#ffffff';
                            const padding = 6;
                            ctx.beginPath();
                            ctx.roundRect(x - padding, y - padding, logoSize + (padding * 2), logoSize + (padding * 2), 8);
                            ctx.fill();
                            
                            ctx.drawImage(img, x, y, logoSize, logoSize);
                            resolve();
                        };
                        img.onerror = reject;
                        img.src = config.logo;
                    });
                }
            } catch (error) {
                console.error('QR Generation error:', error);
            } finally {
                setIsGenerating(false);
            }
        };

        const timer = setTimeout(generateQR, 200);
        return () => clearTimeout(timer);
    }, [config]);

    const handleDownload = (format) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const link = document.createElement('a');
        link.download = `qrcode-${Date.now()}.${format}`;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();
    };

    const handleCopy = async () => {
        try {
            if (!navigator.clipboard || !window.ClipboardItem) {
                throw new Error('Clipboard API tidak tersedia.');
            }

            const blob = await new Promise((resolve, reject) => {
                canvasRef.current.toBlob((result) => result ? resolve(result) : reject(new Error('Gagal membuat gambar.')), 'image/png');
            });
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            setCopyStatus('Tersalin');
        } catch (error) {
            console.error('Failed to copy image:', error);
            setCopyStatus('Gagal menyalin');
        }
        setTimeout(() => setCopyStatus(''), 2200);
    };

    if (!config.text) {
        return (
            <div className="glass-card p-12 flex flex-col items-center justify-center border-dashed border-2 border-indigo-200 bg-indigo-50/20" data-name="qr-display-empty" data-file="components/QRCodeDisplay.js">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-6 animate-pulse">
                    <div className="icon-qr-code text-indigo-300 text-5xl"></div>
                </div>
                <h3 className="text-lg font-bold text-indigo-900 mb-2">Siap untuk Dibuat</h3>
                <p className="text-gray-500 text-center text-sm">Masukkan teks atau URL untuk melihat preview QR Code Anda secara ajaib!</p>
            </div>
        );
    }

    return (
        <div className="glass-card overflow-hidden" data-name="qr-display" data-file="components/QRCodeDisplay.js">
            <div className="p-8 md:p-12 bg-gray-50/50 flex flex-col items-center justify-center relative min-h-[400px]">
                {isGenerating && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                )}
                <div className="relative p-12 bg-white rounded-[3rem] shadow-2xl ring-12 ring-gray-100 border-8 border-black/5 group overflow-hidden flex flex-col items-center justify-center">
                    <div className="absolute top-0 left-0 w-20 h-20 border-t-8 border-l-8 border-black rounded-tl-[2.5rem]"></div>
                    <div className="absolute top-0 right-0 w-20 h-20 border-t-8 border-r-8 border-black rounded-tr-[2.5rem]"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 border-b-8 border-l-8 border-black rounded-bl-[2.5rem]"></div>
                    <div className="absolute bottom-0 right-0 w-20 h-20 border-b-8 border-r-8 border-black rounded-br-[2.5rem]"></div>
                    
                    <canvas ref={canvasRef} className="max-w-full h-auto rounded-2xl relative z-10 shadow-sm" style={{ width: '100%', maxWidth: '280px' }}></canvas>
                </div>
            </div>
            
            <div className="p-6 border-t bg-white">
                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={() => handleDownload('png')}
                        className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
                    >
                        <div className="icon-download"></div>
                        PNG
                    </button>
                    <button 
                        onClick={() => handleDownload('jpeg')}
                        className="flex-1 bg-indigo-50 text-indigo-600 px-4 py-3 rounded-xl font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <div className="icon-image"></div>
                        JPG
                    </button>
                    <button 
                        onClick={handleCopy}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                        title={copyStatus || 'Salin Gambar'}
                    >
                        <div className={copyStatus === 'Tersalin' ? 'icon-check' : 'icon-copy'}></div>
                    </button>
                </div>
                {copyStatus && <p className="mt-3 text-center text-xs font-semibold text-gray-500">{copyStatus}</p>}
                <div className="mt-6 pt-4 border-t border-gray-50 flex flex-col items-center">
                    <div className="text-[12px] text-indigo-600 font-black tracking-widest uppercase mb-1">Neil Irsyad Aufa</div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] flex items-center gap-1">
                        <div className="icon-shield-check text-green-500 text-[12px]"></div>
                        Premium Quality QR
                    </div>
                </div>
            </div>
        </div>
    );
}