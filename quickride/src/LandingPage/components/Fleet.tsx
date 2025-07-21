import "../Styling/Fleet.scss";
import { Users, Fuel, Settings } from "lucide-react";
import sedanImage from "../../assets/vadym-kudriavtsev-Yv2sZDSnlZY-unsplash.jpg";
import suvImage from "../../assets/vadym-kudriavtsev-Yv2sZDSnlZY-unsplash.jpg";
import sportsImage from "../../assets/vadym-kudriavtsev-Yv2sZDSnlZY-unsplash.jpg";

const cars = [
  {
    id: 1,
    name: "BMW 3 Series",
    category: "Luxury Sedan",
    image: sedanImage,
    pricePerDay: 89,
    features: { passengers: 5, fuel: "Hybrid", transmission: "Auto" },
    description: "Perfect blend of luxury and performance"
  },
  {
    id: 2,
    name: "Mercedes GLE",
    category: "Premium SUV",
    image: suvImage,
    pricePerDay: 129,
    features: { passengers: 7, fuel: "Diesel", transmission: "Auto" },
    description: "Spacious comfort for family adventures"
  },
  {
    id: 3,
    name: "Porsche 911",
    category: "Sports Car",
    image: sportsImage,
    pricePerDay: 299,
    features: { passengers: 2, fuel: "Petrol", transmission: "Auto" },
    description: "Pure driving excitement and performance"
  },
  {
    id: 4,
    name: "Tesla Model S",
    category: "Electric Luxury",
    image: sedanImage,
    pricePerDay: 149,
    features: { passengers: 5, fuel: "Electric", transmission: "Auto" },
    description: "Zero emissions, maximum innovation"
  },
  {
    id: 5,
    name: "Range Rover Sport",
    category: "Luxury SUV",
    image: suvImage,
    pricePerDay: 189,
    features: { passengers: 5, fuel: "Hybrid", transmission: "Auto" },
    description: "Uncompromising luxury meets capability"
  },
  {
    id: 6,
    name: "McLaren 570S",
    category: "Supercar",
    image: sportsImage,
    pricePerDay: 599,
    features: { passengers: 2, fuel: "Petrol", transmission: "Auto" },
    description: "Ultimate performance and precision"
  }
];

const Fleet = () => {
  return (
    <section id="fleet" className="fleet">
      <div className="fleet__container">
        <div className="fleet__header">
          <h2>Our Premium Fleet</h2>
          <p>
            Choose from our carefully curated collection of luxury vehicles.
            Every car is meticulously maintained and ready for your journey.
          </p>
        </div>

        <div className="fleet__grid">
          {cars.map((car) => (
            <div key={car.id} className="fleet__card">
              <div className="fleet__image-wrapper">
                <img src={car.image} alt={car.name} />
                <span className="fleet__category">{car.category}</span>
              </div>

              <div className="fleet__content">
                <div className="fleet__title-price">
                  <h3>{car.name}</h3>
                  <div>
                    <span className="fleet__price">${car.pricePerDay}</span>
                    <span>/day</span>
                  </div>
                </div>

                <p className="fleet__description">{car.description}</p>

                <div className="fleet__features">
                  <div><Users size={16} /> {car.features.passengers}</div>
                  <div><Fuel size={16} /> {car.features.fuel}</div>
                  <div><Settings size={16} /> {car.features.transmission}</div>
                </div>

                <button className="fleet__button">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Fleet;
