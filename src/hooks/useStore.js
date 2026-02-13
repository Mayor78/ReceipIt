import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useStore() {
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user and store data
  useEffect(() => {
    loadUserAndStore();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadStore(session.user.id);
      } else {
        setUser(null);
        setStore(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserAndStore = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      
      if (currentUser) {
        await loadStore(currentUser.id);
      }
    } catch (err) {
      console.error('Error loading user/store:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStore = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }
      
      setStore(data || null);
    } catch (err) {
      console.error('Error loading store:', err);
      setError(err.message);
    }
  };

  const signUp = async (email, password, storeData) => {
    try {
      setLoading(true);
      setError(null);

      // Check if store name is available
      const { data: existingStore } = await supabase
        .from('stores')
        .select('id')
        .ilike('store_name', storeData.store_name)
        .maybeSingle();

      if (existingStore) {
        throw new Error('Store name already exists');
      }

      // Sign up user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            store_name: storeData.store_name.trim(),
            phone: storeData.phone?.trim() || '',
            address: storeData.address?.trim() || ''
          }
        }
      });

      if (signUpError) throw signUpError;

      // Wait a moment for the trigger to create the store
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (authData.user) {
        await loadStore(authData.user.id);
      }

      return { success: true, user: authData.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (error) throw error;

      if (data.user) {
        await loadStore(data.user.id);
      }

      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setStore(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    store,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
    hasStore: !!store
  };
}