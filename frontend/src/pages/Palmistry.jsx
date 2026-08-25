import React, { useState, useRef } from 'react';
import { Upload, RefreshCw, AlertCircle, Camera } from 'lucide-react';

export default function Palmistry() {
  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);
  const [leftPreviewUrl, setLeftPreviewUrl] = useState(null);
  const [rightPreviewUrl, setRightPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(null);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('left'); // 'left' or 'right'

  const leftFileInputRef = useRef(null);
  const rightFileInputRef = useRef(null);

  const handleFileSelect = (event, side) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size should be less than 10MB');
        return;
      }

      if (side === 'left') {
        setLeftImage(file);
        setLeftPreviewUrl(URL.createObjectURL(file));
      } else {
        setRightImage(file);
        setRightPreviewUrl(URL.createObjectURL(file));
      }

      setReading(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!leftImage || !rightImage) {
      setError("Please upload both Left and Right palm images.");
      return;
    }

    setLoading(true);
    setError(null);
    setReading(null);

    const formData = new FormData();
    formData.append('left_hand', leftImage);
    formData.append('right_hand', rightImage);

    try {
      // Connect to the Python FastAPI backend
      const response = await fetch('/api/palmistry/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData && errorData.detail) {
          throw new Error(errorData.detail);
        }
        throw new Error('Failed to analyze palm. Please try again.');
      }

      const data = await response.json();
      setReading(data);
    } catch (err) {
      console.error('Error during analysis:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setLeftImage(null);
    setRightImage(null);
    setLeftPreviewUrl(null);
    setRightPreviewUrl(null);
    setReading(null);
    setError(null);
    if (leftFileInputRef.current) leftFileInputRef.current.value = '';
    if (rightFileInputRef.current) rightFileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500 mb-4">
            Vedic Palmistry Analysis
          </h1>
          <p className="text-slate-400">
            Upload an image of your palm for an automated astrological reading based on Hast Rekha Shastra.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Upload & Preview */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Left Hand Upload */}
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-amber-100 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-amber-400" /> Left Hand
                </h2>
                {!leftPreviewUrl ? (
                  <div
                    className="border-2 border-dashed border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-slate-700/50 transition-all group h-48"
                    onClick={() => leftFileInputRef.current?.click()}
                  >
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mb-2 group-hover:bg-slate-600 transition-colors">
                      <Upload className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-300 text-center">Click to upload<br />Left Palm</p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-slate-600 bg-black flex justify-center h-48">
                    <img
                      src={leftPreviewUrl}
                      alt="Left Palm Preview"
                      className="h-full object-contain"
                    />
                    <button
                      onClick={() => { setLeftImage(null); setLeftPreviewUrl(null); }}
                      className="absolute top-2 right-2 bg-slate-900/80 hover:bg-rose-600 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors"
                      title="Remove Image"
                    >
                      <AlertCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  ref={leftFileInputRef}
                  onChange={(e) => handleFileSelect(e, 'left')}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
              </div>

              {/* Right Hand Upload */}
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-amber-100 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-amber-400" /> Right Hand
                </h2>
                {!rightPreviewUrl ? (
                  <div
                    className="border-2 border-dashed border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-slate-700/50 transition-all group h-48"
                    onClick={() => rightFileInputRef.current?.click()}
                  >
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mb-2 group-hover:bg-slate-600 transition-colors">
                      <Upload className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-300 text-center">Click to upload<br />Right Palm</p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-slate-600 bg-black flex justify-center h-48">
                    <img
                      src={rightPreviewUrl}
                      alt="Right Palm Preview"
                      className="h-full object-contain"
                    />
                    <button
                      onClick={() => { setRightImage(null); setRightPreviewUrl(null); }}
                      className="absolute top-2 right-2 bg-slate-900/80 hover:bg-rose-600 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors"
                      title="Remove Image"
                    >
                      <AlertCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  ref={rightFileInputRef}
                  onChange={(e) => handleFileSelect(e, 'right')}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
              </div>

            </div>

            <details className="mt-6 bg-slate-700/30 border border-slate-600/50 rounded-xl overflow-hidden group">
              <summary className="p-4 cursor-pointer font-medium text-amber-200 flex items-center gap-2 hover:bg-slate-700/50 transition-colors list-none">
                <Camera className="w-5 h-5 text-amber-400" />
                <span>📸 Photo Guidelines for Best Results</span>
                <span className="ml-auto text-slate-400 group-open:rotate-180 transition-transform duration-200 text-xs">▼</span>
              </summary>
              <div className="p-4 pt-2 text-sm text-slate-300 space-y-2 border-t border-slate-600/30">
                <p><strong className="text-slate-200">☀️ Perfect Lighting:</strong> Use bright, natural daylight or even indoor light. Avoid harsh shadows or flash.</p>
                <p><strong className="text-slate-200">📷 Sharp Focus:</strong> Ensure the camera is perfectly focused so fine lines are clear and not blurry.</p>
                <p><strong className="text-slate-200">🖐️ Complete Frame:</strong> Show the entire hand from the base of the wrist to the very tips of the fingers.</p>
                <p><strong className="text-slate-200">✋ Natural Posture:</strong> Hold hand completely flat with fingers slightly apart. Keep camera directly above.</p>
                <p><strong className="text-slate-200">🎨 Plain Background:</strong> Rest your hand on a plain, dark surface (like a table) so the hand stands out.</p>
              </div>
            </details>

            {error && (
              <div className="mt-6 p-4 bg-rose-900/30 border border-rose-500/50 rounded-lg flex items-start gap-3 text-rose-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!leftImage || !rightImage || loading}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
                ${!leftImage || !rightImage || loading
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white hover:shadow-orange-500/25'
                }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  Analyzing Both Palms...
                </>
              ) : (
                'Analyze Both Palms'
              )}
            </button>
          </div>

          {/* Right Column: Results */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-800 pb-4 border-b border-slate-700 z-10 shrink-0">
              <h2 className="text-xl font-semibold text-amber-100 flex items-center gap-2">
                <span>✨</span> Analysis Results
              </h2>
              {reading && (
                <div className="flex gap-2 bg-slate-900 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('left')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'left' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Left Hand
                  </button>
                  <button
                    onClick={() => setActiveTab('right')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'right' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Right Hand
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              {!reading && !loading && (
                <div className="h-full flex flex-col items-center justify-start text-slate-400 mt-4 pb-20">
                  <div className="text-6xl mb-4">🖐️</div>
                  <p className="text-lg mb-8">Upload a clear image of your palm and click Analyze.</p>

                  <div className="w-full bg-slate-700/30 rounded-xl p-5 border border-slate-600/50">
                    <h3 className="text-amber-300 font-semibold mb-3 border-b border-slate-600/50 pb-2 text-center text-lg">Key Life Topics Analyzed Using Palmistry</h3>
                    <ul className="text-sm space-y-3 text-left">
                      <li><span className="font-semibold text-emerald-300">🔎 Health and Longevity (Ayur):</span> The Life Line (Ayu Rekha) helps evaluate your overall vitality, physical stamina, and major health phases or recovery periods.</li>
                      <li><span className="font-semibold text-amber-200">📊 Wealth and Financial Stability (Vitta):</span> The Fate Line (Bhagya Rekha) and the placement of the Mount of Jupiter or Mercury reveal potential earnings, financial stability, and sources of income.</li>
                      <li><span className="font-semibold text-orange-300">📈 Career and Profession (Karma):</span> The Sun Line (Surya Rekha) and the direction of the Fate Line show your professional success, recognition, business aptitude, or job changes.</li>
                      <li><span className="font-semibold text-teal-300">🏢 Job or Business Preference:</span> Differentiated by the strength of the Fate Line versus the Mercury Line (business aptitude).</li>
                      <li><span className="font-semibold text-blue-300">💡 Mindset and Intelligence (Buddhi):</span> The Head Line (Buddhi Rekha) reflects your thought process, decision-making style, mental focus, and psychological strengths.</li>
                      <li><span className="font-semibold text-pink-300">✨ Relationships and Marriage (Vivaha):</span> The Heart Line (Hridaya Rekha) and small horizontal lines near the edge of the palm under the little finger indicate emotional compatibility, marriage timing, and relationship harmony.</li>
                      <li><span className="font-semibold text-fuchsia-300">💖 Nature of Spouse:</span> Interpreted from the depth and curves of the Heart Line and specific lines on the Mount of Jupiter.</li>
                      <li><span className="font-semibold text-rose-300">💍 Marriage Type (Love vs Arranged):</span> Indicated by lines of influence, crosses on the Mount of Jupiter, and the nature of the Heart Line.</li>
                      <li><span className="font-semibold text-sky-300">👶 Progeny (Number of Children):</span> Read from the fine vertical lines above the marriage lines on the Mount of Mercury.</li>
                      <li><span className="font-semibold text-red-300">🏛️ Government Job / Authority:</span> Assessed via a strong Sun Line (Surya Rekha), a prominent Mount of Jupiter, and specific Fate Line origins.</li>
                      <li><span className="font-semibold text-yellow-400">💰 Dhan Yog (Wealth Combinations):</span> Identified by the Money Triangle formed by the Fate, Head, and Mercury lines.</li>
                      <li><span className="font-semibold text-purple-300">📌 Travel and Foreign Connections (Yatra):</span> Lines moving outward from the Mount of Moon often highlight short journeys, long-distance travel, or settling abroad.</li>
                      <li><span className="font-semibold text-indigo-300">📖 Spiritual Growth and Karma:</span> Special signs like a clear Lotus, Fish, or Temple mark on specific mounts or palms point toward spiritual inclination and higher consciousness.</li>
                      <li><span className="font-semibold text-red-500">⚠️ Challenges in Life if Any:</span> Indicated by breaks, islands, or crosses on major lines and mounts.</li>
                    </ul>
                  </div>
                </div>
              )}

              {loading && (
                <div className="space-y-4 pt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-slate-700/50 rounded-lg p-6">
                      <div className="h-5 bg-slate-600 rounded w-1/3 mb-4"></div>
                      <div className="h-4 bg-slate-600 rounded w-full mb-2"></div>
                      <div className="h-4 bg-slate-600 rounded w-5/6"></div>
                    </div>
                  ))}
                </div>
              )}

              {reading && (() => {
                const currentReading = activeTab === 'left' ? reading.left_hand_reading : reading.right_hand_reading;
                if (!currentReading) return null;

                return (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-5">
                      <h3 className="text-lg font-medium text-emerald-300 mb-2">Overall Summary ({activeTab === 'left' ? 'Left' : 'Right'} Hand)</h3>
                      <p className="text-slate-300 leading-relaxed">{currentReading.overall_summary}</p>
                    </div>

                    {currentReading.key_topics && currentReading.key_topics.length > 0 && (
                      <div className="grid gap-4">
                        <h3 className="text-lg font-medium text-amber-300 mt-2 border-b border-slate-700 pb-2">Key Life Topics Analyzed</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentReading.key_topics.map((topic, idx) => (
                            <div key={idx} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 flex flex-col">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{topic.icon}</span>
                                <h4 className="font-semibold text-amber-100 text-md leading-tight">{topic.topic}</h4>
                              </div>
                              <p className="text-slate-300 mt-1 text-sm">{topic.interpretation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid gap-4">
                      <h3 className="text-lg font-medium text-amber-200 mt-2 border-b border-slate-700 pb-2">Major Lines</h3>
                      {currentReading.lines?.map((line, idx) => (
                        <div key={idx} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded bg-blue-900/50 flex items-center justify-center text-blue-300">
                              〰️
                            </div>
                            <h4 className="font-semibold text-blue-200 text-lg">{line.name}</h4>
                          </div>
                          <p className="text-slate-300 mt-2">{line.interpretation}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4">
                      <h3 className="text-lg font-medium text-amber-200 mt-4 border-b border-slate-700 pb-2">Planetary Mounts</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentReading.mounts?.map((mount, idx) => (
                          <div key={idx} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                            <h4 className="font-semibold text-purple-300 mb-1">{mount.name}</h4>
                            <p className="text-sm text-slate-300">{mount.interpretation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
