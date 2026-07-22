const CatalogSeoSection = () => {
  return (
    <section
      aria-labelledby="seo-title"
      className="mt-16 border-t border-gray-200 pt-8 pb-12"
    >
      <h2
        id="seo-title"
        className="mb-4 text-2xl font-bold text-brand-text"
      >
        Encuentra los mejores juegos
      </h2>

      <div className="prose prose-sm md:prose-base max-w-none text-brand-text/80 space-y-4 text-sm leading-relaxed md:text-base">
        <p>
          En Jugando Toy reunimos una selección curada de juegos de mesa para
          todas las edades: desde clásicos familiares hasta novedades estratégicas
          que desafían la mente y fortalecen la convivencia en casa.
        </p>
        <p>
          También encontrarás juguetes didácticos pensados para el aprendizaje
          activo, el desarrollo de habilidades motoras y la creatividad. Compra
          con confianza, envíos a todo Chile y atención personalizada para
          elegir el regalo perfecto.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        <details className="rounded-lg border border-gray-200 bg-brand-bg px-4 py-3">
          <summary className="cursor-pointer font-medium text-brand-text">
            ¿Hacen envíos a todo Chile?
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-brand-text/80">
            Sí, despachamos a todo el territorio nacional. Los plazos varían
            según la región y el tipo de envío seleccionado al momento de la
            compra.
          </p>
        </details>

        <details className="rounded-lg border border-gray-200 bg-brand-bg px-4 py-3">
          <summary className="cursor-pointer font-medium text-brand-text">
            ¿Qué juego de mesa recomiendan para niños?
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-brand-text/80">
            Depende de la edad y el interés del niño. Te recomendamos juegos
            cooperativos y didácticos para los más pequeños, y opciones de
            estrategia ligera para mayores de 8 años.
          </p>
        </details>
      </div>
    </section>
  )
}

export default CatalogSeoSection
