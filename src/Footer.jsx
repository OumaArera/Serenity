import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-6 text-center shadow-md mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-xl font-semibold mb-2 text-blue-700">Insight Wellbeing P/L</h4>
          <p className="text-sm text-gray-400">&copy; 2024. All rights reserved.</p>
        </div>
        <nav className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-blue-700 hover:text-blue-500 transition-colors duration-300">Home</a>
          <a href="#" className="text-blue-700 hover:text-blue-500 transition-colors duration-300">About</a>
          <a href="#" className="text-blue-700 hover:text-blue-500 transition-colors duration-300">Contact</a>
        </nav>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-gray-200 transition-colors duration-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35c-.73 0-1.325.595-1.325 1.325v21.351c0 .73.595 1.324 1.325 1.324h11.495v-9.294h-3.123v-3.622h3.123v-2.671c0-3.1 1.892-4.788 4.656-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.793.715-1.793 1.764v2.312h3.584l-.467 3.622h-3.117v9.294h6.112c.73 0 1.325-.594 1.325-1.324v-21.351c0-.73-.595-1.325-1.325-1.325z" />
            </svg>
          </a>
          <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-gray-200 transition-colors duration-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.611 1.798-1.574 2.165-2.723-.951.563-2.005.974-3.127 1.195-.897-.956-2.178-1.555-3.594-1.555-2.72 0-4.923 2.203-4.923 4.923 0 .386.043.761.127 1.122-4.09-.205-7.719-2.165-10.141-5.144-.424.725-.667 1.567-.667 2.465 0 1.701.866 3.197 2.181 4.077-.804-.026-1.562-.247-2.224-.616v.062c0 2.374 1.689 4.352 3.932 4.803-.411.111-.844.171-1.291.171-.316 0-.624-.03-.924-.087.625 1.953 2.436 3.374 4.584 3.414-1.68 1.316-3.809 2.102-6.115 2.102-.397 0-.788-.023-1.175-.069 2.179 1.398 4.768 2.214 7.548 2.214 9.051 0 13.999-7.496 13.999-13.986 0-.213-.005-.426-.014-.637.961-.695 1.796-1.562 2.457-2.549z" />
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-gray-200 transition-colors duration-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.994 3h-15.989c-1.102 0-2.005.903-2.005 2.005v15.99c0 1.101.903 2.005 2.005 2.005h15.99c1.101 0 2.005-.904 2.005-2.005v-15.99c0-1.102-.904-2.005-2.005-2.005zm-11.428 16.229h-3.099v-8.964h3.099v8.964zm-1.55-10.229c-.991 0-1.79-.8-1.79-1.79 0-.991.8-1.79 1.79-1.79.991 0 1.79.8 1.79 1.79s-.8 1.79-1.79 1.79zm12.978 10.229h-3.099v-4.414c0-1.05-.021-2.4-1.464-2.4-1.466 0-1.69 1.145-1.69 2.327v4.487h-3.099v-8.964h2.972v1.224h.041c.413-.779 1.423-1.6 2.928-1.6 3.132 0 3.709 2.062 3.709 4.744v5.596z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
