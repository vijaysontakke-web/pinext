import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="w-full max-w-3xl bg-white dark:bg-black rounded-lg p-8 shadow-sm prose prose-slate dark:prose-invert">
          {/* Centered logo/image */}
          <div className="flex justify-center mb-6">
            <Image src="/pinext-logo.avif" alt="Pinext" width={192} height={64} className="mx-auto rounded" />
          </div>
        <h1 className="text-3xl font-semibold mb-4">Delivering practical, reliable technology</h1>

        <p>
          We help companies optimize their operations, save costs, and transform their customer experience through applied technology.
        </p>

        <p>
          We offer solutions ranging from self-checkout, computer vision, and real-time analytics to critical infrastructure, IoT, and specialized support.
        </p>

        <p>
          Our goal is simple: to make your business more efficient, more secure, and always one step ahead in innovation. To achieve this, we create
          smart spaces where technology not only supports operations but enhances them: reducing risks, ensuring continuity, and freeing up
          resources so you can focus on growth.
        </p>

      </main>
    </div>
  );
}
