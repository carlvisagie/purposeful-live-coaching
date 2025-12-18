import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import IndividualLanding from "./pages/IndividualLanding";
import MissionControl from "./pages/MissionControl";
import Clients from "./pages/Clients";
import NewClient from "./pages/NewClient";
import CoachSetup from "./pages/CoachSetup";
import ClientDetail from "./pages/ClientDetail";
import MySessions from "./pages/MySessions";
import BookSession from "./pages/BookSession";
import CoachAvailability from "./pages/CoachAvailability";
import ManageSessionTypes from "./pages/ManageSessionTypes";
import AICoach from "./pages/AICoach";
import EmotionTracker from "./pages/EmotionTracker";
import WellnessModules from "./pages/WellnessModules";
import WellnessModuleDetail from "./pages/WellnessModuleDetail";
import LessonViewer from "./pages/LessonViewer";
import ModuleResources from "./pages/ModuleResources";
import DailyCheckIn from "./pages/DailyCheckIn";
import MorningRoutine from "./pages/MorningRoutine";
import EveningReview from "./pages/EveningReview";
import HealthTracker from "./pages/HealthTracker";
import StressRelief from "./pages/StressRelief";
import CoachDashboard from "./pages/CoachDashboard";
import AutismDashboard from "./pages/AutismDashboard";
import CreateAutismProfile from "./pages/CreateAutismProfile";
import AutismProfileDetail from "./pages/AutismProfileDetail";
import AutismInterventions from "./pages/AutismInterventions";
import LiveSessionAssistant from "./pages/LiveSessionAssistant";
import CoachingScripts from "./pages/CoachingScripts";
import Pricing from "./pages/Pricing";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SessionPurchaseSuccess from "./pages/SessionPurchaseSuccess";
import AdminAIMonitoring from "./pages/AdminAIMonitoring";
import AdminClientHistory from "./pages/AdminClientHistory";
import AdminDashboard from "./pages/AdminDashboard";
import MyFiles from "./pages/MyFiles";
import MyProfile from "./pages/MyProfile";
import RefundPolicy from "./pages/RefundPolicy";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminSetup from "./pages/AdminSetup";
import OwnerControlCenterV2 from "./pages/OwnerControlCenterV2";
import TrialWrapper from "./components/TrialWrapper";


function Router() {
  // make sure to consider if you need authentication for certain routes
  // Force fresh build - Dec 13, 2025
  return (
    <Switch>
      <Route path={"/"} component={IndividualLanding} />
      <Route path="/individual-coaching" component={IndividualLanding} />
      <Route path="/dashboard" component={MissionControl} />
      <Route path="/mission-control" component={MissionControl} />
      <Route path="/clients" component={Clients} />
      <Route path="/clients/new" component={NewClient} />
      <Route path="/clients/:id" component={ClientDetail} />
      <Route path="/coach/setup" component={CoachSetup} />
      <Route path="/my-sessions" component={MySessions} />
      <Route path="/sessions/book" component={BookSession} />
      <Route path="/coach/availability" component={CoachAvailability} />
      <Route path="/coach/session-types" component={ManageSessionTypes} />
      <Route path="/ai-coach" component={AICoach} />
      <Route path="/emotions" component={EmotionTracker} />
      <Route path="/wellness-modules" component={WellnessModules} />
      <Route path="/wellness-modules/:slug" component={WellnessModuleDetail} />
      <Route path="/wellness-modules/:slug/resources" component={ModuleResources} />
      <Route path="/wellness-modules/:moduleSlug/lesson/:lessonIndex" component={LessonViewer} />
      <Route path="/daily-check-in" component={DailyCheckIn} />
      <Route path="/daily-os/morning" component={MorningRoutine} />
      <Route path="/daily-os/evening" component={EveningReview} />
      <Route path="/health-tracker" component={HealthTracker} />
      <Route path="/stress-relief" component={StressRelief} />

      <Route path="/coach/dashboard" component={OwnerControlCenterV2} />
      <Route path="/owner" component={OwnerControlCenterV2} />
      <Route path="/autism" component={AutismDashboard} />
      <Route path="/autism/create-profile" component={CreateAutismProfile} />
      <Route path="/autism/profile/:id" component={AutismProfileDetail} />
      <Route path="/autism/interventions/:id" component={AutismInterventions} />
      <Route path="/live-session" component={LiveSessionAssistant} />
      <Route path="/coaching-scripts" component={CoachingScripts} />
      <Route path="/pricing" component={Pricing} />

      <Route path="/subscription/success" component={SubscriptionSuccess} />
      <Route path="/subscription/session-success" component={SessionPurchaseSuccess} />
      <Route path="/admin" component={OwnerControlCenterV2} />
      <Route path="/admin/ai-monitoring" component={AdminAIMonitoring} />
      <Route path="/admin/client-history" component={AdminClientHistory} />
      <Route path="/my-files" component={MyFiles} />
      <Route path="/my-profile" component={MyProfile} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/privacy-policy-v2" component={PrivacyPolicy} />
      <Route path="/admin/setup" component={AdminSetup} />

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
        <TooltipProvider>
          <Toaster />
          <TrialWrapper>
            <Router />
          </TrialWrapper>
        </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
