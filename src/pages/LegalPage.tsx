import { Link, useParams } from "react-router-dom";
import Footer from "@/components/Footer";
const email="contact@anantharealestate.in";
const sections:Record<string,{title:string;parts:{heading:string;text:string}[]}> = {
"privacy-policy":{title:"Privacy Policy",parts:[
{heading:"Who we are",text:"Anantha Real Estate Consultancy provides real estate search, marketing, enquiry coordination and related advisory services from Nellore, Andhra Pradesh, India. Contact: contact@anantharealestate.in or +91 63029 66604."},
{heading:"Information we collect",text:"When you contact us, we may collect your name, phone number, optional email, enquiry details, property preferences, and information you voluntarily provide. We also receive limited technical information and campaign attribution when permitted."},
{heading:"Why we use information",text:"We use enquiry details to respond to requests, coordinate property information and site visits, and provide requested services. Optional analytics and marketing technologies are used only after you opt in."},
{heading:"Sharing and retention",text:"We may share enquiry details with relevant project developers, authorized representatives, and service providers where necessary to fulfil your request. Please avoid sharing identity documents or sensitive personal information through general enquiry forms. We retain information only as long as needed for service delivery, legal obligations and legitimate recordkeeping; specific retention periods may vary."},
{heading:"Your choices and requests",text:"You can withdraw optional cookie consent through Cookie settings, ask to access or correct your enquiry information, or request deletion by contacting contact@anantharealestate.in with subject 'Data request'. We may need to verify your identity and may retain information required by law."},
{heading:"Security and updates",text:"We use service providers to process enquiry and website data. No online system is entirely risk-free. We may update this notice; the current version is published here."}
]},
"terms-of-service":{title:"Terms of Service",parts:[
{heading:"Our services",text:"Information on this website is for general property discovery, enquiry and coordination. Availability, approvals, dimensions, prices and amenities must be independently confirmed with the relevant developer, owner and competent authorities before any commitment."},
{heading:"No transaction guarantee",text:"Submitting an enquiry does not reserve a property or establish an agency agreement. Investment outcomes, appreciation and financing are not guaranteed. Seek independent legal and financial advice before a purchase."},
{heading:"Fees and disclosures",text:"Any brokerage, marketing or professional fees, if applicable, must be separately disclosed and agreed before the chargeable service is provided. We do not impose undisclosed website checkout fees."},
{heading:"Content and contact",text:"Images and project details may be supplied by third parties and are subject to verification. Do not misuse this site or submit another person's information without permission. Contact contact@anantharealestate.in for questions."}
]},
"refund-policy":{title:"Refund Policy",parts:[
{heading:"Website enquiries",text:"Browsing our website and submitting a general property enquiry does not itself require payment, so there is no payment to refund for these activities."},
{heading:"Paid services",text:"If a separate paid marketing, advisory, booking or brokerage service is offered, its fee, cancellation and refund terms must be disclosed in the applicable written agreement or receipt before payment. Refund eligibility depends on those agreed terms and applicable law."},
{heading:"Developer payments",text:"Property advances, booking amounts and payments made to developers or sellers are governed by their contracts and applicable law; they are not automatically refundable through Anantha Real Estate. For assistance, contact contact@anantharealestate.in."}
]},
"cookie-policy":{title:"Cookie Policy",parts:[
{heading:"Essential storage",text:"The website may use essential browser storage to remember your cookie choice and operate requested features."},
{heading:"Optional analytics and marketing",text:"With your permission, Google Analytics/Tag Manager and Meta Pixel may use cookies or similar technologies to measure site activity and advertising effectiveness. Declining optional cookies should not prevent browsing or sending an enquiry."},
{heading:"Change your choice",text:"Use the Cookie settings control in the site footer to change or withdraw your choice. You can also manage cookies in your browser. Some third-party embedded content may set its own cookies when you choose to use it."}
]},
"data-deletion":{title:"Data Access & Deletion Requests",parts:[
{heading:"Request your data or deletion",text:"Email contact@anantharealestate.in with the subject 'Data deletion request', 'Data access request' or 'Data correction request'. Include the phone number or email you used to enquire and the nature of your request. Do not email sensitive identity documents unless specifically requested through a secure channel."},
{heading:"What happens next",text:"We will verify that the request concerns your data, review information held in our enquiry systems and with relevant service providers, and respond. Some records may need to be retained for legal or contractual reasons."}
]}
};
export default function LegalPage(){const {slug}=useParams();const page=sections[slug||""];if(!page)return <main className="p-12"><h1>Page not found</h1><Link to="/">Home</Link></main>;return <><main id="main-content" className="mx-auto max-w-3xl px-5 pb-20 pt-32 text-slate-800"><Link to="/" className="text-sm text-blue-800 underline">← Back to home</Link><h1 className="mt-6 text-4xl font-bold text-slate-950">{page.title}</h1><p className="mt-3 text-sm text-slate-600">Anantha Real Estate Consultancy · Updated 13 October 2026</p>{page.parts.map(s=><section key={s.heading} className="mt-9"><h2 className="text-xl font-semibold">{s.heading}</h2><p className="mt-3 leading-7">{s.text}</p></section>)}<p className="mt-10">Questions? <a className="underline text-blue-800" href={`mailto:${email}`}>{email}</a></p></main><Footer/></>}
