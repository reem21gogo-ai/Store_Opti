import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from '@/lib/LanguageContext';

// Corporate pages
import Home from '@/pages/corp/Home';
import About from '@/pages/corp/About';
import Services from '@/pages/corp/Services';
import Methodology from '@/pages/corp/Methodology';
import Consultation from '@/pages/corp/Consultation';
import Contact from '@/pages/corp/Contact';

// Store pages
import StoreHome from '@/pages/store/StoreHome';
import Products from '@/pages/store/Products';
import ProductDetail from '@/pages/store/ProductDetail';
import Assessments from '@/pages/store/Assessments';
import AssessmentDetail from '@/pages/store/AssessmentDetail';
import TakeAssessment from '@/pages/store/TakeAssessment';
import AssessmentResults from '@/pages/store/AssessmentResults';
import Cart from '@/pages/store/Cart';
import Checkout from '@/pages/store/Checkout';
import Account from '@/pages/store/Account';
import StoreLogin from '@/pages/store/StoreLogin';
import CompetencyAssessmentLanding from '@/pages/store/CompetencyAssessmentLanding';
import AssessmentIntake from '@/pages/store/AssessmentIntake';
import CompetencyLevels from '@/pages/store/CompetencyLevels';
import TakeCompetencyAssessment from '@/pages/store/TakeCompetencyAssessment';
import CompetencyReport from '@/pages/store/CompetencyReport';

// Admin
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminAssessments from '@/pages/admin/AdminAssessments';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminConsultations from '@/pages/admin/AdminConsultations';
import AdminClients from '@/pages/admin/AdminClients';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    else if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <Routes>
      {/* Corporate site */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/methodology" element={<Methodology />} />
      <Route path="/consultation" element={<Consultation />} />
      <Route path="/contact" element={<Contact />} />

      {/* Store */}
      <Route path="/store" element={<StoreHome />} />
      <Route path="/store/login" element={<StoreLogin />} />
      <Route path="/store/products" element={<Products />} />
      <Route path="/store/products/:id" element={<ProductDetail />} />
      <Route path="/store/assessments" element={<Assessments />} />
      <Route path="/store/assessments/:id" element={<AssessmentDetail />} />
      <Route path="/store/assessments/:id/take" element={<TakeAssessment />} />
      <Route path="/store/assessments/:id/results/:attemptId" element={<AssessmentResults />} />
      <Route path="/store/cart" element={<Cart />} />
      <Route path="/store/checkout" element={<Checkout />} />
      <Route path="/store/account" element={<Account />} />
      <Route path="/store/competency" element={<CompetencyAssessmentLanding />} />
      <Route path="/store/competency/levels" element={<CompetencyLevels />} />
      <Route path="/store/competency/intake" element={<AssessmentIntake />} />
      <Route path="/store/competency/assessment" element={<TakeCompetencyAssessment />} />
      <Route path="/store/competency/report/:attemptId" element={<CompetencyReport />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="assessments" element={<AdminAssessments />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="consultations" element={<AdminConsultations />} />
        <Route path="clients" element={<AdminClients />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <LanguageProvider>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
        </LanguageProvider>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;