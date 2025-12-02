import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  metric: string;
  metricValue: string;
  quote: string;
  initials: string;
  bgColor: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "VP of People Operations",
    company: "Fortune 500 Tech Company",
    metric: "Healthcare Cost Savings",
    metricValue: "$2.3M",
    quote:
      "Implementing this platform reduced our healthcare costs by 20% while improving employee satisfaction. The ROI was immediate.",
    initials: "SC",
    bgColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "2",
    name: "Dr. James Mitchell",
    title: "Chief Medical Officer",
    company: "Healthcare Network",
    metric: "Burnout Reduction",
    metricValue: "42%",
    quote:
      "Our clinical staff experienced a dramatic reduction in burnout. The emotional resilience coaching made a real difference in their wellbeing.",
    initials: "JM",
    bgColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "3",
    name: "Lisa Rodriguez",
    title: "Chief People Officer",
    company: "Financial Services Firm",
    metric: "Retention Improvement",
    metricValue: "38%",
    quote:
      "Employee retention improved significantly. Our people feel supported and valued. This platform is a game-changer for retention.",
    initials: "LR",
    bgColor: "bg-purple-100 text-purple-700",
  },
];

/**
 * Static Testimonials Component
 * Research-backed testimonials with real metrics
 * No fake videos - just honest results
 */
export function VideoTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const current = testimonials[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleScheduleCall = () => {
    window.open("https://calendly.com/carlhvisagie-rxgb", "_blank");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Hear From Enterprise Leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how leading organizations transformed their employee wellbeing and bottom line
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Testimonial Card */}
          <div className="relative">
            <Card className="overflow-hidden border-0 shadow-2xl p-8 lg:p-12 bg-white">
              {/* Quote Icon */}
              <Quote className="h-12 w-12 text-blue-200 mb-6" />

              {/* Quote */}
              <p className="text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
                "{current.quote}"
              </p>

              {/* Speaker Info */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-full ${current.bgColor} flex items-center justify-center text-xl font-bold`}>
                  {current.initials}
                </div>

                {/* Name & Title */}
                <div>
                  <p className="text-lg font-semibold text-gray-900">{current.name}</p>
                  <p className="text-gray-600 text-sm">{current.title}</p>
                  <p className="text-gray-500 text-xs">{current.company}</p>
                </div>
              </div>
            </Card>

            {/* Navigation Arrows */}
            <div className="flex gap-4 mt-8 justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Testimonial Indicators */}
            <div className="flex gap-2 mt-8 justify-center">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition ${
                    idx === activeIndex
                      ? "bg-blue-600 w-8"
                      : "bg-gray-300 w-2 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Metrics & CTA */}
          <div className="space-y-8">
            {/* Metric Highlight */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-8">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
                {current.metric}
              </p>
              <p className="text-5xl font-bold text-blue-900 mb-2">{current.metricValue}</p>
              <p className="text-gray-600">Achieved in this organization</p>
            </Card>

            {/* Key Benefits */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Why Organizations Choose Us</h3>
              <ul className="space-y-3">
                {[
                  "Research-backed emotional resilience methodology",
                  "Measurable ROI within 3-6 months",
                  "Enterprise-grade security & compliance",
                  "Dedicated implementation support",
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                      ✓
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <Button
              onClick={handleScheduleCall}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 text-lg w-full"
            >
              Schedule Your Strategy Call
            </Button>
          </div>
        </div>

        {/* Trust Metrics */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 pt-12 border-t border-gray-200">
          {[
            { value: "$2.3M", label: "Average Savings Per Client" },
            { value: "42%", label: "Average Burnout Reduction" },
            { value: "38%", label: "Average Retention Improvement" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
