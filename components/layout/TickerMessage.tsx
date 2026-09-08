import {
  BadgePercent,
  Headphones,
  ShieldCheck,
  Truck,
} from "lucide-react";

const messages = [
  {
    icon: Truck,
    text: "Free delivery on selected orders",
  },
  {
    icon: BadgePercent,
    text: "Special discounts available today",
  },
  {
    icon: ShieldCheck,
    text: "Secure and protected payments",
  },
  {
    icon: Headphones,
    text: "Customer support available",
  },
];

function MessageGroup() {
  return (
    <div className="ticker-group">
      {messages.map(({ icon: Icon, text }) => (
        <div
          key={text}
          className="flex shrink-0 items-center gap-2 px-10 text-sm font-medium"
        >
          <Icon className="h-4 w-4 text-emerald-100" />

          <span>{text}</span>

          <span className="ml-8 h-1.5 w-1.5 rounded-full bg-emerald-200" />
        </div>
      ))}
    </div>
  );
}

export default function TickerMessage() {
  return (
    <section className="ticker overflow-hidden bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 py-2.5 text-white">
      <div className="ticker-track">
        <MessageGroup />

        {/* Duplicate group makes the animation continuous */}
        <div aria-hidden="true">
          <MessageGroup />
        </div>
      </div>
    </section>
  );
}
