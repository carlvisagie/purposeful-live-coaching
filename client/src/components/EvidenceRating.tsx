/**
 * EvidenceRating Component
 * 
 * Displays the Evidence Strength Rating (ESR) for recommendations
 * with clickable access to source studies.
 * 
 * Part of the "Keepers of the Truth" Evidence Validation System
 */

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, AlertTriangle, Info, BookOpen } from "lucide-react";

export interface EvidenceSource {
  id: string;
  title: string;
  authors: string;
  journal?: string;
  year?: number;
  url: string;
  studyType: string;
}

export interface EvidenceRatingProps {
  level: 1 | 2 | 3 | 4 | 5;
  stars: string;
  label: string;
  description: string;
  confidenceScore: number;
  isControversial?: boolean;
  controversyReason?: string;
  sourceCount: number;
  sources: EvidenceSource[];
  compact?: boolean;
}

const LEVEL_COLORS = {
  1: "bg-green-100 text-green-800 border-green-300",
  2: "bg-blue-100 text-blue-800 border-blue-300",
  3: "bg-yellow-100 text-yellow-800 border-yellow-300",
  4: "bg-orange-100 text-orange-800 border-orange-300",
  5: "bg-gray-100 text-gray-800 border-gray-300",
};

const LEVEL_DOT_COLORS = {
  1: "bg-green-500",
  2: "bg-blue-500",
  3: "bg-yellow-500",
  4: "bg-orange-500",
  5: "bg-gray-500",
};

export function EvidenceRating({
  level,
  stars,
  label,
  description,
  confidenceScore,
  isControversial = false,
  controversyReason,
  sourceCount,
  sources,
  compact = false,
}: EvidenceRatingProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (compact) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border ${LEVEL_COLORS[level]} hover:opacity-80 transition-opacity cursor-pointer text-sm font-medium`}
          >
            <span className="font-semibold">{stars}</span>
            <span className="text-xs">{label}</span>
            {isControversial && <AlertTriangle className="h-3 w-3 text-yellow-600" />}
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <EvidenceDetails
            level={level}
            stars={stars}
            label={label}
            description={description}
            confidenceScore={confidenceScore}
            isControversial={isControversial}
            controversyReason={controversyReason}
            sourceCount={sourceCount}
            sources={sources}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${LEVEL_DOT_COLORS[level]}`} />
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>{stars}</span>
                <span>{label}</span>
                {isControversial && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Controversial
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Confidence: {confidenceScore}% • {sourceCount} {sourceCount === 1 ? "source" : "sources"}
              </CardDescription>
            </div>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <BookOpen className="h-4 w-4" />
                View Sources
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <EvidenceDetails
                level={level}
                stars={stars}
                label={label}
                description={description}
                confidenceScore={confidenceScore}
                isControversial={isControversial}
                controversyReason={controversyReason}
                sourceCount={sourceCount}
                sources={sources}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{description}</p>
        {isControversial && controversyReason && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800">{controversyReason}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EvidenceDetails({
  level,
  stars,
  label,
  description,
  confidenceScore,
  isControversial,
  controversyReason,
  sourceCount,
  sources,
}: Omit<EvidenceRatingProps, "compact">) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <span>{stars}</span>
          <span>{label}</span>
        </DialogTitle>
        <DialogDescription>
          {description}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 mt-4">
        {/* Evidence Strength Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Evidence Level</CardDescription>
              <CardTitle className="text-2xl">{stars}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Confidence Score</CardDescription>
              <CardTitle className="text-2xl">{confidenceScore}%</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Controversy Alert */}
        {isControversial && controversyReason && (
          <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">Controversial Evidence</h4>
                <p className="text-sm text-yellow-800">{controversyReason}</p>
              </div>
            </div>
          </div>
        )}

        {/* What This Means */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">What This Means</h4>
              <p className="text-sm text-blue-800">
                {level === 1 && "This recommendation is backed by multiple high-quality studies with consistent findings. You can have very high confidence in following this advice."}
                {level === 2 && "This recommendation is supported by good-quality research with generally consistent findings. You can have moderate confidence in following this advice."}
                {level === 3 && "This recommendation shows promise in preliminary research, but more studies are needed to confirm the findings. Consider it with appropriate caution."}
                {level === 4 && "This recommendation is based on early research that requires further validation. Treat it as an emerging possibility rather than established fact."}
                {level === 5 && "This recommendation is based primarily on expert opinion or anecdotal evidence. Limited scientific research supports it at this time."}
              </p>
            </div>
          </div>
        </div>

        {/* Source Studies */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            Supporting Research ({sourceCount} {sourceCount === 1 ? "study" : "studies"})
          </h4>
          <div className="space-y-3">
            {sources.map((source) => (
              <Card key={source.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-semibold text-gray-900 leading-snug">
                        {source.title}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {source.authors}
                        {source.journal && ` • ${source.journal}`}
                        {source.year && ` • ${source.year}`}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {source.studyType}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                    onClick={() => window.open(source.url, "_blank")}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Full Study
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Keepers of the Truth Badge */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <BookOpen className="h-4 w-4" />
            <span>Validated by <strong>Keepers of the Truth</strong> Evidence System</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default EvidenceRating;
