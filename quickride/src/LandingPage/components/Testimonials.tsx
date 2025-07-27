import "../Styling/Testimonials.scss";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "John Ngughi",
    role: "Business Executive",
    rating: 5,
    comment: "Exceptional service! The BMW was pristine and the booking process was seamless. QuickRide made my business trip stress-free.",
    avatar: "https://images.unsplash.com/photo-1679480911476-3ee732578062?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAxfHxibGFjayUyMG1hbiUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
  },
  {
    id: 2,
    name: "Cosmas Ngige",
    role: "Tech Entrepreneur",
    rating: 5,
    comment: "I've used many rental services, but QuickRide stands out. The Tesla Model S was incredible, and the contactless pickup was perfect.",
    avatar: "https://images.unsplash.com/photo-1678282955936-426bbe7a9693?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTZ8fGJsYWNrJTIwbWFuJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 3,
    name: "Emily Mukhwana",
    role: "Marketing Director",
    rating: 5,
    comment: "Amazing experience from start to finish. The Range Rover was perfect for our family vacation. Highly recommend QuickRide!",
    avatar: "https://images.unsplash.com/photo-1676327478489-ae4f973d0bbe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIyfHx8ZW58MHx8fHx8"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="testimonials">
      <div className="testimonials__container">
        <div className="testimonials__header">
          <h2>What Our Customers Say</h2>
          <p>
            Don’t just take our word for it. See what our satisfied customers have to say about their QuickRide experience.
          </p>
        </div>

        <div className="testimonials__grid">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonials__card">
              <div className="testimonials__stars">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={20} fill="#f4a261" color="#f4a261" />
                ))}
              </div>

              <blockquote>"{t.comment}"</blockquote>

              <div className="testimonials__user">
                <img src={t.avatar} alt={t.name} />
                <div>
                  <h4>{t.name}</h4>
                  <p>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials__metrics">
          <div>
            <div className="metrics__value">100+</div>
            <div>Happy Customers</div>
          </div>
          <div>
            <div className="metrics__value">4.6/5</div>
            <div>Average Rating</div>
          </div>
          <div>
            <div className="metrics__value">15+</div>
            <div>Premium Vehicles</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
