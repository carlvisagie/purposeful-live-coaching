import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import { wellnessModulesData } from "@/data/wellnessModulesData";

// Curated reading lists for each module
const readingLists = {
  "emotional-wellness": [
    {
      title: "Emotional Intelligence 2.0",
      author: "Travis Bradberry & Jean Greaves",
      type: "Book",
      description: "Practical strategies to increase your EQ with a step-by-step program.",
      link: "https://www.amazon.com/Emotional-Intelligence-2-0-Travis-Bradberry/dp/0974320625"
    },
    {
      title: "The Gifts of Imperfection",
      author: "Brené Brown",
      type: "Book",
      description: "Let go of who you think you're supposed to be and embrace who you are.",
      link: "https://www.amazon.com/Gifts-Imperfection-Think-Supposed-Embrace/dp/159285849X"
    },
    {
      title: "Understanding and Managing Emotions",
      author: "American Psychological Association",
      type: "Article",
      description: "Research-based guide to emotional regulation and well-being.",
      link: "https://www.apa.org/topics/emotion"
    }
  ],
  "mental-health": [
    {
      title: "Feeling Good: The New Mood Therapy",
      author: "David D. Burns",
      type: "Book",
      description: "The clinically proven drug-free treatment for depression using cognitive behavioral therapy.",
      link: "https://www.amazon.com/Feeling-Good-New-Mood-Therapy/dp/0380810336"
    },
    {
      title: "The Anxiety and Phobia Workbook",
      author: "Edmund J. Bourne",
      type: "Book",
      description: "Comprehensive guide to understanding and overcoming anxiety disorders.",
      link: "https://www.amazon.com/Anxiety-Phobia-Workbook-Edmund-Bourne/dp/1626252157"
    },
    {
      title: "Mental Health Foundation",
      author: "Mental Health Foundation",
      type: "Resource",
      description: "Evidence-based information on mental health conditions and treatments.",
      link: "https://www.mentalhealth.org.uk/"
    }
  ],
  "physical-fitness": [
    {
      title: "Bigger Leaner Stronger",
      author: "Michael Matthews",
      type: "Book",
      description: "The simple science of building the ultimate male body.",
      link: "https://www.amazon.com/Bigger-Leaner-Stronger-Building-Ultimate/dp/1938895304"
    },
    {
      title: "Starting Strength",
      author: "Mark Rippetoe",
      type: "Book",
      description: "Basic barbell training for strength and fitness.",
      link: "https://www.amazon.com/Starting-Strength-Basic-Barbell-Training/dp/0982522738"
    },
    {
      title: "Exercise Guidelines",
      author: "American College of Sports Medicine",
      type: "Resource",
      description: "Evidence-based exercise recommendations for health and fitness.",
      link: "https://www.acsm.org/education-resources/trending-topics-resources/physical-activity-guidelines"
    }
  ],
  "nutrition": [
    {
      title: "How Not to Die",
      author: "Michael Greger, MD",
      type: "Book",
      description: "Discover the foods scientifically proven to prevent and reverse disease.",
      link: "https://www.amazon.com/How-Not-Die-Discover-Scientifically/dp/1250066115"
    },
    {
      title: "Precision Nutrition",
      author: "John Berardi & Ryan Andrews",
      type: "Book",
      description: "The essentials of sport and exercise nutrition.",
      link: "https://www.amazon.com/Precision-Nutrition-Essentials-Exercise-Certification/dp/0973597054"
    },
    {
      title: "Dietary Guidelines for Americans",
      author: "USDA",
      type: "Resource",
      description: "Evidence-based nutritional guidance for health promotion and disease prevention.",
      link: "https://www.dietaryguidelines.gov/"
    }
  ],
  "spiritual-wellness": [
    {
      title: "The Power of Now",
      author: "Eckhart Tolle",
      type: "Book",
      description: "A guide to spiritual enlightenment and living in the present moment.",
      link: "https://www.amazon.com/Power-Now-Guide-Spiritual-Enlightenment/dp/1577314808"
    },
    {
      title: "Man's Search for Meaning",
      author: "Viktor E. Frankl",
      type: "Book",
      description: "Finding purpose and meaning even in the most difficult circumstances.",
      link: "https://www.amazon.com/Mans-Search-Meaning-Viktor-Frankl/dp/080701429X"
    },
    {
      title: "The Four Agreements",
      author: "Don Miguel Ruiz",
      type: "Book",
      description: "A practical guide to personal freedom based on ancient Toltec wisdom.",
      link: "https://www.amazon.com/Four-Agreements-Practical-Personal-Freedom/dp/1878424319"
    }
  ]
};

export default function ModuleResources() {
  const [, params] = useRoute("/wellness-modules/:slug/resources");
  const slug = params?.slug || "";
  
  const module = wellnessModulesData[slug];
  const resources = readingLists[slug] || [];
  
  if (!module) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Module not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Link to={`/wellness-modules/${slug}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {module.title}
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {module.title} - Reading List
          </h1>
          <p className="text-xl text-gray-600">
            Curated books, articles, and resources to deepen your understanding
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  <Badge variant="secondary">{resource.type}</Badge>
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
                <CardDescription>{resource.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                <a 
                  href={resource.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    View Resource
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {resources.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Reading list coming soon
              </h3>
              <p className="text-gray-600">
                We're curating the best resources for this module.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
