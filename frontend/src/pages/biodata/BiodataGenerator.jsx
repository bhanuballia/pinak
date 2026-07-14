import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import PlaceAutocomplete from '../../components/PlaceAutocomplete';

const BiodataGenerator = () => {
   const [step, setStep] = useState(1);
   const [isGenerating, setIsGenerating] = useState(false);
   const pdfRef = useRef();

   const [formData, setFormData] = useState({
      // Personal
      fullName: '',
      gender: 'Male',
      height: '',
      complexion: '',
      education: '',
      profession: '',
      annualIncome: '',
      religion: '',
      caste: '',
      languages: '',
      bloodGroup: '',

      // Family
      fatherName: '',
      fatherOccupation: '',
      motherName: '',
      motherOccupation: '',
      gotra: '',
      elderSibling: '',
      elderSiblingMarried: '',
      youngerSibling: '',
      siblingNameOccupation: '',
      familyStatus: '',

      // Birth Details
      birthDate: '',
      birthTime: '',
      lat: null,
      lng: null,
      locationName: '',

      // Contact Details
      contactPerson: '',
      contactNumber: '',
      emailId: '',
      residentialAddress: ''
   });

   const [astroData, setAstroData] = useState(null);
   const [isLoadingAstro, setIsLoadingAstro] = useState(false);

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const fetchAstroData = async () => {
      if (!formData.birthDate || !formData.birthTime || !formData.lat) return;

      setIsLoadingAstro(true);
      try {
         const res = await fetch('http://localhost:8000/api/biodata/astro-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               birth_date: formData.birthDate,
               birth_time: formData.birthTime,
               latitude: formData.lat,
               longitude: formData.lng
            })
         });
         const data = await res.json();
         setAstroData(data);
         setStep(2);
      } catch (err) {
         console.error(err);
         alert("Failed to fetch astrological data. Please try again.");
      }
      setIsLoadingAstro(false);
   };

   const generatePDF = async () => {
      const element = pdfRef.current;
      if (!element) return;

      setIsGenerating(true);
      try {
         // Scale for better quality
         const canvas = await html2canvas(element, { scale: 2, useCORS: true });
         const imgData = canvas.toDataURL('image/jpeg', 1.0);

         const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
         });

         const pdfWidth = pdf.internal.pageSize.getWidth();
         const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

         pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
         pdf.save(`${formData.fullName.replace(/\s+/g, '_')}_Biodata.pdf`);
      } catch (error) {
         console.error("PDF generation failed", error);
         alert("Failed to generate PDF.");
      }
      setIsGenerating(false);
   };

   return (
      <div className="min-h-screen bg-[#fdfbf7] p-4 md:p-8 font-sans pb-32">

         {/* Navigation / Header */}
         <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-serif italic text-amber-900">Marriage Biodata Engine</h1>
            {step === 2 && (
               <div className="flex gap-4">
                  <button
                     onClick={() => setStep(1)}
                     className="bg-white border border-amber-200 text-amber-700 px-6 py-2 rounded-full font-bold shadow-sm transition hover:bg-amber-50"
                  >
                     Back to Edit
                  </button>
                  <button
                     onClick={generatePDF}
                     disabled={isGenerating}
                     className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full font-bold shadow-lg transition disabled:opacity-50"
                  >
                     {isGenerating ? 'Generating PDF...' : '📥 Download PDF'}
                  </button>
               </div>
            )}
         </div>

         {step === 1 && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-xl border border-amber-100">
               <h2 className="text-xl font-bold uppercase tracking-widest text-amber-600 mb-8 border-b border-amber-100 pb-4">Create Your Profile</h2>

               <div className="space-y-8">
                  {/* Personal */}
                  <div>
                     <h3 className="text-lg font-serif italic text-slate-800 mb-4">Personal Details</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.fullName} />
                        <select name="gender" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.gender}>
                           <option>Male</option>
                           <option>Female</option>
                        </select>
                        <select name="height" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500 text-slate-600" value={formData.height || ""}>
                           <option value="" disabled>Select Height</option>
                           {Array.from({ length: 37 }, (_, i) => {
                              const feet = Math.floor(i / 12) + 4;
                              const inches = i % 12;
                              const val = `${feet}'${inches}"`;
                              return <option key={val} value={val}>{val}</option>;
                           })}
                        </select>
                        <select name="complexion" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500 text-slate-600" value={formData.complexion || ""}>
                           <option value="" disabled>Select Complexion</option>
                           <option value="Very Fair">Very Fair</option>
                           <option value="Fair">Fair</option>
                           <option value="Wheatish">Wheatish</option>
                           <option value="Wheatish Brown">Wheatish Brown</option>
                           <option value="Dark">Dark</option>
                        </select>
                        <input type="text" name="education" placeholder="Education (e.g. B.Tech)" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500 text-slate-600" value={formData.education} />
                        <input type="text" name="profession" placeholder="Profession" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.profession} />
                        <input type="text" name="annualIncome" placeholder="Annual Income" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.annualIncome} />
                        <input type="text" name="religion" placeholder="Religion (e.g. Hindu)" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.religion} />
                        <input type="text" name="caste" placeholder="Caste" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.caste} />
                        <input type="text" name="languages" placeholder="Languages Known" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.languages} />
                     </div>
                  </div>

                  {/* Family */}
                  <div>
                     <h3 className="text-lg font-serif italic text-slate-800 mb-4">Family Details</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="fatherName" placeholder="Father's Name" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.fatherName} />
                        <input type="text" name="fatherOccupation" placeholder="Father's Occupation" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.fatherOccupation} />
                        <input type="text" name="motherName" placeholder="Mother's Name" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.motherName} />
                        <input type="text" name="motherOccupation" placeholder="Mother's Occupation" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.motherOccupation} />
                        <input type="text" name="gotra" placeholder="Gotra" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.gotra} />
                        <input type="text" name="elderSibling" placeholder="Elder Sibling (e.g. 1 Brother)" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.elderSibling} />
                        <input type="text" name="elderSiblingMarried" placeholder="Elder Sibling Married (e.g. 1)" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.elderSiblingMarried} />
                        <input type="text" name="youngerSibling" placeholder="Younger Sibling (e.g. 1 Sister)" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.youngerSibling} />
                        <input type="text" name="siblingNameOccupation" placeholder="Sibling Name (Occupation)" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.siblingNameOccupation} />
                        <input type="text" name="familyStatus" placeholder="Family Status (e.g. Middle Class)" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.familyStatus} />
                     </div>
                  </div>

                  {/* Birth Info */}
                  <div>
                     <h3 className="text-lg font-serif italic text-slate-800 mb-4">Birth Details (For Auto-Astrology)</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="date" name="birthDate" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.birthDate} />
                        <input type="time" name="birthTime" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.birthTime} />
                        <div className="md:col-span-2">
                           <PlaceAutocomplete
                              onSelect={(place) => setFormData({ ...formData, lat: place.lat, lng: place.lon, locationName: place.display_name })}
                           />
                           {formData.locationName && <p className="text-xs text-amber-600 mt-2 font-bold">Selected: {formData.locationName}</p>}
                        </div>
                     </div>
                  </div>

                  {/* Contact Details */}
                  <div>
                     <h3 className="text-lg font-serif italic text-slate-800 mb-4">Contact Details</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="contactPerson" placeholder="Contact Person" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.contactPerson} />
                        <input type="text" name="contactNumber" placeholder="Contact Number" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.contactNumber} />
                        <input type="email" name="emailId" placeholder="Email ID" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.emailId} />
                        <input type="text" name="residentialAddress" placeholder="Residential Address" onChange={handleChange} className="md:col-span-2 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500" value={formData.residentialAddress} />
                     </div>
                  </div>
               </div>

               <div className="mt-10 text-center">
                  <button
                     onClick={fetchAstroData}
                     disabled={isLoadingAstro || !formData.birthDate || !formData.birthTime || !formData.lat}
                     className="bg-gradient-to-r from-amber-500 to-amber-700 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-lg"
                  >
                     {isLoadingAstro ? 'Calculating Astrology...' : 'Generate Biodata ✨'}
                  </button>
                  {(!formData.birthDate || !formData.birthTime || !formData.lat) && (
                     <p className="text-xs text-red-400 mt-2">Please fill Date, Time, and Location to generate.</p>
                  )}
               </div>
            </div>
         )}

         {step === 2 && astroData && (
            <div className="max-w-[210mm] mx-auto bg-white shadow-2xl relative overflow-hidden" ref={pdfRef} style={{ minHeight: '297mm' }}>

               {/* Aesthetic Background Overlays */}
               <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300"></div>
               <div className="absolute top-4 left-4 right-4 bottom-4 border-[3px] border-amber-100 rounded-xl pointer-events-none"></div>
               <div className="absolute top-6 left-6 right-6 bottom-6 border border-amber-50 rounded-xl pointer-events-none"></div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full -ml-32 -mb-32"></div>

               {/* Content */}
               <div className="relative z-10 p-16">
                  {/* Header */}
                  <div className="text-center mb-12">
                     <div className="text-4xl text-amber-500 mb-4">🕉️</div>
                     <h1 className="text-5xl font-serif italic text-amber-900 mb-2">{formData.fullName}</h1>
                     <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-600">Matrimonial Biodata</p>
                  </div>

                  <div className="grid grid-cols-2 gap-12">
                     {/* Left Column */}
                     <div className="space-y-10">
                        {/* Personal */}
                        <section>
                           <h2 className="text-lg font-black uppercase tracking-widest text-amber-800 border-b border-amber-200 pb-2 mb-4">Personal Details</h2>
                           <table className="w-full text-sm">
                              <tbody>
                                 <tr className="h-8"><td className="font-bold text-slate-500 w-1/3">Height</td><td className="text-slate-800">{formData.height || '-'}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Complexion</td><td className="text-slate-800">{formData.complexion || '-'}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Religion</td><td className="text-slate-800">{formData.religion || '-'}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Caste</td><td className="text-slate-800">{formData.caste || '-'}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Languages</td><td className="text-slate-800">{formData.languages || '-'}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Education</td><td className="text-slate-800">{formData.education || '-'}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Profession</td><td className="text-slate-800">{formData.profession || '-'}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Annual Income</td><td className="text-slate-800">{formData.annualIncome || '-'}</td></tr>
                              </tbody>
                           </table>
                        </section>

                        {/* Birth */}
                        <section>
                           <h2 className="text-lg font-black uppercase tracking-widest text-amber-800 border-b border-amber-200 pb-2 mb-4">Birth Details</h2>
                           <table className="w-full text-sm">
                              <tbody>
                                 <tr className="h-8"><td className="font-bold text-slate-500 w-1/3">Date</td><td className="text-slate-800">{formData.birthDate || '-'}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Time</td><td className="text-slate-800">{formData.birthTime || '-'}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Place</td><td className="text-slate-800">{formData.locationName || '-'}</td></tr>
                              </tbody>
                           </table>
                        </section>
                     </div>

                     {/* Right Column */}
                     <div className="space-y-10">
                        {/* Family */}
                        <section>
                           <h2 className="text-lg font-black uppercase tracking-widest text-amber-800 border-b border-amber-200 pb-2 mb-4">Family Background</h2>
                           <table className="w-full text-sm">
                              <tbody>
                                 <tr className="h-8"><td className="font-bold text-slate-500 w-1/3">Gotra</td><td className="text-slate-800">{formData.gotra || '-'}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Father</td><td className="text-slate-800">{formData.fatherName} {formData.fatherOccupation ? `(${formData.fatherOccupation})` : ''}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Mother</td><td className="text-slate-800">{formData.motherName} {formData.motherOccupation ? `(${formData.motherOccupation})` : ''}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Elder Sibling</td><td className="text-slate-800">{formData.elderSibling || '-'} {formData.elderSiblingMarried ? `(${formData.elderSiblingMarried} Married)` : ''}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Younger Sibling</td><td className="text-slate-800">{formData.youngerSibling || '-'}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Sibling Details</td><td className="text-slate-800">{formData.siblingNameOccupation || '-'}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Status</td><td className="text-slate-800">{formData.familyStatus || '-'}</td></tr>
                              </tbody>
                           </table>
                        </section>

                        {/* Contact Details */}
                        <section>
                           <h2 className="text-lg font-black uppercase tracking-widest text-amber-800 border-b border-amber-200 pb-2 mb-4">Contact Details</h2>
                           <table className="w-full text-sm">
                              <tbody>
                                 <tr className="h-8"><td className="font-bold text-slate-500 w-1/3">Contact Person</td><td className="text-slate-800">{formData.contactPerson || '-'}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Contact No.</td><td className="text-slate-800">{formData.contactNumber || '-'}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Email ID</td><td className="text-slate-800">{formData.emailId || '-'}</td></tr>
                                 <tr className="h-8"><td className="font-bold text-slate-500">Address</td><td className="text-slate-800">{formData.residentialAddress || '-'}</td></tr>
                              </tbody>
                           </table>
                        </section>
                     </div>
                  </div>

                  {/* Astro Synthesis - Full Width */}
                  <section className="mt-12 bg-amber-50/50 p-8 rounded-2xl border border-amber-100">
                     <h2 className="text-lg font-black uppercase tracking-widest text-amber-800 border-b border-amber-200 pb-2 mb-6 text-center">Astrological Profile</h2>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                           <div className="text-[10px] font-black uppercase text-amber-600 mb-1">Rashi</div>
                           <div className="text-lg font-serif italic text-slate-800">{astroData.rashi}</div>
                        </div>
                        <div className="text-center">
                           <div className="text-[10px] font-black uppercase text-amber-600 mb-1">Nakshatra</div>
                           <div className="text-lg font-serif italic text-slate-800">{astroData.nakshatra} (P{astroData.nakshatra_pada})</div>
                        </div>
                        <div className="text-center">
                           <div className="text-[10px] font-black uppercase text-amber-600 mb-1">Gana</div>
                           <div className="text-lg font-serif italic text-slate-800">{astroData.gana}</div>
                        </div>
                        <div className="text-center">
                           <div className="text-[10px] font-black uppercase text-amber-600 mb-1">Nadi</div>
                           <div className="text-lg font-serif italic text-slate-800">{astroData.nadi}</div>
                        </div>
                     </div>

                     <div className="mt-8 text-center">
                        <div className={`inline-block px-6 py-2 rounded-full border text-sm font-bold uppercase tracking-widest ${astroData.is_manglik ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                           {astroData.is_manglik ? '⚠️ Manglik Profile' : '✅ Non-Manglik Profile'}
                        </div>
                     </div>
                  </section>

                </div>
                
                <footer className="w-full text-center py-8 text-slate-500 text-xs font-semibold mt-12 border-t border-slate-100 bg-white">
                   Copyright © 2026 Phanom Technologies. All Rights Reserved
                </footer>
             </div>
          )}
       </div>
    );
};

export default BiodataGenerator;
