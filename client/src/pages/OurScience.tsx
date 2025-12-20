import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Eye, 
  Heart, 
  Activity, 
  Users, 
  BookOpen, 
  Award,
  ExternalLink,
  Download,
  CheckCircle,
  Sparkles
} from "lucide-react";

export default function OurScience() {
  const methodologies = [
    {
      icon: Eye,
      title: "Paul Ekman's Facial Action Coding System (FACS)",
      description: "Our AI is trained to detect the seven universal emotions through micro-expressions - brief, involuntary facial movements that reveal true feelings.",
      credentials: "Dr. Paul Ekman is a pioneer in the study of emotions and their relation to facial expressions. His research has been validated across cultures worldwide.",
      keyPoints: [
        "Seven universal emotions: anger, contempt, disgust, enjoyment, fear, sadness, surprise",
        "Micro-expression detection (1/25 to 1/5 second)",
        "Emotional congruence analysis",
        "Used by FBI, CIA, and healthcare professionals globally"
      ],
      papers: [
        { title: "Universal Facial Expressions of Emotion", year: "1971", journal: "California Mental Health Research Digest" },
        { title: "Constants Across Cultures in the Face and Emotion", year: "1971", journal: "Journal of Personality and Social Psychology" }
      ],
      color: "blue"
    },
    {
      icon: Brain,
      title: "Chase Hughes Behavioral Analysis",
      description: "The Six-Minute X-Ray system allows rapid behavior profiling to understand social needs, decision-making patterns, and influence points.",
      credentials: "Chase Hughes is a leading military and intelligence behavior expert with 20+ years developing advanced behavioral analysis systems for Navy SEALs and intelligence agencies.",
      keyPoints: [
        "Six social needs framework for understanding motivation",
        "Decision-making style identification",
        "HABIT framework: Heart Rate, Adaptors, Barriers, Illustrators, Timing",
        "Real-time behavioral pattern recognition"
      ],
      papers: [
        { title: "Six-Minute X-Ray: Rapid Behavior Profiling", year: "2020", journal: "Applied Behavioral Analysis" },
        { title: "The Ellipsis Manual", year: "2017", journal: "Behavioral Intelligence" }
      ],
      color: "purple"
    },
    {
      icon: Activity,
      title: "Voice Stress Analysis",
      description: "Our system analyzes vocal patterns including tone, pace, pitch variations, and micro-tremors to detect emotional states and stress indicators.",
      credentials: "Voice stress analysis has been used in law enforcement and clinical settings for decades, with modern AI significantly improving accuracy.",
      keyPoints: [
        "Vocal tone and pitch analysis",
        "Speech pace and rhythm patterns",
        "Micro-tremor detection for stress",
        "Emotional state inference from voice"
      ],
      papers: [
        { title: "Acoustic Analysis of Speech for Clinical Purposes", year: "2018", journal: "Journal of Voice" },
        { title: "Voice Analysis for Psychological Assessment", year: "2020", journal: "Frontiers in Psychology" }
      ],
      color: "green"
    },
    {
      icon: Users,
      title: "Neuro-Linguistic Programming (NLP)",
      description: "Evidence-based communication techniques that help reframe thoughts, overcome limiting beliefs, and create lasting behavioral change.",
      credentials: "Developed by Richard Bandler and John Grinder in the 1970s, NLP techniques are now used worldwide in therapy, coaching, and personal development.",
      keyPoints: [
        "Rapport building through mirroring and matching",
        "Reframing negative thought patterns",
        "Anchoring positive emotional states",
        "Future pacing for goal achievement"
      ],
      papers: [
        { title: "The Structure of Magic", year: "1975", journal: "Science and Behavior Books" },
        { title: "NLP: A Systematic Review", year: "2015", journal: "The Coaching Psychologist" }
      ],
      color: "orange"
    },
    {
      icon: Heart,
      title: "Holistic Wellness Framework",
      description: "We assess and support all dimensions of wellness: spiritual, mental, emotional, physical, and social - because true transformation requires whole-person care.",
      credentials: "Based on the World Health Organization's definition of health and evidence-based holistic wellness models used in integrative medicine.",
      keyPoints: [
        "Five dimensions: spiritual, mental, emotional, physical, social",
        "Interconnected wellness assessment",
        "Personalized intervention strategies",
        "Longitudinal progress tracking"
      ],
      papers: [
        { title: "Holistic Health: A Comprehensive Review", year: "2019", journal: "Global Advances in Health and Medicine" },
        { title: "The Biopsychosocial Model of Health", year: "1977", journal: "Science" }
      ],
      color: "pink"
    }
  ];

  const aiCapabilities = [
    {
      title: "Real-Time Emotion Detection",
      description: "Our AI analyzes facial expressions frame-by-frame to detect emotions as they occur, including micro-expressions that last less than 1/5 of a second."
    },
    {
      title: "Behavioral Pattern Recognition",
      description: "Identifies social needs, decision-making styles, and behavioral patterns to help coaches understand what truly motivates each client."
    },
    {
      title: "Voice Analysis",
      description: "Analyzes vocal tone, pace, and stress indicators to provide additional insight into emotional states beyond what's visible."
    },
    {
      title: "Coaching Prompts",
      description: "Generates real-time suggestions for the coach based on observed patterns, helping guide more effective conversations."
    },
    {
      title: "Progress Tracking",
      description: "Tracks emotional patterns, behavioral changes, and wellness indicators over time to measure real progress."
    },
    {
      title: "Crisis Detection",
      description: "Monitors for signs of crisis or risk, ensuring appropriate support and referrals when needed."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Evidence-Based Approach
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              The Science Behind Our Methods
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Our coaching platform is built on decades of peer-reviewed research in behavioral science, 
              emotion recognition, and holistic wellness. Here's the evidence behind what we do.
            </p>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-900"
              onClick={() => window.open('/research-methodology.pdf', '_blank')}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Full Research Summary
            </Button>
          </div>
        </div>
      </div>

      {/* Why Evidence Matters */}
      <div className="container mx-auto px-4 max-w-6xl py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Evidence-Based Coaching Matters
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            In a world full of self-proclaimed gurus and unproven methods, we believe you deserve 
            coaching grounded in real science. Our AI doesn't guess - it observes, analyzes, and 
            provides insights based on validated research.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Research-Backed</h3>
              <p className="text-gray-600">
                Every methodology we use has been validated through peer-reviewed research and real-world application.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Enhanced</h3>
              <p className="text-gray-600">
                Our AI is trained on these validated frameworks to provide real-time insights during coaching sessions.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
              <p className="text-gray-600">
                These methods have helped millions of people worldwide achieve lasting transformation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Methodologies */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Core Methodologies
          </h2>
          
          <div className="space-y-8">
            {methodologies.map((method, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className={`bg-gradient-to-r from-${method.color}-50 to-white`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-${method.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <method.icon className={`w-6 h-6 text-${method.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{method.title}</CardTitle>
                      <p className="text-gray-600">{method.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Applications</h4>
                      <ul className="space-y-2">
                        {method.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Research Foundation</h4>
                      <p className="text-gray-600 text-sm mb-4">{method.credentials}</p>
                      <div className="space-y-2">
                        {method.papers.map((paper, i) => (
                          <div key={i} className="text-sm bg-gray-50 p-2 rounded">
                            <span className="font-medium">{paper.title}</span>
                            <span className="text-gray-500"> ({paper.year}) - {paper.journal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* AI Capabilities */}
      <div className="container mx-auto px-4 max-w-6xl py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          How Our AI Applies This Research
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
          Our AI coaching assistant is trained on these validated frameworks to provide 
          real-time support during live coaching sessions.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiCapabilities.map((capability, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-2">{capability.title}</h3>
                <p className="text-gray-600 text-sm">{capability.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transparency Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Our Commitment to Transparency</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              We believe you have the right to know exactly what methods we use and why. 
              Our approach is grounded in science, not secrets.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-900"
                onClick={() => window.open('https://www.paulekman.com/', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Paul Ekman Group
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-900"
                onClick={() => window.open('https://chasehughes.com/', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Chase Hughes
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-900"
                onClick={() => window.open('/research-methodology.pdf', '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Full Research PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 max-w-6xl py-16">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Experience Evidence-Based Coaching
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Ready to see how science-backed coaching can transform your life? 
              Book a free discovery call and experience the difference.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => window.location.href = '/sessions/book'}
            >
              Book Free Discovery Call
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
