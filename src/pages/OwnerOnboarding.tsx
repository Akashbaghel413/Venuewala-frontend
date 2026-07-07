import { useState } from 'react';
import { CheckCircle, ArrowRight, Upload, Building2, User, IndianRupee, FileText, Check, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';

export default function OwnerOnboarding() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber] = useState(() => 'VW-APP-' + Date.now().toString(36).toUpperCase());

  const [business, setBusiness] = useState({ ownerName: '', businessName: '', phone: '', email: '', city: '', gstNumber: '' });
  const [venue, setVenue] = useState({ name: '', type: 'Farmhouse', address: '', pincode: '', capacity: '', description: '' });
  const [documents, setDocuments] = useState<string[]>([]);
  const [bank, setBank] = useState({ holderName: '', accountNumber: '', ifsc: '', bankName: '', branch: '' });

  const stepLabels = ['Business', 'Venue', 'Documents', 'Bank', 'Review'];

  const stepValid = () => {
    if (step === 1) return business.ownerName && business.phone && business.email && business.city;
    if (step === 2) return venue.name && venue.address && venue.pincode && venue.capacity;
    if (step === 3) return true;
    if (step === 4) return bank.holderName && bank.accountNumber && bank.ifsc;
    return true;
  };

  const handleNext = () => {
    if (stepValid()) setStep((s) => Math.min(s + 1, 5));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
        <div className="container-app max-w-lg">
          <div className="rounded-card bg-white p-8 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <CheckCircle className="h-8 w-8 text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-500 mb-4">Your venue has been submitted for verification. We'll review it within 2-3 business days.</p>
            <div className="rounded-input bg-gray-50 border border-gray-200 p-3 mb-6">
              <p className="text-xs text-gray-500 mb-1">Reference Number</p>
              <p className="text-lg font-mono font-semibold text-gray-900">{refNumber}</p>
            </div>

            {/* What happens next timeline */}
            <div className="text-left mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">What happens next?</h3>
              <div className="space-y-4">
                {[
                  { icon: FileText, title: 'Document Verification', desc: 'We verify your documents within 1-2 business days.', active: true },
                  { icon: MapPin, title: 'Venue Visit (Optional)', desc: 'Our team may visit your venue for quality assurance.', active: false },
                  { icon: Check, title: 'Go Live!', desc: 'Once approved, your venue will be visible to thousands of customers.', active: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${item.active ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => { setSubmitted(false); setStep(1); }}>Submit Another</Button>
              <Button variant="primary" onClick={() => window.location.href = '/'}>Go to Home</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-8">
      <div className="container-app py-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">List Your Venue</h1>

        {/* Progress bar with labels */}
        <div className="mb-8">
          <div className="flex items-center justify-between px-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  <div className={`h-8 w-8 flex items-center justify-center rounded-full text-sm font-semibold transition-colors ${step >= s ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {step > s ? <Check className="h-4 w-4" /> : s}
                  </div>
                  {s < 5 && <div className={`flex-1 h-0.5 mx-1 ${step > s ? 'bg-primary-500' : 'bg-gray-200'}`} />}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${step >= s ? 'text-primary-600' : 'text-gray-400'}`}>{stepLabels[s - 1]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card bg-white p-6 shadow-sm">
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold mb-1 flex items-center gap-2"><User className="h-5 w-5 text-primary-500" /> Business Details</h2>
              <p className="text-sm text-gray-500 mb-5">Tell us about yourself and your business.</p>
              <div className="space-y-4">
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Owner Name *</label><input type="text" value={business.ownerName} onChange={(e) => setBusiness({ ...business, ownerName: e.target.value })} placeholder="Full name" className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Business Name</label><input type="text" value={business.businessName} onChange={(e) => setBusiness({ ...business, businessName: e.target.value })} placeholder="Your business / company name" className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Phone *</label><input type="tel" value={business.phone} onChange={(e) => setBusiness({ ...business, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Email *</label><input type="email" value={business.email} onChange={(e) => setBusiness({ ...business, email: e.target.value })} placeholder="you@example.com" className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">City *</label><input type="text" value={business.city} onChange={(e) => setBusiness({ ...business, city: e.target.value })} placeholder="New Delhi" className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">GST Number</label><input type="text" value={business.gstNumber} onChange={(e) => setBusiness({ ...business, gstNumber: e.target.value })} placeholder="07AAACV1234F1Z5" className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm" /></div>
                </div>
              </div>
              <Button variant="primary" className="w-full mt-6" disabled={!stepValid()} onClick={handleNext}>Next: Venue Details <ArrowRight className="h-4 w-4" /></Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold mb-1 flex items-center gap-2"><Building2 className="h-5 w-5 text-primary-500" /> Venue Details</h2>
              <p className="text-sm text-gray-500 mb-5">Tell us about your venue.</p>
              <div className="space-y-4">
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Venue Name *</label><input type="text" value={venue.name} onChange={(e) => setVenue({ ...venue, name: e.target.value })} placeholder="e.g. Green Valley Farmhouse" className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm" /></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Venue Type *</label><select value={venue.type} onChange={(e) => setVenue({ ...venue, type: e.target.value })} className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm"><option>Farmhouse</option><option>Banquet Hall</option><option>Community Centre</option><option>DDA Ground</option><option>Bhavan / Hall</option><option>Mandir</option><option>Dharamshala</option></select></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Full Address *</label><input type="text" value={venue.address} onChange={(e) => setVenue({ ...venue, address: e.target.value })} placeholder="Plot 45, Sector 22, Dwarka" className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Pincode *</label><input type="text" value={venue.pincode} onChange={(e) => setVenue({ ...venue, pincode: e.target.value })} placeholder="110075" className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Capacity *</label><input type="number" value={venue.capacity} onChange={(e) => setVenue({ ...venue, capacity: e.target.value })} placeholder="500" className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm" /></div>
                </div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Description</label><textarea rows={3} value={venue.description} onChange={(e) => setVenue({ ...venue, description: e.target.value })} placeholder="Describe your venue..." className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm resize-none" /></div>
              </div>
              <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button><Button variant="primary" className="flex-1" disabled={!stepValid()} onClick={handleNext}>Next: Documents <ArrowRight className="h-4 w-4" /></Button></div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-1 flex items-center gap-2"><Upload className="h-5 w-5 text-primary-500" /> Documents Upload</h2>
              <p className="text-sm text-gray-500 mb-5">Upload ownership proof and permits for faster verification.</p>
              <div className="space-y-4">
                {[
                  'Ownership Proof (Property Document / Rent Agreement)',
                  'GST Certificate',
                  'Fire NOC',
                  'Any Other Permits',
                ].map((doc, i) => (
                  <div
                    key={i}
                    className="border-2 border-dashed border-gray-200 rounded-input p-4 text-center hover:border-primary-300 transition-colors cursor-pointer"
                    onClick={() => setDocuments((prev) => [...prev, `${doc} (uploaded)`])}
                  >
                    <Upload className="h-6 w-6 text-gray-300 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">{doc}</p>
                    <p className="text-[10px] text-gray-400">PDF, JPG, PNG — max 5MB</p>
                  </div>
                ))}
                {documents.length > 0 && (
                  <div className="rounded-input bg-primary-50 border border-primary-100 p-3">
                    <p className="text-xs font-semibold text-primary-600 mb-1">Uploaded files:</p>
                    {documents.map((d, i) => (
                      <p key={i} className="text-xs text-primary-700 flex items-center gap-1"><Check className="h-3 w-3" />{d}</p>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button><Button variant="primary" className="flex-1" onClick={handleNext}>Next: Bank Details <ArrowRight className="h-4 w-4" /></Button></div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-lg font-semibold mb-1 flex items-center gap-2"><IndianRupee className="h-5 w-5 text-primary-500" /> Bank Details</h2>
              <p className="text-sm text-gray-500 mb-5">Where should we send your payouts?</p>
              <div className="space-y-4">
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Account Holder Name *</label><input type="text" value={bank.holderName} onChange={(e) => setBank({ ...bank, holderName: e.target.value })} placeholder="Name as per bank records" className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm" /></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Account Number *</label><input type="text" value={bank.accountNumber} onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })} placeholder="Bank account number" className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">IFSC Code *</label><input type="text" value={bank.ifsc} onChange={(e) => { setBank({ ...bank, ifsc: e.target.value }); if (e.target.value.length >= 6 && !bank.bankName) setBank((b) => ({ ...b, bankName: 'HDFC Bank' })); }} placeholder="HDFC0004521" className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Bank Name *</label><input type="text" value={bank.bankName} onChange={(e) => setBank({ ...bank, bankName: e.target.value })} placeholder="Auto-fetched from IFSC" className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm" /></div>
                </div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Branch</label><input type="text" value={bank.branch} onChange={(e) => setBank({ ...bank, branch: e.target.value })} placeholder="Dwarka Branch" className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm" /></div>
              </div>
              <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={() => setStep(3)}>Back</Button><Button variant="primary" className="flex-1" disabled={!stepValid()} onClick={handleNext}>Next: Review <ArrowRight className="h-4 w-4" /></Button></div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Review & Submit</h2>
              <div className="space-y-4 mb-6">
                <div className="rounded-input border border-gray-100 bg-gray-50 p-4">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">Business Details</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><span className="text-gray-400">Owner:</span> {business.ownerName}</p>
                    <p><span className="text-gray-400">Phone:</span> {business.phone}</p>
                    <p><span className="text-gray-400">Email:</span> {business.email}</p>
                    <p><span className="text-gray-400">City:</span> {business.city}</p>
                  </div>
                </div>
                <div className="rounded-input border border-gray-100 bg-gray-50 p-4">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">Venue Details</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><span className="text-gray-400">Name:</span> {venue.name}</p>
                    <p><span className="text-gray-400">Type:</span> {venue.type}</p>
                    <p><span className="text-gray-400">Address:</span> {venue.address}, {venue.pincode}</p>
                    <p><span className="text-gray-400">Capacity:</span> {venue.capacity} guests</p>
                  </div>
                </div>
                <div className="rounded-input border border-gray-100 bg-gray-50 p-4">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">Bank Details</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><span className="text-gray-400">Holder:</span> {bank.holderName}</p>
                    <p><span className="text-gray-400">Account:</span> ****{bank.accountNumber.slice(-4)}</p>
                    <p><span className="text-gray-400">Bank:</span> {bank.bankName}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(4)}>Back</Button>
                <Button variant="primary" className="flex-1" onClick={handleSubmit}>Submit for Verification <CheckCircle className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
