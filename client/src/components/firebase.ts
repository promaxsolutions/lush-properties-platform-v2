// Mock Firebase for demo purposes
export const app = null;

// Mock auth functions for demo
export const auth = {
  currentUser: null
};

export const onAuthStateChanged = (authInstance: any, callback: (user: any) => void) => {
  // Auto-login for demo
  setTimeout(() => {
    if (typeof callback === 'function') {
      callback({ 
        email: "demo@example.com", 
        uid: "demo-user" 
      });
    }
  }, 100);
  return () => {};
};

export const signInWithEmailAndPassword = async (auth: any, email: string, password: string) => {
  // Mock login - always succeeds for demo
  return Promise.resolve({ 
    user: { 
      email, 
      uid: "demo-user" 
    } 
  });
};

export const createUserWithEmailAndPassword = async (auth: any, email: string, password: string) => {
  return Promise.resolve({ 
    user: { 
      email, 
      uid: "demo-user" 
    } 
  });
};

export const signOut = async (auth: any) => {
  return Promise.resolve();
};

export const getAuth = () => auth;