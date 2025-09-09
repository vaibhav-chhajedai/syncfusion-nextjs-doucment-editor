import SyncfusionSetup from './components/SyncfusionSetup';
import ClientWordProcessor from './components/ClientWordProcessor';

export default function Page() {
  return (
    <main className="container mx-auto p-6">
      <SyncfusionSetup />
      <div className="rounded-xl border bg-white shadow">
        <div className="border-b px-4 py-2 text-xl font-semibold">
          Syncfusion Word Processor – Next.js
        </div>
        <div className="p-4">
          <ClientWordProcessor />
        </div>
      </div>
    </main>
  );
}
