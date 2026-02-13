// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadStore(session.user.id);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadStore(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadStore(userId) {
    const { data } = await supabase
      .from('stores')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    setStore(data);
  }

  async function signUp(email, password, storeData) {
    // First check if store name exists
    const { data: existing } = await supabase
      .from('stores')
      .select('id')
      .ilike('store_name', storeData.store_name);

    if (existing?.length > 0) {
      throw new Error('Store name already exists');
    }

    // Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) throw authError;

    // Create store record
    if (authData.user) {
      const { error: storeError } = await supabase
        .from('stores')
        .insert([{
          user_id: authData.user.id,
          store_name: storeData.store_name,
          phone: storeData.phone,
          address: storeData.address
        }]);

      if (storeError) throw storeError;
    }

    return authData;
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  return {
    user,
    store,
    loading,
    signUp,
    signIn,
    signOut
  };
}