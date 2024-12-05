import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-center">
          <p className="text-gray-600 text-sm">
            Thereza Festas {currentYear} - Todos os Direitos Reservados 
          </p>
        </div>
      </div>
    </footer>
  );
}
