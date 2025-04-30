declare global {
    namespace NodeJS {
      interface ProcessEnv {
        REACT_APP_API_BASE_URL: string;
        NODE_ENV: 'development' | 'production';
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}