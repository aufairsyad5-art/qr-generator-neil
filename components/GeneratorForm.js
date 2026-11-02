function GeneratorForm({ onGenerate, initialValues }) {
    const [form, setForm] = React.useState(initialValues);
    const [activeTab, setActiveTab] = React.useState('text');
    const [emailFields, setEmailFields] = React.useState({ to: '', subject: '', body: '' });
    const [wifiFields, setWifiFields] = React.useState({ ssid: '', password: '', encryption: 'WPA', hidden: false });

    React.useEffect(() => {
        setForm(initialValues);
    }, [initialValues]);

    const isColor = (value) => /^#[0-9a-f]{6}$/i.test(value);

    const buildEmailContent = (fields) => {
        const params = new URLSearchParams();
        if (fields.subject) params.set('subject', fields.subject);
        if (fields.body) params.set('body', fields.body);
        return `mailto:${fields.to}${params.toString() ? `?${params.toString()}` : ''}`;
    };

    const buildWifiContent = (fields) => {
        const escapeWifi = (value) => String(value).replace(/[\\;,:]/g, (character) => `\\${character}`);
        return `WIFI:T:${fields.encryption};S:${escapeWifi(fields.ssid)};P:${escapeWifi(fields.password)};H:${fields.hidden ? 'true' : 'false'};;`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        let newForm;
        if (name.startsWith('label_')) {
            const labelKey = name.replace('label_', '');
            newForm = { 
                ...form, 
                labels: { ...form.labels, [labelKey]: value } 
            };
        } else {
            newForm = { ...form, [name]: value };
        }
        
        setForm(newForm);
        if (!['color', 'backgroundColor'].includes(name) || isColor(value)) {
            onGenerate(newForm, false);
        }
    };

    const handleStructuredChange = (type, field, value) => {
        if (type === 'email') {
            const nextFields = { ...emailFields, [field]: value };
            setEmailFields(nextFields);
            const newForm = { ...form, text: buildEmailContent(nextFields) };
            setForm(newForm);
            onGenerate(newForm, false);
            return;
        }

        const nextFields = { ...wifiFields, [field]: value };
        setWifiFields(nextFields);
        const newForm = { ...form, text: buildWifiContent(nextFields) };
        setForm(newForm);
        onGenerate(newForm, false);
    };

    const handleTextSubmit = (e) => {
        e.preventDefault();
        onGenerate(form);
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                const newForm = { ...form, logo: readerEvent.target.result };
                setForm(newForm);
                onGenerate(newForm, false);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="glass-card p-6 md:p-8" data-name="generator-form" data-file="components/GeneratorForm.js">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-8 overflow-x-auto no-scrollbar">
                <button 
                    type="button"
                    onClick={() => setActiveTab('text')}
                    className={`tab-btn flex-1 whitespace-nowrap ${activeTab === 'text' ? 'tab-btn-active shadow-sm bg-white' : 'tab-btn-inactive'}`}
                >
                    <div className="icon-text mr-2 inline-block align-middle"></div>
                    Teks / URL
                </button>
                <button 
                    type="button"
                    onClick={() => setActiveTab('email')}
                    className={`tab-btn flex-1 whitespace-nowrap ${activeTab === 'email' ? 'tab-btn-active shadow-sm bg-white' : 'tab-btn-inactive'}`}
                >
                    <div className="icon-mail mr-2 inline-block align-middle"></div>
                    Email
                </button>
                <button 
                    type="button"
                    onClick={() => setActiveTab('wifi')}
                    className={`tab-btn flex-1 whitespace-nowrap ${activeTab === 'wifi' ? 'tab-btn-active shadow-sm bg-white' : 'tab-btn-inactive'}`}
                >
                    <div className="icon-wifi mr-2 inline-block align-middle"></div>
                    WiFi
                </button>
            </div>

            <form onSubmit={handleTextSubmit} className="space-y-6">
                {activeTab === 'text' && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Konten QR Code</label>
                        <textarea 
                            name="text"
                            value={form.text}
                            onChange={handleChange}
                            placeholder="Masukkan URL atau teks di sini..."
                            className="input-field min-h-[120px] resize-none"
                        />
                    </div>
                )}

                {activeTab === 'email' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Alamat email</label>
                            <input type="email" value={emailFields.to} onChange={(e) => handleStructuredChange('email', 'to', e.target.value)} placeholder="nama@contoh.com" className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Subjek</label>
                            <input type="text" value={emailFields.subject} onChange={(e) => handleStructuredChange('email', 'subject', e.target.value)} placeholder="Subjek email" className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Pesan</label>
                            <textarea value={emailFields.body} onChange={(e) => handleStructuredChange('email', 'body', e.target.value)} placeholder="Isi pesan email" className="input-field min-h-[100px] resize-none" />
                        </div>
                    </div>
                )}

                {activeTab === 'wifi' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nama jaringan (SSID)</label>
                            <input type="text" value={wifiFields.ssid} onChange={(e) => handleStructuredChange('wifi', 'ssid', e.target.value)} placeholder="Nama WiFi" className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Keamanan</label>
                            <select value={wifiFields.encryption} onChange={(e) => handleStructuredChange('wifi', 'encryption', e.target.value)} className="input-field">
                                <option value="WPA">WPA / WPA2 / WPA3</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">Tanpa password</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <input type="text" value={wifiFields.password} onChange={(e) => handleStructuredChange('wifi', 'password', e.target.value)} placeholder="Password WiFi" className="input-field" disabled={wifiFields.encryption === 'nopass'} />
                        </div>
                        <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                            <input type="checkbox" checked={wifiFields.hidden} onChange={(e) => handleStructuredChange('wifi', 'hidden', e.target.checked)} className="h-4 w-4 accent-indigo-600" />
                            Jaringan tersembunyi
                        </label>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Warna QR</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="color" 
                                name="color"
                                value={form.color}
                                onChange={handleChange}
                                className="w-12 h-12 rounded-lg cursor-pointer border-none p-0 overflow-hidden" 
                            />
                            <input 
                                type="text" 
                                name="color"
                                value={form.color}
                                onChange={handleChange}
                                className="input-field flex-grow py-2.5 font-mono text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Background</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="color" 
                                name="backgroundColor"
                                value={form.backgroundColor}
                                onChange={handleChange}
                                className="w-12 h-12 rounded-lg cursor-pointer border-none p-0 overflow-hidden" 
                            />
                            <input 
                                type="text" 
                                name="backgroundColor"
                                value={form.backgroundColor}
                                onChange={handleChange}
                                className="input-field flex-grow py-2.5 font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Label Teks (Sekeliling QR)</label>
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Atas</span>
                            <input 
                                type="text" 
                                name="label_top"
                                value={form.labels.top}
                                onChange={handleChange}
                                placeholder="Teks atas..."
                                className="input-field py-2 text-sm"
                            />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Bawah</span>
                            <input 
                                type="text" 
                                name="label_bottom"
                                value={form.labels.bottom}
                                onChange={handleChange}
                                placeholder="Teks bawah..."
                                className="input-field py-2 text-sm"
                            />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Kiri</span>
                            <input 
                                type="text" 
                                name="label_left"
                                value={form.labels.left}
                                onChange={handleChange}
                                placeholder="Teks kiri..."
                                className="input-field py-2 text-sm"
                            />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Kanan</span>
                            <input 
                                type="text" 
                                name="label_right"
                                value={form.labels.right}
                                onChange={handleChange}
                                placeholder="Teks kanan..."
                                className="input-field py-2 text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tambahkan Logo (Opsional)</label>
                    <div className="relative group">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="border-2 border-dashed border-gray-300 rounded-xl py-6 flex flex-col items-center justify-center group-hover:border-indigo-400 transition-colors bg-gray-50/50">
                            {form.logo ? (
                                <div className="flex items-center gap-3">
                                    <img src={form.logo} alt="Logo" className="w-10 h-10 object-contain rounded" />
                                    <span className="text-sm font-medium text-green-600">Logo terpasang!</span>
                                    <button 
                                        type="button"
                                        onClick={() => { const newForm = {...form, logo: null}; setForm(newForm); onGenerate(newForm, false); }}
                                        className="text-red-500 hover:text-red-700 z-20"
                                    >
                                        <div className="icon-x"></div>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="icon-image text-gray-400 text-3xl mb-2"></div>
                                    <span className="text-gray-500 text-sm">Klik atau seret file logo di sini</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" className="btn-primary w-full py-4 text-lg font-bold">
                        <div className="icon-wand-sparkles"></div>
                        Generate QR Code
                    </button>
                </div>
            </form>
        </div>
    );
}