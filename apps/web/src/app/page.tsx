export default function Home() {
  return (
    <div className="max-w-2xl mx-auto">
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Speech Score Engine</h2>
        <p className="text-gray-600 mb-6">
          Layer 1: Dialogue Looping Tracker Sequence
        </p>
        <p className="text-gray-600 mb-8">
          Write dialogue, segment into phrase-events, assign speakers and voices,
          create loop and sequence patterns, and hear timed playback.
        </p>
        <div className="flex gap-4">
          <a
            href="/scenes/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Scene
          </a>
          <a
            href="/scenes"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Scenes
          </a>
        </div>
      </section>

      <section className="mb-12">
        <h3 className="text-xl font-semibold mb-4">Features</h3>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Paste or type dialogue with speaker detection</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Segment lines into loopable phrase-events</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Configure repeat count, stagger timing, duration mode</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Assign voices to speakers (multiple TTS providers)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Play, pause, seek with visual playback tracker</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Save and restore versions</span>
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">Supported TTS Providers</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium">ElevenLabs</h4>
            <p className="text-sm text-gray-500">Proprietary</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium">Coqui TTS</h4>
            <p className="text-sm text-gray-500">Open Source</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium">VALL-E</h4>
            <p className="text-sm text-gray-500">Open Source</p>
          </div>
        </div>
      </section>
    </div>
  );
}