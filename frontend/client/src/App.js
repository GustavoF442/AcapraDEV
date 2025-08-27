import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import './App.css';
import logo from './materiais/logo roxa.png';
import Animals from './pages/Animals';
import AnimalDetail from './pages/AnimalDetail';
import AdoptionForm from './pages/AdoptionForm';
import About from './pages/About';
import Donations from './pages/Donations';
import Contact from './pages/Contact';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Stories from './pages/Stories';
import AnimalAbuse from './pages/AnimalAbuse';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminAnimals from './pages/admin/Animals';
import AdminAdoptions from './pages/admin/Adoptions';
import AdminNews from './pages/admin/News';
import AdminContacts from './pages/admin/Contacts';
import AnimalForm from './pages/admin/AnimalForm';
import NewsForm from './pages/admin/NewsForm';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Rotas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/animais" element={<Animals />} />
                <Route path="/animais/:id" element={<AnimalDetail />} />
                <Route path="/adotar/:id" element={<AdoptionForm />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/doacoes" element={<Donations />} />
                <Route path="/historias" element={<Stories />} />
                <Route path="/noticias" element={<News />} />
                <Route path="/noticias/:id" element={<NewsDetail />} />
                <Route path="/maus-tratos" element={<AnimalAbuse />} />
                <Route path="/contato" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                
                {/* Rotas administrativas */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/animais" element={
                  <ProtectedRoute>
                    <AdminAnimals />
                  </ProtectedRoute>
                } />
                <Route path="/admin/adocoes" element={
                  <ProtectedRoute>
                    <AdminAdoptions />
                  </ProtectedRoute>
                } />
                <Route path="/admin/noticias" element={
                  <ProtectedRoute>
                    <AdminNews />
                  </ProtectedRoute>
                } />
                <Route path="/admin/contatos" element={
                  <ProtectedRoute>
                    <AdminContacts />
                  </ProtectedRoute>
                } />
                <Route path="/admin/animais/novo" element={
                  <ProtectedRoute>
                    <AnimalForm />
                  </ProtectedRoute>
                } />
                <Route path="/admin/animais/editar/:id" element={
                  <ProtectedRoute>
                    <AnimalForm />
                  </ProtectedRoute>
                } />
                <Route path="/admin/noticias/nova" element={
                  <ProtectedRoute>
                    <NewsForm />
                  </ProtectedRoute>
                } />
                <Route path="/admin/noticias/editar/:id" element={
                  <ProtectedRoute>
                    <NewsForm />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
