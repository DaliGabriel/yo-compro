import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold mb-4">
          ¿Buscas un carro? Deja de buscar. <br /> Deja que el carro te
          encuentre.
        </h1>
        <p className="text-lg mb-8 max-w-xl">
          En <strong>Yo Vendo</strong>, tú publicas lo que estás buscando y los
          vendedores llegan a ti. Ahorra tiempo y encuentra el auto ideal sin
          salir de casa.
        </p>
        <div className="flex gap-4">
          <Link
            href="/comprador"
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700"
          >
            Quiero comprar un carro
          </Link>
          <Link
            href="/vendedor"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-2xl hover:bg-gray-300"
          >
            Quiero vender un carro
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
