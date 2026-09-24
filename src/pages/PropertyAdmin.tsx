import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, Clock3, Eye, RefreshCcw, ShieldCheck, XCircle, AlertTriangle, LogOut, LockKeyhole, Pencil, Save, ExternalLink } from "lucide-react";

type Listing = Record<string, any> & {
  public_id: string;
  owner_name: string;
  phone: string;
  property_type: string;
  location: string;
  verification_status?: string;
  status?: string;
  publish_status?: string;
  availability_status?: string;
  admin_notes?: string;
  photos?: unknown;
  created_at?: string;
};

type ApiResponse = { email?: string; csrf?: string; listings?: Listing[]; error?: string };

const statusOptions = [
  { value: "PENDING", label: "Pending", icon: Clock3 },
  { value: "APPROVED", label: "Approved", icon: CheckCircle2 },
  { value: "NEEDS_CORRECTION", label: "Needs Correction", icon: AlertTriangle },
  { value: "REJECTED", label: "Rejected", icon: XCircle },
];

function photosFrom(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
    } catch {
      return [];
    }
  }
  return [];
}

function prettyKey(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function PropertyAdmin() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [csrf, setCsrf] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("PENDING");
  const [selected, setSelected] = useState<Listing | null>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [adminPhotos, setAdminPhotos] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [editDetails, setEditDetails] = useState<Record<string,string>>({});

  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/property-admin", { cache: "no-store" });
      const data: ApiResponse = await r.json();
      if (r.status === 401) {
        setListings([]);
        setEmail("");
        setCsrf("");
        return;
      }
      if (!r.ok) throw new Error(data.error || "Could not load property submissions.");
      setListings(data.listings || []);
      setEmail(data.email || "");
      setCsrf(data.csrf || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load property submissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const auth = new URLSearchParams(window.location.search).get("auth");
    if (auth) setError(auth === "unauthorized" ? "This Google account is not approved for property administration." : "Google sign-in could not be completed. Please try again.");
    void load();
  }, []);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/property-auth?action=logout", { method: "POST" });
      setEmail("");
      setCsrf("");
      setListings([]);
      setSelected(null);
    } finally {
      setBusy(false);
    }
  }

  const filtered = useMemo(() => listings.filter((l) => (l.verification_status || "PENDING") === filter), [listings, filter]);
  const counts = useMemo(() => Object.fromEntries(statusOptions.map((s) => [s.value, listings.filter((l) => (l.verification_status || "PENDING") === s.value).length])), [listings]);

  const editableFields=[["property_type","Property Type"],["location","Location"],["area","Area"],["area_unit","Area Unit"],["facing","Facing"],["total_valuation","Total Valuation"],["per_unit_valuation","Per Unit Valuation"],["bedrooms","Bedrooms"],["apartment_name","Apartment Name"],["flat_number","Flat Number"],["property_age","Property Age / Condition"],["floors","Floors"],["constructed_area","Constructed Area"],["parking","Parking"],["godown_plot_type","Godown / Plot Type"],["notes","Additional Details"]] as const;
  function beginEdit(){if(!selected)return;setEditDetails(Object.fromEntries(editableFields.map(([k])=>[k,String(selected[k]??"")])));setEditing(true);}
  async function saveDetails(){if(!selected)return;setBusy(true);setError("");try{const r=await fetch("/api/property-admin",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-Token":csrf},body:JSON.stringify({publicId:selected.public_id,editDetails})});const data=await r.json();if(!r.ok)throw new Error(data.error||"Could not save property details.");setSelected(data.listing);setListings(xs=>xs.map(x=>x.public_id===data.listing.public_id?data.listing:x));setEditing(false);}catch(e){setError(e instanceof Error?e.message:"Could not save property details.");}finally{setBusy(false);}}
  async function addPhotos() { if (!selected || !adminPhotos.length) return; setBusy(true); setError(""); try { const r=await fetch("/api/property-admin",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-Token":csrf},body:JSON.stringify({publicId:selected.public_id,adminPhotos})}); const data=await r.json(); if(!r.ok)throw new Error(data.error||"Could not add photos."); setAdminPhotos([]); await load(); setSelected((s)=>s?{...s,photos:data.listing?.photos||s.photos}:s); } catch(e){setError(e instanceof Error?e.message:"Could not add photos.");} finally{setBusy(false);} }

  function choosePhotos(files: FileList | null) { if (!files||!selected) return; const remaining=Math.max(0,5-photosFrom(selected.photos).length); const chosen=Array.from(files).slice(0,remaining); setBusy(true);setError(""); Promise.all(chosen.map(file=>new Promise<string>((resolve,reject)=>{if(!file.type.startsWith("image/")||file.size>5*1024*1024)return reject(new Error("Each image must be under 5 MB."));const reader=new FileReader();reader.onload=async()=>{try{const alt=`${selected.property_type} in ${selected.location}`;const r=await fetch("/api/property-media",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-Token":csrf},body:JSON.stringify({publicId:selected.public_id,dataUrl:String(reader.result),fileName:file.name,altText:alt})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Upload failed.");resolve(d.url)}catch(e){reject(e)}};reader.onerror=()=>reject(new Error("Could not read image."));reader.readAsDataURL(file)}))).then(x=>setAdminPhotos(x)).catch(e=>setError(e instanceof Error?e.message:"Upload failed.")).finally(()=>setBusy(false)); }

  async function mediaAction(mediaAction:string,mediaIndex:number,mediaAlt=""){ if(!selected)return; setBusy(true);setError("");try{const r=await fetch("/api/property-admin",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-Token":csrf},body:JSON.stringify({publicId:selected.public_id,mediaAction,mediaIndex,mediaAlt})});const data=await r.json();if(!r.ok)throw new Error(data.error||"Could not update photo.");setSelected(data.listing);setListings(xs=>xs.map(x=>x.public_id===data.listing.public_id?data.listing:x));}catch(e){setError(e instanceof Error?e.message:"Could not update photo.");}finally{setBusy(false);} }

  async function updateAvailability(availabilityStatus: string) {
    if (!selected) return; setBusy(true); setError("");
    try { const r=await fetch("/api/property-admin",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-Token":csrf},body:JSON.stringify({publicId:selected.public_id,availabilityStatus,adminNotes:notes})});const data=await r.json();if(!r.ok)throw new Error(data.error||"Could not update availability.");setSelected(null);await load();} catch(e){setError(e instanceof Error?e.message:"Could not update availability.");} finally{setBusy(false);}
  }

  async function updatePublication(publishStatus: string) {
    if (!selected) return;
    setBusy(true); setError("");
    try {
      const r=await fetch("/api/property-admin",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-Token":csrf},body:JSON.stringify({publicId:selected.public_id,publishStatus,adminNotes:notes})});
      const data=await r.json(); if(!r.ok) throw new Error(data.error||"Could not update publication status.");
      setSelected(null); setNotes(""); await load();
    } catch(e){setError(e instanceof Error?e.message:"Could not update publication status.");} finally {setBusy(false);}
  }

  async function updateStatus(verificationStatus: string) {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/property-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        body: JSON.stringify({ publicId: selected.public_id, verificationStatus, adminNotes: notes }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Could not update property.");
      setSelected(null);
      setNotes("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update property.");
    } finally {
      setBusy(false);
    }
  }

  if (!loading && !email) {
    return (
      <main className="min-h-screen bg-[#f7f9ff] grid place-items-center px-4">
        <Helmet>
          <title>Property Admin | Anantha Real Estate</title>
          <meta name="robots" content="noindex,nofollow" />
          <meta name="referrer" content="no-referrer" />
        </Helmet>
        <div className="w-full max-w-md rounded-3xl border bg-white p-7 md:p-9 shadow-xl">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f0efff] text-[#605e8a]"><LockKeyhole size={22}/></div>
          <p className="mt-6 text-sm font-semibold text-[#605e8a]">Anantha Real Estate</p>
          <h1 className="mt-2 text-3xl font-bold">Admin Login</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">Sign in to securely access property verification.</p>
          {error && <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</div>}
          <a href="/admin/login" className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#605e8a] to-[#5eb1e3] px-5 py-3 font-semibold text-white shadow-lg">Go to Admin Login</a>
          <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">Only administrator emails approved for Anantha can open this dashboard.</p>
          <a href="/" className="mt-6 block text-center text-sm font-semibold text-slate-500 hover:text-[#605e8a]">Back to website</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9ff] text-slate-900 p-4 md:p-8">
      <Helmet>
        <title>Property Verification | Anantha Real Estate</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="referrer" content="no-referrer" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <a href="/" className="text-sm font-semibold text-[#605e8a]">Anantha Real Estate</a>
            <h1 className="text-3xl md:text-4xl font-bold mt-2">Property Verification Dashboard</h1>
            <p className="text-slate-500 mt-2">Review owner submissions before they enter your verified inventory.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {email && <span className="text-sm text-slate-500">Signed in as {email}</span>}<a href="/properties" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">View Website <ExternalLink size={15}/></a>
            <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold"><RefreshCcw size={16}/> Refresh</button>
            <button disabled={busy} onClick={() => void logout()} className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold"><LogOut size={16}/> Sign out</button>
          </div>
        </div>

        {error && <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error}</div>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statusOptions.map(({ value, label, icon: Icon }) => (
            <button key={value} onClick={() => setFilter(value)} className={`rounded-2xl border p-4 text-left transition ${filter === value ? "bg-white shadow-md border-[#807cb7]" : "bg-white/70"}`}>
              <div className="flex items-center justify-between"><span className="text-sm font-semibold">{label}</span><Icon size={18} className="text-[#605e8a]"/></div>
              <p className="text-3xl font-bold mt-3">{counts[value] || 0}</p>
            </button>
          ))}
        </div>

        {loading ? <div className="rounded-2xl bg-white p-10 text-center">Loading property submissions…</div> : filtered.length === 0 ? <div className="rounded-2xl border bg-white p-10 text-center text-slate-500">No {filter.toLowerCase().replace(/_/g, " ")} properties.</div> : (
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
            <section className="rounded-2xl border bg-white overflow-hidden">
              <div className="p-5 border-b"><h2 className="font-bold text-lg">{filter.replace(/_/g, " ")}</h2></div>
              <div className="divide-y max-h-[70vh] overflow-auto">
                {filtered.map((l) => (
                  <button key={l.public_id} onClick={() => { setSelected(l); setNotes(l.admin_notes || ""); }} className={`w-full p-5 text-left hover:bg-slate-50 ${selected?.public_id === l.public_id ? "bg-[#f2f1ff]" : ""}`}>
                    <div className="flex items-start justify-between gap-3"><div><p className="font-bold">{l.property_type} · {l.location}</p><p className="text-sm text-slate-500 mt-1">{l.owner_name} · {l.phone}</p></div><Eye size={18} className="text-slate-400"/></div>
                    <div className="mt-3 flex gap-2 flex-wrap text-xs text-slate-500"><span>{l.public_id}</span>{l.area && <span>· {l.area} {l.area_unit || ""}</span>}{l.created_at && <span>· {new Date(l.created_at).toLocaleDateString()}</span>}</div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border bg-white p-5 md:p-7 min-h-[420px]">
              {!selected ? <div className="h-full grid place-items-center text-slate-400 text-center"><div><ShieldCheck className="mx-auto mb-3"/><p>Select a property to review its complete details.</p></div></div> : (
                <div>
                  <div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] font-bold text-[#807cb7]">{selected.public_id}</p><h2 className="text-2xl font-bold mt-2">{selected.property_type} in {selected.location}</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{selected.verification_status || "PENDING"}</span></div>

                  <div className="mt-6 flex items-center justify-between gap-3"><h3 className="font-bold">Property Details</h3><button disabled={busy} onClick={()=>editing?setEditing(false):beginEdit()} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold"><Pencil size={15}/>{editing?"Cancel Edit":"Edit Details"}</button></div>{editing&&<div className="mt-4 rounded-2xl border bg-slate-50 p-4"><div className="grid sm:grid-cols-2 gap-4">{editableFields.map(([key,label])=><label key={key} className={`${key==="notes"?"sm:col-span-2":""} grid gap-1.5 text-xs font-semibold text-slate-600`}>{label}{key==="notes"?<textarea rows={5} value={editDetails[key]||""} onChange={e=>setEditDetails(x=>({...x,[key]:e.target.value}))} className="rounded-xl border bg-white p-3 text-sm font-normal"/>:key==="property_type"?<select value={editDetails[key]||""} onChange={e=>setEditDetails(x=>({...x,[key]:e.target.value}))} className="rounded-xl border bg-white p-3 text-sm font-normal">{["Plot","Flat","House","Godown","Other"].map(x=><option key={x}>{x}</option>)}</select>:<input value={editDetails[key]||""} onChange={e=>setEditDetails(x=>({...x,[key]:e.target.value}))} className="rounded-xl border bg-white p-3 text-sm font-normal"/>}</label>)}</div><button disabled={busy} onClick={()=>void saveDetails()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#605e8a] px-5 py-3 text-sm font-semibold text-white"><Save size={16}/>Save Changes</button></div>}<div className="grid sm:grid-cols-2 gap-3 mt-4">
                    {Object.entries(selected).filter(([key, value]) => value !== null && value !== "" && !["id", "photos", "admin_notes"].includes(key)).map(([key, value]) => (
                      <div key={key} className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] uppercase tracking-wide text-slate-400">{prettyKey(key)}</p><p className="text-sm font-medium mt-1 break-words">{typeof value === "object" ? JSON.stringify(value) : String(value)}</p></div>
                    ))}
                  </div>

                  {photosFrom(selected.photos).length > 0 && <div className="mt-6"><div className="flex items-end justify-between gap-3 mb-3"><div><h3 className="font-bold">Property Photos</h3><p className="text-xs text-slate-500">Choose what appears publicly, select the cover image and add SEO alt text.</p></div></div><div className="grid md:grid-cols-2 gap-4">{photosFrom(selected.photos).map((src,i)=>{const pub=Array.isArray(selected.public_photo_indexes)?selected.public_photo_indexes.includes(i):true;const primary=selected.primary_photo_index===i||(!Number.isInteger(selected.primary_photo_index)&&i===0);const alts=selected.photo_alt_texts&&typeof selected.photo_alt_texts==="object"?selected.photo_alt_texts:{};return <div key={i} className="rounded-xl border p-3"><div className="relative"><img src={src} alt={alts[String(i)]||`Property ${i+1}`} className="w-full aspect-[4/3] object-cover rounded-lg"/>{primary&&<span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-xs font-bold">Primary</span>}</div><div className="mt-3 flex gap-2"><button disabled={busy} onClick={()=>void mediaAction("TOGGLE_PUBLIC",i)} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${pub?"bg-emerald-50 text-emerald-800":"bg-slate-50"}`}>{pub?"Public":"Private"}</button><button disabled={busy||primary} onClick={()=>void mediaAction("SET_PRIMARY",i)} className="rounded-lg border px-3 py-2 text-xs font-semibold">Set Primary</button></div><div className="mt-3 flex gap-2"><input id={`alt-${i}`} defaultValue={alts[String(i)]||""} placeholder={`${selected.property_type} in ${selected.location} - front view`} className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-xs"/><button disabled={busy} onClick={()=>{const el=document.getElementById(`alt-${i}`) as HTMLInputElement|null;void mediaAction("SET_ALT",i,el?.value||"")}} className="rounded-lg bg-[#605e8a] px-3 py-2 text-xs font-semibold text-white">Save ALT</button></div></div>})}</div></div>}

                  <div className="mt-6 rounded-2xl border p-4"><h3 className="font-bold">Admin Property Photos</h3><p className="mt-1 text-xs text-slate-500">Add photos while reviewing. Images are stored in optimized public object storage; maximum 5 photos total, each under 5 MB.</p><input type="file" accept="image/*" multiple onChange={(e)=>choosePhotos(e.target.files)} className="mt-4 block w-full text-sm"/>{adminPhotos.length>0&&<div className="mt-3 grid grid-cols-3 gap-2">{adminPhotos.map((src,i)=><img key={i} src={src} alt={`New property photo ${i+1}`} className="aspect-square w-full rounded-lg border object-cover"/>)}</div>}<button disabled={busy||!adminPhotos.length} onClick={()=>void addPhotos()} className="mt-4 rounded-xl bg-[#605e8a] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Add Photos</button></div>\n\n                  <label className="grid gap-2 mt-6 text-sm font-semibold">Admin notes<textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className="rounded-xl border p-3 font-normal" placeholder="Verification notes, missing documents, correction required…"/></label>

                  <div className="mt-6 rounded-2xl border bg-white p-4"><div className="flex items-center justify-between"><div><p className="font-bold">Availability</p><p className="text-xs text-slate-500">Sold and withdrawn properties are automatically unpublished.</p></div><span className="rounded-full border px-3 py-1 text-xs font-semibold">{selected.availability_status || "AVAILABLE"}</span></div><div className="grid grid-cols-2 gap-2 mt-4">{["AVAILABLE","HOLD","SOLD","WITHDRAWN"].map(x=><button key={x} disabled={busy} onClick={()=>void updateAvailability(x)} className="rounded-xl border px-3 py-2 text-sm font-semibold">{x}</button>)}</div></div>
                  {selected.verification_status === "APPROVED" && <div className="mt-6 rounded-2xl border bg-[#f7f9ff] p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-bold">Public listing</p><p className="text-xs text-slate-500 mt-1">Verification and publication are separate. Publish only after public details are ready.</p></div><span className="rounded-full bg-white border px-3 py-1 text-xs font-semibold">{selected.publish_status || "DRAFT"}</span></div><div className="grid sm:grid-cols-2 gap-3 mt-4">{selected.publish_status === "PUBLISHED" ? <button disabled={busy} onClick={() => void updatePublication("UNPUBLISHED")} className="rounded-xl border px-4 py-3 font-semibold">Unpublish</button> : <button disabled={busy} onClick={() => void updatePublication("PUBLISHED")} className="rounded-xl bg-[#605e8a] text-white px-4 py-3 font-semibold">Publish to Website</button>}<button disabled={busy} onClick={() => void updatePublication("DRAFT")} className="rounded-xl border px-4 py-3 font-semibold">Keep as Draft</button></div></div>}

                  <div className="grid sm:grid-cols-2 gap-3 mt-6">
                    <button disabled={busy} onClick={() => void updateStatus("APPROVED")} className="rounded-xl bg-emerald-600 text-white px-4 py-3 font-semibold">Verify & Approve</button>
                    <button disabled={busy} onClick={() => void updateStatus("NEEDS_CORRECTION")} className="rounded-xl bg-amber-500 text-white px-4 py-3 font-semibold">Needs Correction</button>
                    <button disabled={busy} onClick={() => void updateStatus("REJECTED")} className="rounded-xl bg-rose-600 text-white px-4 py-3 font-semibold">Reject</button>
                    <button disabled={busy} onClick={() => void updateStatus("PENDING")} className="rounded-xl border px-4 py-3 font-semibold">Move to Pending</button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
