const brands = [
  { name: "Stellantis", logo: "/logos/stellantis.png" },
  { name: "Southern Wine & Spirits", logo: "/logos/southern-glazers.png" },
  { name: "Marriott", logo: "/logos/marriott.png" },
  { name: "Samsung", logo: "/logos/samsung.png" },
  { name: "Church & Dwight", logo: "/logos/church-dwight.png" },
  { name: "PG&E", logo: "/logos/pge.svg" },
  { name: "Caliber Collision", logo: null },
  { name: "Choice Hotels", logo: "/logos/choice-hotels.png" },
  { name: "Red Roof Inn", logo: "/logos/red-roof-inn.svg" },
  { name: "FTD", logo: "/logos/ftd.svg" },
];

const LogoItem = ({ brand }: { brand: { name: string; logo: string | null } }) => (
  <div className="flex-shrink-0 mx-8 md:mx-12 flex items-center justify-center h-12">
    {brand.logo ? (
      <img
        src={brand.logo}
        alt={brand.name}
        className="h-8 md:h-10 w-auto max-w-[140px] object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        loading="lazy"
      />
    ) : (
      <span className="text-[13px] md:text-[15px] font-bold tracking-[0.08em] uppercase text-gray-300 hover:text-gray-600 transition-colors duration-300 whitespace-nowrap select-none">
        {brand.name}
      </span>
    )}
  </div>
);

const BrandStrip = () => {
  return (
    <section className="py-6 bg-white border-b border-gray-100 overflow-hidden">
      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex items-center animate-logo-scroll">
          {/* First set */}
          {brands.map((brand, index) => (
            <LogoItem key={`a-${index}`} brand={brand} />
          ))}
          {/* Duplicate set for seamless loop */}
          {brands.map((brand, index) => (
            <LogoItem key={`b-${index}`} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandStrip;
