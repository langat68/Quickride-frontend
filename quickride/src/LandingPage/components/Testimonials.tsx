import "../Styling/Testimonials.scss";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "John Ngugi",
    role: "Business Executive, Nairobi",
    rating: 5,
    comment: "I hired the BMW 5 Series for a client meeting and it was the perfect choice;sleek, comfortable, and professional. QuickRide’s service was prompt and hassle-free. I’ll definitely be booking again for future business trips.",
    avatar: "https://images.unsplash.com/photo-1679480911476-3ee732578062?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAxfHxibGFjayUyMG1hbiUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
  },
  {
    id: 2,
    name: "Cosmas Ngige",
    role: "Tech Entrepreneur, Westlands",
    rating: 5,
    comment: "The Audi Q5 was the ideal match for my weekend out of town;smooth ride, top-tier tech, and great fuel efficiency. QuickRide has really nailed the balance between luxury and practicality. Highly recommend it for any executive looking to unwind in style.",
    avatar: "https://images.unsplash.com/photo-1678282955936-426bbe7a9693?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTZ8fGJsYWNrJTIwbWFuJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 3,
    name: "Emily Mukhwana",
    role: "Marketing Director, Mombasa",
    rating: 5,
    comment: "I chose the Mazda CX-5 for a family trip to Diani and it exceeded expectations. Spacious, comfortable, and reliable on both highway and off-road. QuickRide made the entire experience seamless from booking to drop-off.",
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
