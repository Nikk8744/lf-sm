const Testimonials = () => {
    const testimonials = [
      {
        id: 1,
        name: "Sarah Johnson",
        text: "The produce from Farm Mart is always fresh and delicious. I love knowing exactly which farm my food comes from!"
      },
      {
        id: 2,
        name: "Michael Rodriguez",
        text: "Fast delivery and excellent customer service. The organic vegetables have transformed my cooking!"
      },
      {
        id: 3,
        name: "Emily Chen",
        text: "I love being able to support local farmers while getting the best quality produce delivered right to my door."
      }
    ];
  
    return (
      <section className="py-16 bg-[#48b5bb]/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">`{testimonial.text}`</p>
                <div className="font-semibold">{testimonial.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Testimonials;