import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import IndividualLanding from "./pages/IndividualLanding";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import NewClient from "./pages/NewClient";
import CoachSetup from "./pages/CoachSetup";
import ClientDetail from "./pages/ClientDetail";
import MySessions from "./pages/MySessions";
import CoachAvailability from "./pages/CoachAvailability";
import ManageSessionTypes from "./pages/ManageSessionTypes";
import AICoach from "./pages/AICoach";
import EmotionTracker from "./pages/EmotionTracker";
import InsightsDashboard from "./pages/InsightsDashboard";
import CoachDashboard from "./pages/CoachDashboard";
import AutismDashboard from "./pages/AutismDashboard";
import CreateAutismProfile from "./pages/CreateAutismProfile";
import LiveSessionAssistant from "./pages/LiveSessionAssistant";
import Pricing from "./pages/Pricing";
import SubscriptionDashboard from "./pages/SubscriptionDashboard";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SessionPurchaseSuccess from "./pages/SessionPurchaseSuccess";
import AdminAIMonitoring from "./pages/AdminAIMonitoring";
import AdminClientHistory from "./pages/AdminClientHistory";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={IndividualLanding} />
      <Route path="/individual-coaching" component={IndividualLanding} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/clients" component={Clients} />
      <Route path="/clients/new" component={NewClient} />
      <Route path="/clients/:id" component={ClientDetail} />
      <Route path="/coach/setup" component={CoachSetup} />
      <Route path="/my-sessions" component={MySessions} />
      <Route path="/coach/availability" component={CoachAvailability} />
      <Route path="/coach/session-types" component={ManageSessionTypes} />
      <Route path="/ai-coach" component={AICoach} />
      <Route path="/emotions" component={EmotionTracker} />
      <Route path="/insights" component={InsightsDashboard} />
      <Route path="/coach/dashboard" component={CoachDashboard} />
      <Route path="/autism" component={AutismDashboard} />
      <Route path="/autism/create-profile" component={CreateAutismProfile} />
      <Route path="/live-session" component={LiveSessionAssistant} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/subscription" component={SubscriptionDashboard} />
      <Route path="/subscription/success" component={SubscriptionSuccess} />
      <Route path="/subscription/session-success" component={SessionPurchaseSuccess} />
      <Route path="/admin/ai-monitoring" component={AdminAIMonitoring} />
      <Route path="/admin/client-history" component={AdminClientHistory} />
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
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
