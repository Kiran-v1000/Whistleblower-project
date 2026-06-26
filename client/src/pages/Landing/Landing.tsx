import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-hero-gradient px-8 py-14 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Speak Up. Stay Protected.</h1>
        <p className="mt-3 max-w-2xl text-white/85">
          The Utthunga Ethics & Compliance Portal lets you report misconduct, harassment, fraud, or
          policy violations confidentially — or fully anonymously. Reports go directly to the Ethics
          Officer and are never visible to your manager or HR unless you choose otherwise.
        </p>
        <div className="mt-6 flex gap-4">
          <Link to="/report" className="rounded-lg bg-white px-5 py-2.5 font-semibold text-navy hover:bg-white/90">
            Submit a Concern
          </Link>
          <Link
            to="/track"
            className="rounded-lg border border-white/40 px-5 py-2.5 font-semibold hover:bg-white/10"
          >
            Track an Existing Report
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Confidential by Design",
            body: "Your identity is encrypted and never exposed to anyone outside the Ethics Officer.",
          },
          {
            title: "No Retaliation",
            body: "Utthunga's policy strictly prohibits retaliation against anyone who reports in good faith.",
          },
          {
            title: "Track Anytime",
            body: "Use your report ID to check status updates without revealing who you are.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-navy">{item.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{item.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
