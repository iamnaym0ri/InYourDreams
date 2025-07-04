import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ImageProvider } from '../ImageContext.jsx';
import './index.css';
import App from './App.jsx';
import Gallery from './Gallery.jsx'; 
import GalleryPage from './GalleryPage.jsx';
import LegalPage from './Legal.jsx';
import DMCA from './DMCA.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ImageProvider>
        <Routes>
        <Route path="/" element={<App />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/page/:id" element={<GalleryPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/DMCA" element={<DMCA />} />
      </Routes>
      </ImageProvider>
    </BrowserRouter>
  </StrictMode>
);
