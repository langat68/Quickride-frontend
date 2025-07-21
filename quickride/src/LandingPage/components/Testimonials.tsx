import "../Styling/Testimonials.scss";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Business Executive",
    rating: 5,
    comment: "Exceptional service! The BMW was pristine and the booking process was seamless. QuickRide made my business trip stress-free.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Tech Entrepreneur",
    rating: 5,
    comment: "I've used many rental services, but QuickRide stands out. The Tesla Model S was incredible, and the contactless pickup was perfect.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director",
    rating: 5,
    comment: "Amazing experience from start to finish. The Range Rover was perfect for our family vacation. Highly recommend QuickRide!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
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
            <div className="metrics__value">10,000+</div>
            <div>Happy Customers</div>
          </div>
          <div>
            <div className="metrics__value">4.9/5</div>
            <div>Average Rating</div>
          </div>
          <div>
            <div className="metrics__value">50+</div>
            <div>Premium Vehicles</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
