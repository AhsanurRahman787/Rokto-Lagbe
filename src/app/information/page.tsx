'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';


import bcrypt from 'bcryptjs';

// Add this declaration to let TypeScript know about window.google
declare global {
  interface Window {
    google: any;
  }
}
const supabase = createClient();

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function InformationPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);

  // Check session and setup Google autocomplete
  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: any } }) => {
      if (!data.session) {
        router.replace('/login');
      } else {
        setSession(data.session);
      }
    });

    // Setup Google Places Autocomplete
    const loadAutocomplete = () => {
      if (autocompleteRef.current && window.google) {
        const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            const lat = place.geometry.location.lat();
            const lon = place.geometry.location.lng();
            setLocation({ lat, lon });
          }
        });
      }
    };

    const interval = setInterval(() => {
      if (window.google && window.google.maps) {
        loadAutocomplete();
        clearInterval(interval);
      }
    }, 500);
  }, [router]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lon: longitude });
        },
        err => alert('Location access denied.')
      );
    } else {
      alert('Geolocation not supported.');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!username || !password || !bloodType) {
      alert('Please fill all required fields');
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);
    const { user } = session;

    const { error } = await supabase.from('profiles').update({
      username,
      password_hash,
      blood_type: bloodType,
      location_lat: location?.lat ?? null,
      location_lon: location?.lon ?? null,
    }).eq('id', user.id);

    if (error) {
      alert(error.message);
    } else {
      router.push('/');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-red-600">Complete Your Profile</h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-2 border rounded-md"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-md"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <select
          className="w-full px-4 py-2 border rounded-md"
          value={bloodType}
          onChange={e => setBloodType(e.target.value)}
          required
        >
          <option value="">Select Blood Type</option>
          {bloodTypes.map(bt => (
            <option key={bt} value={bt}>{bt}</option>
          ))}
        </select>

        <input
          ref={autocompleteRef}
          type="text"
          placeholder="Search your location"
          className="w-full px-4 py-2 border rounded-md"
        />

        <button
          type="button"
          className="text-blue-600 text-sm underline"
          onClick={getCurrentLocation}
        >
          Use my current location
        </button>

        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded-md w-full hover:bg-red-700"
        >
          Save Information
        </button>
      </form>
    </main>
  );
}
