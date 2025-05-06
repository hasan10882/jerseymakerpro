export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to JerseyMakerPro</h1>
      <p className="text-lg mb-8 text-center text-gray-700">
        Design your own custom sports jersey in minutes.
      </p>
      <a
        href="/designer"
        className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition"
      >
        Start Designing
      </a>
    </main>
  );
}