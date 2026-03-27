import FadeIn from "@/components/FadeIn";

const brands = [
  "Stellantis",
  "Marriott",
  "Samsung",
  "Southern Wine & Spirits",
  "Publicis Groupe",
];

const BrandStrip = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <p className="text-center text-sm font-medium text-gray-400 tracking-widest uppercase mb-10">
            Brands I've delivered for
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {brands.map((brand) => (
              <span
                key={brand}
                className="text-lg md:text-xl font-semibold text-gray-300 tracking-tight"
              >
                {brand}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default BrandStrip;
