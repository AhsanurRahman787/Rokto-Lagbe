'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';

const supabase = createClient();

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/login');
        return;
      }

      const user = session.user;

      // Check if profile exists
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile does not exist — create one
        await supabase.from('profiles').insert([
          {
            id: user.id,
            phone: user.phone,
            name: null,
            blood_type: null,
          },
        ]);
      } else if (existingProfile) {
        setProfile(existingProfile);
      }

      setLoading(false);
    };

    getSessionAndProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Welcome to BloodLine!</h1>
        <p className="text-gray-700 mb-2">
          You are logged in as: <span className="font-semibold">{profile?.phone}</span>
        </p>
        <p className="text-gray-700 mb-4">
          Blood Type: <span className="font-semibold">{profile?.blood_type || 'Not set'}</span>
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
