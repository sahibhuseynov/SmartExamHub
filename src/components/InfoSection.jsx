
const InfoSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-8">Why Choose Us?</h2>
        <p className="text-lg text-gray-600 mb-12">
          Cırtdan helps kids learn while having fun! Explore quizzes, tests, and interactive games designed for children.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">
              Fun & Interactive
            </h3>
            <p className="text-gray-600">
              Our activities are designed to make learning enjoyable and exciting!
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">
              Safe & Secure
            </h3>
            <p className="text-gray-600">
              We prioritize your child’s privacy and online safety at all times.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">
              Easy to Use
            </h3>
            <p className="text-gray-600">
              Intuitive and user-friendly design for kids of all ages.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
