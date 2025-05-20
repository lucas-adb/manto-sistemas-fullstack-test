import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { StyleProvider } from '@ant-design/cssinjs';
import './index.css';
import App from './App.tsx';
import TasksPage from './pages/TasksPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyleProvider layer>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Routes>
      </BrowserRouter>
    </StyleProvider>
  </StrictMode>
);
