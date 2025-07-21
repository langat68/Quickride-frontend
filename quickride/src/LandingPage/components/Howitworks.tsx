import { Search, Car, Key, CheckCircle } from "lucide-react";
import "../Styling/Howitworks.scss";

const steps = [
  {
    icon: Search,
    title: "Search & Compare",
    description: "Browse our extensive fleet and compare prices, features, and availability in real-time.",
    step: "01"
  },
  {
    icon: Car,
    title: "Select Your Car",
    description: "Choose the perfect vehicle for your needs and confirm your booking with instant confirmation.",
    step: "02"
  },
  {
    icon: Key,
    title: "Quick Pickup",
    description: "Arrive at your chosen location for a fast, contactless pickup experience.",
    step: "03"
  },
  {
    icon: CheckCircle,
    title: "Hit the Road",
    description: "Enjoy your journey with 24/7 roadside assistance and flexible return options.",
    step: "04"
  }
];

const HowItWorks = () => {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>
            Renting with QuickRide is simple, fast, and hassle-free. Get on the road in just 4 easy steps.
          </p>
        </div>

        <div className="steps">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div className="step-card" key={index}>
                <div className="step-number">{step.step}</div>
                <div className="step-icon">
                  <Icon size={32} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="step-lines">
          <div className="line line-1" />
          <div className="line line-2" />
          <div className="line line-3" />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
